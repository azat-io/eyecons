import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'

import type { ThemeSchema, Theme } from '../../../extension/types/theme'
import type { Config } from '../../../extension/types/config'

import { getHideExplorerArrowValue } from '../../../extension/io/vscode/get-hide-explorer-arrow-value'
import { generateHash } from '../../../extension/core/hash/generate-hash'
import { validate } from '../../../extension/core/validate/validate'
import { logger } from '../../../extension/io/vscode/logger'

interface ValidationResult {
  isValid: boolean
  reason?: string
}

vi.mock('node:fs/promises')

vi.mock('node:path', () => ({
  default: {
    join: vi.fn((...arguments_) => arguments_.join('/')),
  },
}))

vi.mock('../../../extension/io/vscode/get-hide-explorer-arrow-value', () => ({
  getHideExplorerArrowValue: vi.fn(),
}))

vi.mock('../../../extension/core/hash/generate-hash', () => ({
  generateHash: vi.fn(),
}))

vi.mock('../../../data/base-icons', () => ({
  baseIcons: [
    { light: false, id: 'file' },
    { id: 'folder', light: true },
  ],
}))

vi.mock('../../../data/file-icons', () => ({
  fileIcons: [
    { light: false, id: 'js' },
    { light: true, id: 'ts' },
  ],
}))

vi.mock('../../../extension/io/vscode/logger', () => ({
  logger: {
    withContext: vi.fn(),
  },
}))

