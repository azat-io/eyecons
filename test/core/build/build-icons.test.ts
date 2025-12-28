import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { setTimeout } from 'node:timers/promises'

import type {
  IconDefinitions,
  ThemeSchema,
  ThemeData,
  Theme,
} from '../../../extension/types/theme'
import type { Config } from '../../../extension/types/config'

import { createThemeSchema } from '../../../extension/core/build/create-theme-schema'
import { moveProcessedIcons } from '../../../extension/io/file/move-processed-icons'
import { setupLoaderIcon } from '../../../extension/core/build/setup-loader-icon'
import { saveThemeSchema } from '../../../extension/io/file/save-theme-schema'
import { processIcons } from '../../../extension/core/build/process-icons'
import { buildIcons } from '../../../extension/core/build/build-icons'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('node:timers/promises', () => ({
  setTimeout: vi.fn().mockResolvedValue(null),
}))

vi.mock('../../../extension/core/build/setup-loader-icon', () => ({
  setupLoaderIcon: vi.fn(),
}))

vi.mock('../../../extension/core/build/process-icons', () => ({
  processIcons: vi.fn(),
}))

vi.mock('../../../extension/core/build/create-theme-schema', () => ({
  createThemeSchema: vi.fn(),
}))

vi.mock('../../../extension/io/file/move-processed-icons', () => ({
  moveProcessedIcons: vi.fn(),
}))

vi.mock('../../../extension/io/file/save-theme-schema', () => ({
  saveThemeSchema: vi.fn(),
}))

vi.mock('../../../extension/io/vscode/logger', () => ({
  logger: {
    withContext: vi.fn(),
  },
}))

describe('buildIcons', () => {
  let mockTheme: Theme
  let mockConfig: Config
  let mockProcessIconsResult: {
    iconDefinitions: IconDefinitions
    temporaryDirectory: string
    themeData: ThemeData
  }
  let mockThemeSchema: ThemeSchema
  let mockLoggerContext = {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockTheme = {
      colors: ['#000000', '#ffffff'],
      folderColor: 'blue',
      overrides: {},
      id: 'dark',
    } as Theme

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

    mockProcessIconsResult = {
      themeData: {
        dark: {
          fileNames: { 'package.json': 'json' },
          fileExtensions: { js: 'js' },
        },
        light: {
          fileExtensions: {},
          fileNames: {},
        },
      },
      iconDefinitions: {
        folder: { iconPath: './icons/folder.svg' },
        file: { iconPath: './icons/file.svg' },
      },
      temporaryDirectory: '/mock/temp/directory',
    }

    mockThemeSchema = {
      light: {
        file: 'file-light',
        fileExtensions: {},
        fileNames: {},
      },
      iconDefinitions: mockProcessIconsResult.iconDefinitions,
      fileNames: { 'package.json': 'json' },
      buildTime: '2023-01-01T00:00:00.000Z',
      folderExpanded: 'folder-open',
      fileExtensions: { js: 'js' },
      hidesExplorerArrows: true,
      folderNamesExpanded: {},
      folderColor: 'blue',
      folder: 'folder',
      version: '1.0.0',
      folderNames: {},
      themeId: 'dark',
      file: 'file',
    }

    vi.mocked(logger.withContext).mockReturnValue(mockLoggerContext)
    vi.mocked(setupLoaderIcon).mockResolvedValue()
    vi.mocked(processIcons).mockResolvedValue(mockProcessIconsResult)
    vi.mocked(moveProcessedIcons).mockResolvedValue()
    vi.mocked(createThemeSchema).mockReturnValue(mockThemeSchema)
    vi.mocked(saveThemeSchema).mockResolvedValue()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should build icons successfully', async () => {
    await buildIcons(mockTheme, mockConfig)

    expect(setupLoaderIcon).toHaveBeenCalledWith(mockTheme, mockConfig)
    expect(processIcons).toHaveBeenCalledWith(mockTheme, mockConfig)
    expect(moveProcessedIcons).toHaveBeenCalledWith(
      mockProcessIconsResult.temporaryDirectory,
      mockConfig,
    )
    expect(createThemeSchema).toHaveBeenCalledWith(
      mockProcessIconsResult.iconDefinitions,
      mockProcessIconsResult.themeData,
      { config: mockConfig, theme: mockTheme },
    )

    expect(setTimeout).toHaveBeenCalledWith(1000)

    expect(saveThemeSchema).toHaveBeenCalledWith(mockThemeSchema, mockConfig)

    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Starting icon theme build process',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Setting up loader icon',
    )
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Processing icons in temporary directory',
    )
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Moving processed icons to output directory',
    )
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Creating and saving theme schema',
    )
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Icon theme build process completed',
    )
  })

  it('should handle errors from setupLoaderIcon', async () => {
    let error = new Error('Setup loader error')
    vi.mocked(setupLoaderIcon).mockRejectedValueOnce(error)

    await expect(buildIcons(mockTheme, mockConfig)).rejects.toThrowError(error)

    expect(processIcons).not.toHaveBeenCalled()
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Build process failed: Setup loader error',
      true,
    )
  })

  it('should handle errors from processIcons', async () => {
    let error = new Error('Process icons error')
    vi.mocked(processIcons).mockRejectedValueOnce(error)

    await expect(buildIcons(mockTheme, mockConfig)).rejects.toThrowError(error)

    expect(moveProcessedIcons).not.toHaveBeenCalled()
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Build process failed: Process icons error',
      true,
    )
  })

  it('should handle errors from moveProcessedIcons', async () => {
    let error = new Error('Move icons error')
    vi.mocked(moveProcessedIcons).mockRejectedValueOnce(error)

    await expect(buildIcons(mockTheme, mockConfig)).rejects.toThrowError(error)

    expect(setTimeout).not.toHaveBeenCalled()
    expect(saveThemeSchema).not.toHaveBeenCalled()
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Build process failed: Move icons error',
      true,
    )
  })

  it('should handle errors from saveThemeSchema', async () => {
    let error = new Error('Save schema error')
    vi.mocked(saveThemeSchema).mockRejectedValueOnce(error)

    await expect(buildIcons(mockTheme, mockConfig)).rejects.toThrowError(error)

    expect(setTimeout).toHaveBeenCalledWith(1000)
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Build process failed: Save schema error',
      true,
    )
  })

  it('should handle errors from saveThemeSchema with string error', async () => {
    let error = 'Save schema error'
    vi.mocked(saveThemeSchema).mockRejectedValueOnce(error)

    await expect(buildIcons(mockTheme, mockConfig)).rejects.toThrowError(error)

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Build process failed: Save schema error',
      true,
    )
  })
})
