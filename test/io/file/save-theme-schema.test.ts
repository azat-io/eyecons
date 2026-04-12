import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import type { ThemeSchema } from '../../../extension/types/theme'
import type { Config } from '../../../extension/types/config'

import { saveThemeSchema } from '../../../extension/io/file/save-theme-schema'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('node:fs/promises', () => ({
  default: {
    writeFile: vi.fn().mockResolvedValue(null),
    mkdir: vi.fn().mockResolvedValue(null),
  },
}))

vi.mock('path', () => ({
  default: {
    dirname: vi.fn((pathName: string) =>
      pathName.split('/').slice(0, -1).join('/'),
    ),
  },
}))

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

describe('saveThemeSchema', () => {
  let mockSchema = {
    iconDefinitions: {
      folder: { iconPath: './icons/folder.svg' },
      file: { iconPath: './icons/file.svg' },
    },
    light: {
      file: 'file-light',
      fileExtensions: {},
      fileNames: {},
    },
    buildTime: '2023-01-01T12:00:00.000Z',
    folderExpanded: 'folder-open',
    hidesExplorerArrows: true,
    folderNamesExpanded: {},
    folderColor: 'blue',
    fileExtensions: {},
    folder: 'folder',
    version: '1.0.0',
    folderNames: {},
    themeId: 'dark',
    fileNames: {},
    file: 'file',
  } as ThemeSchema

  let mockConfig = {
    processing: {
      extremeLightnessThresholds: {
        light: 0.95,
        dark: 0.05,
      },
      lowSaturationThreshold: 0.05,
      saturationFactor: 1.2,
      adjustContrast: true,
    },
    errorHandling: {
      showNotifications: true,
      continueOnError: true,
    },
    logging: {
      level: 'info' as const,
      toFile: false,
    },
    iconDefinitionsPath: 'theme/index.json',
    sourceIconsPath: 'icons/source',
    outputIconsPath: 'icons/theme',
    version: '1.0.0',
  } as Config

  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(logger, 'withContext').mockReturnValue(mockLoggerContext)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should create directory if it does not exist', async () => {
    await saveThemeSchema(mockSchema, mockConfig)

    expect(path.dirname).toHaveBeenCalledWith(mockConfig.iconDefinitionsPath)
    expect(fs.mkdir).toHaveBeenCalledWith('theme', { recursive: true })
  })

  it('should write schema as JSON to the specified path', async () => {
    await saveThemeSchema(mockSchema, mockConfig)

    expect(fs.writeFile).toHaveBeenCalledWith(
      mockConfig.iconDefinitionsPath,
      JSON.stringify(mockSchema, null, 2),
      'utf8',
    )
  })

  it('should log debug messages', async () => {
    await saveThemeSchema(mockSchema, mockConfig)

    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      `Writing theme definition to ${mockConfig.iconDefinitionsPath}`,
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      `Theme definition saved to ${mockConfig.iconDefinitionsPath}`,
    )
  })

  it('should log and rethrow errors', async () => {
    let error = new Error('Test error')
    vi.mocked(fs.mkdir).mockRejectedValueOnce(error)

    await expect(saveThemeSchema(mockSchema, mockConfig)).rejects.toThrow(error)
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to save theme definition: Test error',
    )
  })

  it('should handle non-Error objects in error handling', async () => {
    let errorObject = 'String error'
    vi.mocked(fs.mkdir).mockRejectedValueOnce(errorObject)

    await expect(saveThemeSchema(mockSchema, mockConfig)).rejects.toBe(
      errorObject,
    )
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to save theme definition: String error',
    )
  })

  it('should log and rethrow errors from writeFile', async () => {
    let error = new Error('Test error')
    vi.mocked(fs.writeFile).mockRejectedValueOnce(error)

    await expect(saveThemeSchema(mockSchema, mockConfig)).rejects.toThrow(error)
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to save theme definition: Test error',
    )
  })
})
