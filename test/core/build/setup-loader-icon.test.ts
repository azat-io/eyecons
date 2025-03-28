import {
  beforeEach,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import type { ThemeSchema } from '../../../extension/types/theme'
import type { Config } from '../../../extension/types/config'

import { createThemeSchema } from '../../../extension/core/build/create-theme-schema'
import { createLoaderIcon } from '../../../extension/core/build/create-loader-icon'
import { setupLoaderIcon } from '../../../extension/core/build/setup-loader-icon'
import { saveThemeSchema } from '../../../extension/io/file/save-theme-schema'
import { saveLoaderIcon } from '../../../extension/io/file/save-loader-icon'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('../../../extension/core/build/create-loader-icon')
vi.mock('../../../extension/core/build/create-theme-schema')
vi.mock('../../../extension/io/file/save-loader-icon')
vi.mock('../../../extension/io/file/save-theme-schema')

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

describe('setupLoaderIcon', () => {
  let mockTheme = {
    main: {
      orange: '#ff9800',
      yellow: '#ffeb3b',
      purple: '#9c27b0',
      green: '#4caf50',
      blue: '#2196f3',
      red: '#f44336',
    },
    colors: ['#000000', '#ffffff'],
    backgroundSecondary: '#1e1e1e',
    backgroundTertiary: '#252525',
    backgroundPrimary: '#1a1a1a',
    backgroundBrand: '#0078d4',
    contentPrimary: '#ffffff',
    contentBrand: '#ffffff',
    folderColor: 'blue',
    border: '#444444',
    overrides: {},
    id: 'dark',
  }

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

  let mockThemeSchema: ThemeSchema

  beforeAll(() => {
    mockThemeSchema = {
      iconDefinitions: {
        'folder-open': { iconPath: './mock-loader-path.svg' },
        'file-light': { iconPath: './mock-loader-path.svg' },
        folder: { iconPath: './mock-loader-path.svg' },
        file: { iconPath: './mock-loader-path.svg' },
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
  })

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(createLoaderIcon).mockReturnValue('<svg>Mock Loader</svg>')
    vi.mocked(createThemeSchema).mockReturnValue(mockThemeSchema)
    vi.mocked(saveLoaderIcon).mockResolvedValue('./mock-loader-path.svg')
    vi.mocked(saveThemeSchema).mockResolvedValue()

    vi.spyOn(logger, 'withContext').mockReturnValue(mockLoggerContext)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should create and save loader icon and theme schema', async () => {
    await setupLoaderIcon(mockTheme, mockConfig)

    expect(createLoaderIcon).toHaveBeenCalledWith()
    expect(saveLoaderIcon).toHaveBeenCalledWith(
      '<svg>Mock Loader</svg>',
      mockConfig,
    )
    expect(createThemeSchema).toHaveBeenCalledWith(
      {
        'folder-open': { iconPath: './mock-loader-path.svg' },
        'file-light': { iconPath: './mock-loader-path.svg' },
        folder: { iconPath: './mock-loader-path.svg' },
        file: { iconPath: './mock-loader-path.svg' },
      },
      {
        light: {},
        dark: {},
      },
      expect.objectContaining({
        config: mockConfig,
        theme: mockTheme,
      }),
    )
    expect(saveThemeSchema).toHaveBeenCalledWith(mockThemeSchema, mockConfig)
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Temporary theme schema created',
    )
  })

  it('should log and rethrow errors from saveLoaderIcon', async () => {
    let error = new Error('Test error from saveLoaderIcon')
    vi.mocked(saveLoaderIcon).mockRejectedValueOnce(error)

    await expect(setupLoaderIcon(mockTheme, mockConfig)).rejects.toThrow(error)

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to setup loader icon: Test error from saveLoaderIcon',
    )
    expect(saveThemeSchema).not.toHaveBeenCalled()
  })

  it('should log and rethrow errors from saveThemeSchema', async () => {
    let error = new Error('Test error from saveThemeSchema')
    vi.mocked(saveThemeSchema).mockRejectedValueOnce(error)

    await expect(setupLoaderIcon(mockTheme, mockConfig)).rejects.toThrow(error)

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to setup loader icon: Test error from saveThemeSchema',
    )
  })

  it('should handle non-Error objects in error handling', async () => {
    let errorObject = 'String error'
    vi.mocked(saveLoaderIcon).mockRejectedValueOnce(errorObject)

    await expect(setupLoaderIcon(mockTheme, mockConfig)).rejects.toBe(
      errorObject,
    )

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to setup loader icon: String error',
    )
  })
})
