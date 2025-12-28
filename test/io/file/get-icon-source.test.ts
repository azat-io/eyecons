import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import type { Config } from '../../../extension/types/config'

import { getIconSource } from '../../../extension/io/file/get-icon-source'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('node:fs/promises', () => ({
  default: {
    readFile: vi.fn(),
  },
}))

vi.mock('node:path', () => ({
  default: {
    join: vi.fn((...arguments_) => arguments_.join('/')),
  },
}))

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

describe('getIconSource', () => {
  let mockConfig: Config

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(logger, 'withContext').mockReturnValue(mockLoggerContext)
    vi.mocked(fs.readFile).mockResolvedValue('<svg>Mock SVG content</svg>')

    mockConfig = {
      processing: {
        extremeLightnessThresholds: { light: 0.95, dark: 0.05 },
        lowSaturationThreshold: 0.05,
        saturationFactor: 1.2,
        adjustContrast: true,
      },
      errorHandling: {
        showNotifications: true,
        continueOnError: true,
      },
      logging: {
        level: 'info',
        toFile: false,
      },
      iconDefinitionsPath: 'icons/definitions.json',
      outputPath: '/mock/extension/path/output',
      extensionPath: '/mock/extension/path',
      sourceIconsPath: 'icons/source',
      outputIconsPath: 'icons/theme',
      version: '1.0.0',
    }
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should read the correct file for icons', async () => {
    let iconId = 'file'
    let iconType = 'files'

    let result = await getIconSource(iconId, iconType, mockConfig)

    expect(path.join).toHaveBeenCalledWith('icons/source', 'files', 'file.svg')
    expect(fs.readFile).toHaveBeenCalledWith(
      'icons/source/files/file.svg',
      'utf8',
    )
    expect(result).toBe('<svg>Mock SVG content</svg>')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Read source for icon: file.svg',
    )
  })

  it('should log and throw error when file reading fails', async () => {
    let iconId = 'nonexistent'
    let iconType = 'files'
    let mockError = new Error('File not found')
    vi.mocked(fs.readFile).mockRejectedValueOnce(mockError)

    await expect(
      getIconSource(iconId, iconType, mockConfig),
    ).rejects.toThrowError(mockError)
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to read source for icon nonexistent: File not found',
    )
  })

  it.each([
    {
      expectedPath: 'icons/source/base/folder.svg',
      iconType: 'base',
      iconId: 'folder',
    },
    {
      expectedPath: 'icons/source/files/javascript.svg',
      iconId: 'javascript',
      iconType: 'files',
    },
    {
      expectedPath: 'icons/source/files/typescript.svg',
      iconId: 'typescript',
      iconType: 'files',
    },
    {
      expectedPath: 'icons/source/base/folder-open.svg',
      iconId: 'folder-open',
      iconType: 'base',
    },
  ])(
    'should handle icon $iconId correctly',
    async ({ expectedPath, iconType, iconId }) => {
      await getIconSource(iconId, iconType, mockConfig)

      expect(path.join).toHaveBeenCalledWith(
        'icons/source',
        iconType,
        `${iconId}.svg`,
      )
      expect(fs.readFile).toHaveBeenCalledWith(expectedPath, 'utf8')
    },
  )

  it('should handle non-Error objects in error handling', async () => {
    let iconId = 'problematic'
    let iconType = 'base'
    let errorObject = 'String error'
    vi.mocked(fs.readFile).mockRejectedValueOnce(errorObject)

    await expect(getIconSource(iconId, iconType, mockConfig)).rejects.toBe(
      errorObject,
    )
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to read source for icon problematic: String error',
    )
  })

  it('should use sourceIconsPath from config', async () => {
    let iconId = 'file'
    let iconType = 'files'
    mockConfig.sourceIconsPath = 'custom/source/path'

    await getIconSource(iconId, iconType, mockConfig)

    expect(path.join).toHaveBeenCalledWith(
      'custom/source/path',
      'files',
      'file.svg',
    )
  })
})
