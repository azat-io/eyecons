import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { FormattedIconValue } from '../../../extension/types/icon'
import type { ThemeData, Theme } from '../../../extension/types/theme'
import type { Config } from '../../../extension/types/config'

import { createThemeAssociations } from '../../../extension/core/build/create-theme-associations'
import { createTemporaryDirectory } from '../../../extension/io/file/create-temporary-directory'
import { processSingleIcon } from '../../../extension/core/build/process-single-icon'
import { formatIconsValues } from '../../../extension/core/icon/format-icons-values'
import { processIcons } from '../../../extension/core/build/process-icons'
import { logger } from '../../../extension/io/vscode/logger'
import { baseIcons } from '../../../data/base-icons'
import { fileIcons } from '../../../data/file-icons'

vi.mock('../../../extension/io/file/create-temporary-directory', () => ({
  createTemporaryDirectory: vi.fn(),
}))

vi.mock('../../../extension/core/build/process-single-icon', () => ({
  processSingleIcon: vi.fn(),
}))

vi.mock('../../../extension/core/icon/format-icons-values', () => ({
  formatIconsValues: vi.fn(),
}))

vi.mock('../../../extension/core/build/create-theme-associations', () => ({
  createThemeAssociations: vi.fn(),
}))

vi.mock('../../../data/base-icons', () => ({
  baseIcons: [
    { name: 'File', id: 'file' },
    { name: 'Folder', id: 'folder' },
  ],
}))

vi.mock('../../../data/file-icons', () => ({
  fileIcons: [
    { extensions: ['html', 'htm'], name: 'HTML', id: 'html' },
    { files: ['script.js'], name: 'JavaScript', extensions: ['js'], id: 'js' },
  ],
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

describe('processIcons', () => {
  let mockTheme: Theme
  let mockConfig: Config
  let mockBaseIconValues: FormattedIconValue[]
  let mockFileIconValues: FormattedIconValue[]
  let mockThemeData: ThemeData

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(logger.withContext).mockReturnValue(mockLoggerContext)

    vi.mocked(createTemporaryDirectory).mockResolvedValue(
      '/mock/temp/directory',
    )

    mockBaseIconValues = [
      {
        theme: 'dark',
        name: 'File',
        type: 'base',
        id: 'file',
      },
      {
        name: 'Folder',
        theme: 'dark',
        id: 'folder',
        type: 'base',
      },
    ]

    mockFileIconValues = [
      {
        extensions: ['html', 'htm'],
        theme: 'dark',
        type: 'files',
        name: 'HTML',
        id: 'html',
      },
      {
        files: ['script.js'],
        name: 'JavaScript',
        extensions: ['js'],
        theme: 'dark',
        type: 'files',
        id: 'js',
      },
    ]

    vi.mocked(formatIconsValues)
      .mockReturnValueOnce(mockBaseIconValues)
      .mockReturnValueOnce(mockFileIconValues)

    vi.mocked(processSingleIcon).mockImplementation(({ icon }) =>
      Promise.resolve({
        iconPath: `./icons/${icon.id}.svg`,
        id: icon.id,
      }),
    )

    mockThemeData = {
      dark: {
        fileExtensions: {
          html: 'html',
          htm: 'html',
          js: 'js',
        },
        fileNames: {
          'script.js': 'js',
        },
      },
      light: {
        fileExtensions: {},
        fileNames: {},
      },
    }

    vi.mocked(createThemeAssociations).mockReturnValue(mockThemeData)

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
  })

  it('should process icons successfully', async () => {
    let result = await processIcons(mockTheme, mockConfig)

    expect(createTemporaryDirectory).toHaveBeenCalledWith()

    expect(formatIconsValues).toHaveBeenCalledWith(baseIcons, 'base')
    expect(formatIconsValues).toHaveBeenCalledWith(fileIcons, 'files')

    expect(processSingleIcon).toHaveBeenCalledTimes(
      mockBaseIconValues.length + mockFileIconValues.length,
    )

    expect(processSingleIcon).toHaveBeenCalledWith(
      {
        temporaryDirectory: '/mock/temp/directory',
        icon: mockBaseIconValues[0],
      },
      mockTheme,
      mockConfig,
    )

    expect(createThemeAssociations).toHaveBeenCalledWith([
      ...mockBaseIconValues,
      ...mockFileIconValues,
    ])

    expect(result).toEqual({
      iconDefinitions: {
        folder: { iconPath: './icons/folder.svg' },
        file: { iconPath: './icons/file.svg' },
        html: { iconPath: './icons/html.svg' },
        js: { iconPath: './icons/js.svg' },
      },
      temporaryDirectory: '/mock/temp/directory',
      themeData: mockThemeData,
    })

    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Processing icons in temporary directory',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Using temporary directory: /mock/temp/directory',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith('Found 2 base icons')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith('Found 2 file icons')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Total icons to process: 4',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith('Processed icon: file')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Created icon definitions',
    )
  })

  it('should handle errors during processing', async () => {
    let error = new Error('Failed to process icon')
    vi.mocked(processSingleIcon).mockRejectedValueOnce(error)

    await expect(processIcons(mockTheme, mockConfig)).rejects.toThrowError(
      error,
    )

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to process icons: Failed to process icon',
    )
  })

  it('should handle errors during temporary directory creation', async () => {
    let error = new Error('Failed to create temporary directory')
    vi.mocked(createTemporaryDirectory).mockRejectedValueOnce(error)

    await expect(processIcons(mockTheme, mockConfig)).rejects.toThrowError(
      error,
    )

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to process icons: Failed to create temporary directory',
    )
  })

  it('should handle non-Error exceptions', async () => {
    let error = 'String error message'
    vi.mocked(createTemporaryDirectory).mockRejectedValueOnce(error)

    await expect(processIcons(mockTheme, mockConfig)).rejects.toThrowError(
      error,
    )

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to process icons: String error message',
    )
  })
})
