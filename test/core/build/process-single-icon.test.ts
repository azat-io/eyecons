import { beforeEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import type { FormattedIconValue } from '../../../extension/types/icon'
import type { Config } from '../../../extension/types/config'
import type { Theme } from '../../../extension/types/theme'

import { prepareIconProcessing } from '../../../extension/core/icon/prepare-icon-processing'
import { processSingleIcon } from '../../../extension/core/build/process-single-icon'
import { adaptIconColors } from '../../../extension/core/color/adapt-icon-colors'
import { getIconSource } from '../../../extension/io/file/get-icon-source'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('node:fs/promises', () => ({
  default: {
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  },
}))

vi.mock('node:path', () => ({
  default: {
    dirname: vi.fn(),
    join: vi.fn(),
  },
}))

vi.mock('../../../extension/core/icon/prepare-icon-processing', () => ({
  prepareIconProcessing: vi.fn(),
}))

vi.mock('../../../extension/io/file/get-icon-source', () => ({
  getIconSource: vi.fn(),
}))

vi.mock('../../../extension/core/color/adapt-icon-colors', () => ({
  adaptIconColors: vi.fn(),
}))

vi.mock('../../../extension/io/vscode/logger', () => ({
  logger: {
    withContext: vi.fn(),
    error: vi.fn(),
  },
}))

describe('processSingleIcon', () => {
  let mockIcon: FormattedIconValue
  let mockTheme: Theme
  let mockConfig: Config
  let mockPreparedIcon: ReturnType<typeof prepareIconProcessing>

  beforeEach(() => {
    vi.clearAllMocks()

    mockIcon = {
      extensions: ['html', 'htm'],
      theme: 'dark',
      type: 'files',
      name: 'HTML',
      id: 'html',
    }

    mockTheme = {
      colors: ['#000000', '#ffffff'],
      overrides: {},
    } as Theme

    mockConfig = {
      processing: {
        extremeLightnessThresholds: { light: 0.95, dark: 0.05 },
        lowSaturationThreshold: 0.05,
        saturationFactor: 1.2,
        adjustContrast: true,
      },
      iconDefinitionsPath: 'icons/definitions.json',
      outputPath: '/mock/extension/path/output',
      extensionPath: '/mock/extension/path',
      sourceIconsPath: 'icons/source',
      outputIconsPath: 'icons/theme',
      version: '1.0.0',
    } as Config

    mockPreparedIcon = {
      temporaryFilePath: '/tmp/icons/html-abc123.svg',
      iconPath: './icons/html-abc123.svg',
      fileName: 'html-abc123.svg',
      isLight: false,
      baseId: 'html',
      hash: 'abc123',
      type: 'files',
      id: 'html',
    }

    vi.mocked(prepareIconProcessing).mockReturnValue(mockPreparedIcon)
    vi.mocked(getIconSource).mockResolvedValue('<svg>Mock Icon</svg>')
    vi.mocked(adaptIconColors).mockReturnValue('<svg>Adapted Icon</svg>')
    vi.mocked(fs.writeFile).mockResolvedValue()
    vi.mocked(path.dirname).mockReturnValue('/tmp/icons')
  })

  it('should process a single icon correctly', async () => {
    let result = await processSingleIcon(
      {
        temporaryDirectory: '/tmp/icons',
        icon: mockIcon,
      },
      mockTheme,
      mockConfig,
    )

    expect(prepareIconProcessing).toHaveBeenCalledWith(
      {
        temporaryDirectory: '/tmp/icons',
        icon: mockIcon,
      },
      mockTheme,
      mockConfig,
    )

    expect(getIconSource).toHaveBeenCalledWith('html', 'files', mockConfig)

    expect(adaptIconColors).toHaveBeenCalledWith(
      {
        svgContent: '<svg>Mock Icon</svg>',
        id: 'html',
      },
      mockTheme,
      mockConfig,
    )

    expect(path.dirname).toHaveBeenCalledWith('/tmp/icons/html-abc123.svg')
    expect(fs.mkdir).toHaveBeenCalledWith('/tmp/icons', { recursive: true })

    expect(fs.writeFile).toHaveBeenCalledWith(
      '/tmp/icons/html-abc123.svg',
      '<svg>Adapted Icon</svg>',
      'utf8',
    )

    expect(result).toEqual({
      iconPath: './icons/html-abc123.svg',
      id: 'html',
    })
  })

  it('should process a light theme icon correctly', async () => {
    mockIcon.theme = 'light'
    mockIcon.id = 'html-light'

    mockPreparedIcon = {
      ...mockPreparedIcon,
      temporaryFilePath: '/tmp/icons/html-light-abc123.svg',
      iconPath: './icons/html-light-abc123.svg',
      fileName: 'html-light-abc123.svg',
      id: 'html-light',
      isLight: true,
    }
    vi.mocked(prepareIconProcessing).mockReturnValue(mockPreparedIcon)

    let result = await processSingleIcon(
      {
        temporaryDirectory: '/tmp/icons',
        icon: mockIcon,
      },
      mockTheme,
      mockConfig,
    )

    expect(getIconSource).toHaveBeenCalledWith(
      'html-light',
      'files',
      mockConfig,
    )

    expect(adaptIconColors).toHaveBeenCalledWith(
      {
        svgContent: '<svg>Mock Icon</svg>',
        id: 'html-light',
      },
      mockTheme,
      mockConfig,
    )

    expect(result).toEqual({
      iconPath: './icons/html-light-abc123.svg',
      id: 'html-light',
    })
  })

  it('should create directory before writing file', async () => {
    vi.mocked(path.dirname).mockReturnValue('/tmp/icons/files')

    await processSingleIcon(
      {
        temporaryDirectory: '/tmp/icons',
        icon: mockIcon,
      },
      mockTheme,
      mockConfig,
    )

    expect(path.dirname).toHaveBeenCalledWith('/tmp/icons/html-abc123.svg')
    expect(fs.mkdir).toHaveBeenCalledWith('/tmp/icons/files', {
      recursive: true,
    })
    expect(fs.writeFile).toHaveBeenCalledWith(
      '/tmp/icons/html-abc123.svg',
      '<svg>Adapted Icon</svg>',
      'utf8',
    )
  })

  it('should handle errors from adaptIconColors correctly', async () => {
    vi.mocked(adaptIconColors).mockImplementation(() => {
      throw new Error('Color adaptation failed')
    })

    await expect(
      processSingleIcon(
        {
          temporaryDirectory: '/tmp/icons',
          icon: mockIcon,
        },
        mockTheme,
        mockConfig,
      ),
    ).rejects.toThrowError('Color adaptation failed')

    expect(fs.writeFile).not.toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledWith(
      'Failed to process icon: Color adaptation failed',
    )
  })

  it('should throw and propagate errors from dependencies', async () => {
    let error = new Error('Failed to get icon source')
    vi.mocked(getIconSource).mockRejectedValue(error)

    await expect(
      processSingleIcon(
        {
          temporaryDirectory: '/tmp/icons',
          icon: mockIcon,
        },
        mockTheme,
        mockConfig,
      ),
    ).rejects.toThrowError(error)

    expect(fs.writeFile).not.toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledWith(
      'Failed to process icon: Failed to get icon source',
    )
  })

  it('should handle non-Error exceptions', async () => {
    let error = 'String error message'
    vi.mocked(fs.mkdir).mockRejectedValue(error)

    await expect(
      processSingleIcon(
        {
          temporaryDirectory: '/tmp/icons',
          icon: mockIcon,
        },
        mockTheme,
        mockConfig,
      ),
    ).rejects.toThrowError(error)

    expect(fs.writeFile).not.toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledWith(
      'Failed to process icon: String error message',
    )
  })
})