describe('validate', () => {
  let mockTheme: Theme
  let mockConfig: Config
  let mockSchema: ThemeSchema
  let mockLoggerContext = {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // eslint-disable-next-line no-undefined
    vi.mocked(fs.access).mockResolvedValue(undefined)
    vi.mocked(logger.withContext).mockReturnValue(mockLoggerContext)
    vi.mocked(getHideExplorerArrowValue).mockReturnValue(true)
    vi.mocked(generateHash).mockImplementation(id => `hash-for-${id}`)

    mockTheme = {
      colors: ['#000000', '#ffffff'],
      folderColor: 'blue',
      overrides: {},
      id: 'dark',
    } as Theme

    mockConfig = {
      iconDefinitionsPath: '/mock/path/icons/definitions.json',
      outputIconsPath: '/mock/path/icons/theme',
      version: '1.0.0',
    } as Config

    mockSchema = {
      iconDefinitions: {
        'folder-light': {
          iconPath: './icons/folder-light--hash-for-folder-light.svg',
        },
        'file-light': {
          iconPath: './icons/file-light--hash-for-file-light.svg',
        },
        'ts-light': { iconPath: './icons/ts-light--hash-for-ts-light.svg' },
        folder: { iconPath: './icons/folder--hash-for-folder.svg' },
        file: { iconPath: './icons/file--hash-for-file.svg' },
        js: { iconPath: './icons/js--hash-for-js.svg' },
        ts: { iconPath: './icons/ts--hash-for-ts.svg' },
      },
      light: {
        file: 'file-light',
        fileExtensions: {},
        fileNames: {},
      },
      buildTime: '2023-01-01T00:00:00.000Z',
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
    }

    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockSchema))
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should validate successfully when all conditions are met', async () => {
    let result: ValidationResult = await validate(mockTheme, mockConfig)

    expect(result).toEqual({ isValid: true })
    expect(mockLoggerContext.info).toHaveBeenCalledWith('Validating icon theme')
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Icon theme is valid and up-to-date',
    )
  })

  it('should fail validation when icon definitions file does not exist', async () => {
    vi.mocked(fs.access).mockRejectedValueOnce(new Error('File not found'))

    let result: ValidationResult = await validate(mockTheme, mockConfig)

    expect(result).toEqual({
      reason: 'Icon definitions file does not exist',
      isValid: false,
    })
  })

  it('should fail validation when build time is not found in schema', async () => {
    let schemaWithoutBuildTime = { ...mockSchema, buildTime: null }
    vi.mocked(fs.readFile).mockResolvedValueOnce(
      JSON.stringify(schemaWithoutBuildTime),
    )

    let result: ValidationResult = await validate(mockTheme, mockConfig)

    expect(result).toEqual({
      reason: 'Build time not found in schema',
      isValid: false,
    })
  })

  it('should fail validation when versions do not match', async () => {
    let schemaWithDifferentVersion = { ...mockSchema, version: '2.0.0' }
    vi.mocked(fs.readFile).mockResolvedValueOnce(
      JSON.stringify(schemaWithDifferentVersion),
    )

    let result: ValidationResult = await validate(mockTheme, mockConfig)

    expect(result).toEqual({
      reason: 'Version mismatch: 2.0.0 vs 1.0.0',
      isValid: false,
    })
  })

  it('should fail validation when folder colors do not match', async () => {
    let schemaWithDifferentFolderColor = { ...mockSchema, folderColor: 'red' }
    vi.mocked(fs.readFile).mockResolvedValueOnce(
      JSON.stringify(schemaWithDifferentFolderColor),
    )

    let result: ValidationResult = await validate(mockTheme, mockConfig)

    expect(result).toEqual({
      reason: 'Folder color mismatch: red vs blue',
      isValid: false,
    })
  })

  it('should fail validation when explorer arrows settings do not match', async () => {
    let schemaWithDifferentArrowsSetting = {
      ...mockSchema,
      hidesExplorerArrows: false,
    }
    vi.mocked(fs.readFile).mockResolvedValueOnce(
      JSON.stringify(schemaWithDifferentArrowsSetting),
    )

    let result: ValidationResult = await validate(mockTheme, mockConfig)

    expect(result).toEqual({
      reason: 'Explorer arrows setting mismatch: false vs true',
      isValid: false,
    })
  })

  it('should fail validation when output icons directory does not exist', async () => {
    vi.mocked(fs.access)
      .mockResolvedValueOnce()
      .mockRejectedValueOnce(new Error('Directory not found'))

    let result: ValidationResult = await validate(mockTheme, mockConfig)

    expect(result).toEqual({
      reason: 'Output icons directory does not exist',
      isValid: false,
    })
  })

  it('should fail validation when icon definition is not found', async () => {
    let schemaWithMissingIconDefinition = {
      ...mockSchema,
      iconDefinitions: {
        ...mockSchema.iconDefinitions,
      },
    }
    delete schemaWithMissingIconDefinition.iconDefinitions['file']

    vi.mocked(fs.readFile).mockResolvedValueOnce(
      JSON.stringify(schemaWithMissingIconDefinition),
    )

    let result = await validate(mockTheme, mockConfig)

    expect(result).toEqual({
      reason: 'Icon definition for file not found',
      isValid: false,
    })
  })

  it('should fail validation when icon path does not match expected filename', async () => {
    let schemaWithWrongIconPath = {
      ...mockSchema,
      iconDefinitions: {
        ...mockSchema.iconDefinitions,
        file: { iconPath: './icons/file--wrong-hash.svg' },
      },
    }

    vi.mocked(fs.readFile).mockResolvedValueOnce(
      JSON.stringify(schemaWithWrongIconPath),
    )

    let result = await validate(mockTheme, mockConfig)

    expect(result).toEqual({
      reason:
        'Icon path for file does not match expected filename: file--hash-for-file.svg',
      isValid: false,
    })
  })

  it('should fail validation when icon file does not exist', async () => {
    vi.mocked(fs.access)
      .mockResolvedValueOnce()
      .mockResolvedValueOnce()
      .mockResolvedValueOnce()
      .mockRejectedValueOnce(new Error('File not found'))

    let result = await validate(mockTheme, mockConfig)

    expect(result).toEqual({
      reason: expect.stringContaining('Icon file not found:') as string,
      isValid: false,
    })
  })

  it('should handle errors during validation', async () => {
    vi.mocked(fs.readFile).mockRejectedValueOnce(new Error('Read error'))

    let result = await validate(mockTheme, mockConfig)

    expect(result).toEqual({
      reason: 'Validation error: Read error',
      isValid: false,
    })
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Validation failed: Read error',
    )
  })

  it('should handle non-Error objects during validation', async () => {
    vi.mocked(fs.readFile).mockRejectedValueOnce('String error')

    let result = await validate(mockTheme, mockConfig)

    expect(result).toEqual({
      reason: 'Validation error: String error',
      isValid: false,
    })
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Validation failed: String error',
    )
  })
})
