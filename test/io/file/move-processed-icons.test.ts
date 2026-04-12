import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import type { Config } from '../../../extension/types/config'

import { moveProcessedIcons } from '../../../extension/io/file/move-processed-icons'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('node:fs/promises', () => ({
  default: {
    mkdir: vi.fn(),
    cp: vi.fn(),
    rm: vi.fn(),
  },
}))

vi.mock('node:path', () => ({
  default: {
    dirname: vi.fn((pathName: string) =>
      pathName.split('/').slice(0, -1).join('/'),
    ),
  },
}))

vi.mock('../../../extension/io/vscode/logger', () => ({
  logger: {
    withContext: vi.fn(),
  },
}))

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

describe('moveProcessedIcons', () => {
  let mockConfig: Config

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(logger.withContext).mockReturnValue(mockLoggerContext)

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
      sourceIconsPath: 'icons/source',
      outputIconsPath: 'icons/theme',
      version: '1.0.0',
    } as Config
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should move temporary directory to output directory', async () => {
    let temporaryDirectory = '/tmp/eyecons-12345'

    vi.mocked(fs.mkdir).mockResolvedValue('')
    vi.mocked(fs.rm).mockResolvedValue()
    vi.mocked(fs.cp).mockResolvedValue()

    await moveProcessedIcons(temporaryDirectory, mockConfig)

    expect(path.dirname).toHaveBeenCalledWith('icons/theme')
    expect(fs.mkdir).toHaveBeenCalledWith('icons', { recursive: true })
    expect(fs.rm).toHaveBeenCalledWith('icons/theme', {
      recursive: true,
      force: true,
    })
    expect(fs.cp).toHaveBeenCalledWith(temporaryDirectory, 'icons/theme', {
      recursive: true,
    })
    expect(fs.rm).toHaveBeenCalledWith(temporaryDirectory, {
      recursive: true,
      force: true,
    })

    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      `Moving icons from ${temporaryDirectory} to icons/theme`,
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Removed existing output directory: icons/theme',
    )
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Successfully copied icons to icons/theme',
    )
  })

  it('should handle error when output directory cannot be removed', async () => {
    let temporaryDirectory = '/tmp/eyecons-12345'

    vi.mocked(fs.mkdir).mockResolvedValue('')
    vi.mocked(fs.rm)
      .mockRejectedValueOnce(new Error('Cannot remove directory'))
      .mockResolvedValueOnce()
    vi.mocked(fs.cp).mockResolvedValue()

    await moveProcessedIcons(temporaryDirectory, mockConfig)

    expect(fs.mkdir).toHaveBeenCalledWith('icons', { recursive: true })
    expect(fs.rm).toHaveBeenCalledWith('icons/theme', {
      recursive: true,
      force: true,
    })
    expect(fs.cp).toHaveBeenCalledWith(temporaryDirectory, 'icons/theme', {
      recursive: true,
    })
    expect(fs.rm).toHaveBeenCalledWith(temporaryDirectory, {
      recursive: true,
      force: true,
    })

    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Output directory did not exist or could not be removed: icons/theme',
    )
  })

  it('should handle error when output directory cannot be removed with string error', async () => {
    let temporaryDirectory = '/tmp/eyecons-12345'

    vi.mocked(fs.mkdir).mockResolvedValue('')
    vi.mocked(fs.rm)
      .mockRejectedValueOnce('Cannot remove directory')
      .mockResolvedValueOnce()
    vi.mocked(fs.cp).mockResolvedValue()

    await moveProcessedIcons(temporaryDirectory, mockConfig)

    expect(fs.mkdir).toHaveBeenCalledWith('icons', { recursive: true })
    expect(fs.rm).toHaveBeenCalledWith('icons/theme', {
      recursive: true,
      force: true,
    })
    expect(fs.cp).toHaveBeenCalledWith(temporaryDirectory, 'icons/theme', {
      recursive: true,
    })
    expect(fs.rm).toHaveBeenCalledWith(temporaryDirectory, {
      recursive: true,
      force: true,
    })

    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Output directory did not exist or could not be removed: icons/theme',
    )
  })

  it('should throw and log error when copy fails', async () => {
    let temporaryDirectory = '/tmp/eyecons-12345'
    let error = new Error('Copy failed')

    vi.mocked(fs.mkdir).mockResolvedValue('')
    vi.mocked(fs.rm).mockResolvedValue()
    vi.mocked(fs.cp).mockRejectedValue(error)

    await expect(
      moveProcessedIcons(temporaryDirectory, mockConfig),
    ).rejects.toThrow(error)

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to move icons: Copy failed',
    )
  })

  it('should throw and log error when copy fails with string error', async () => {
    let temporaryDirectory = '/tmp/eyecons-12345'
    let error = 'Copy failed'

    vi.mocked(fs.mkdir).mockResolvedValue('')
    vi.mocked(fs.rm).mockResolvedValue()
    vi.mocked(fs.cp).mockRejectedValue(error)

    await expect(
      moveProcessedIcons(temporaryDirectory, mockConfig),
    ).rejects.toThrow(error)

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to move icons: Copy failed',
    )
  })

  it('should throw and log error when mkdir fails', async () => {
    let temporaryDirectory = '/tmp/eyecons-12345'
    let error = new Error('Mkdir failed')

    vi.mocked(fs.mkdir).mockRejectedValue(error)

    await expect(
      moveProcessedIcons(temporaryDirectory, mockConfig),
    ).rejects.toThrow(error)

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to move icons: Mkdir failed',
    )
    expect(fs.rm).not.toHaveBeenCalled()
    expect(fs.cp).not.toHaveBeenCalled()
  })
})
