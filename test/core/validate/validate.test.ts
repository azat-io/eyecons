import { beforeEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import type {
  IconDefinitions,
  ThemeSchema,
  Theme,
} from '../../../extension/types/theme'

import { prepareIconProcessing } from '../../../extension/core/icon/prepare-icon-processing'
import { formatIconsValues } from '../../../extension/core/icon/format-icons-values'
import { createMockThemeSchema } from '../../helpers/create-mock-theme-schema'
import { validate } from '../../../extension/core/validate/validate'
import { createMockConfig } from '../../helpers/create-mock-config'
import { createMockTheme } from '../../helpers/create-mock-theme'
import { mockSettings } from '../../helpers/mock-settings'
import { baseIcons } from '../../../data/base-icons'
import { fileIcons } from '../../../data/file-icons'

vi.mock('node:fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    access: vi.fn(),
  },
}))

vi.mock('../../../data/base-icons', () => ({
  baseIcons: [
    { name: 'File', light: true, id: 'file' },
    { name: 'Folder', id: 'folder' },
  ],
}))

vi.mock('../../../data/file-icons', () => ({
  fileIcons: [
    { extensions: ['js'], name: 'JavaScript', light: true, id: 'js' },
    { extensions: ['html'], name: 'HTML', id: 'html' },
  ],
}))

/**
 * Files in the fake file system, by path.
 */
let files = new Map<string, string>()

/**
 * Directories in the fake file system.
 */
let directories = new Set<string>()

/**
 * Checks that a file or a directory exists in the fake file system.
 *
 * @param target - Path to check.
 * @returns Promise that is rejected when nothing exists at the path.
 */
function access(target: unknown): Promise<void> {
  let exists = files.has(String(target)) || directories.has(String(target))
  return exists ?
      Promise.resolve()
    : Promise.reject(new Error(`ENOENT: no such file, '${String(target)}'`))
}

/**
 * Reads a file from the fake file system.
 *
 * @param file - Path of the file.
 * @returns Promise with the text of the file, rejected when it is missing.
 */
function readFile(file: unknown): Promise<string> {
  let content = files.get(String(file))
  return content === undefined ?
      Promise.reject(new Error(`ENOENT: no such file, '${String(file)}'`))
    : Promise.resolve(content)
}

describe('validate', () => {
  let config = createMockConfig()
  let theme = createMockTheme()

  /**
   * Options for writing a built theme.
   */
  interface BuiltThemeOptions {
    /**
     * Fields of the theme definition to replace.
     */
    schema?: Partial<ThemeSchema>

    /**
     * Icon the build left out, as if it had failed to process it.
     */
    withoutIcon?: string
  }

  /**
   * Writes the theme definition and the icon files the way a build for the
   * given theme leaves them in the output directory.
   *
   * @param builtFor - Theme the icons were built for.
   * @param options - Deviations from a complete build.
   * @returns Paths of the icon files, by icon id.
   */
  function writeBuiltTheme(
    builtFor: Theme,
    options: BuiltThemeOptions = {},
  ): Record<string, string> {
    let icons = [
      ...formatIconsValues(baseIcons, 'base'),
      ...formatIconsValues(fileIcons, 'files'),
    ].filter(icon => icon.id !== options.withoutIcon)
    let iconDefinitions: IconDefinitions = {}
    let iconFiles: Record<string, string> = {}
    for (let icon of icons) {
      let { iconPath, fileName, type, id } = prepareIconProcessing(
        { temporaryDirectory: '/tmp/eyecons-abc123', icon },
        builtFor,
        config,
      )
      iconDefinitions[id] = { iconPath }
      iconFiles[id] = path.join(config.outputIconsPath, type, fileName)
      files.set(iconFiles[id], '<svg></svg>')
    }
    directories.add(config.outputIconsPath)
    let schema = createMockThemeSchema({
      folderColor: builtFor.folderColor,
      version: config.version,
      themeId: builtFor.id,
      iconDefinitions,
      ...options.schema,
    })
    files.set(config.iconDefinitionsPath, JSON.stringify(schema))
    return iconFiles
  }

  beforeEach(() => {
    vi.resetAllMocks()
    files.clear()
    directories.clear()
    vi.mocked(fs.readFile).mockImplementation(readFile)
    vi.mocked(fs.access).mockImplementation(access)
    mockSettings({})
  })

  it('should accept the icons built for the current theme', async () => {
    writeBuiltTheme(theme)

    await expect(validate(theme, config)).resolves.toEqual({ isValid: true })
  })

  it('should ask for a build when there is no theme definition', async () => {
    await expect(validate(theme, config)).resolves.toEqual({
      reason: 'Icon definitions file does not exist',
      isValid: false,
    })
  })

  it('should ask for a build when the theme definition has no build time', async () => {
    writeBuiltTheme(theme, { schema: { buildTime: '' } })

    await expect(validate(theme, config)).resolves.toEqual({
      reason: 'Build time not found in schema',
      isValid: false,
    })
  })

  it('should ask for a build when the icons were built by another version', async () => {
    writeBuiltTheme(theme, { schema: { version: '0.9.0' } })

    await expect(validate(theme, config)).resolves.toEqual({
      reason: 'Version mismatch: 0.9.0 vs 1.0.0',
      isValid: false,
    })
  })

  it('should ask for a build when the folder color changed', async () => {
    writeBuiltTheme(theme)

    let result = await validate(
      createMockTheme({ folderColor: 'purple' }),
      config,
    )

    expect(result).toEqual({
      reason: 'Folder color mismatch: blue vs purple',
      isValid: false,
    })
  })

  it('should ask for a build when the explorer arrows setting changed', async () => {
    writeBuiltTheme(theme)
    mockSettings({ eyecons: { hidesExplorerArrows: false } })

    await expect(validate(theme, config)).resolves.toEqual({
      reason: 'Explorer arrows setting mismatch: true vs false',
      isValid: false,
    })
  })

  it('should ask for a build when the theme changed', async () => {
    writeBuiltTheme(theme)

    let result = await validate(createMockTheme({ id: 'nord' }), config)

    expect(result).toEqual({
      reason: expect.stringMatching(
        /^Icon path for file does not match expected filename: file--[\da-f]{8}\.svg$/u,
      ) as string,
      isValid: false,
    })
  })

  it('should ask for a build when the output icons directory is missing', async () => {
    writeBuiltTheme(theme)
    directories.clear()

    await expect(validate(theme, config)).resolves.toEqual({
      reason: 'Output icons directory does not exist',
      isValid: false,
    })
  })

  it.each(['html', 'js-light'])(
    'should ask for a build when the %s icon is not defined',
    async iconId => {
      writeBuiltTheme(theme, { withoutIcon: iconId })

      await expect(validate(theme, config)).resolves.toEqual({
        reason: `Icon definition for ${iconId} not found`,
        isValid: false,
      })
    },
  )

  it.each(['file', 'file-light', 'js', 'js-light'])(
    'should ask for a build when the %s icon file is missing',
    async iconId => {
      let iconFiles = writeBuiltTheme(theme)
      files.delete(iconFiles[iconId]!)

      await expect(validate(theme, config)).resolves.toEqual({
        reason: `Icon file not found: ${iconFiles[iconId]}`,
        isValid: false,
      })
    },
  )

  it('should report a theme definition that cannot be read', async () => {
    writeBuiltTheme(theme)
    vi.mocked(fs.readFile).mockRejectedValue(new Error('Permission denied'))

    await expect(validate(theme, config)).resolves.toEqual({
      reason: 'Validation error: Permission denied',
      isValid: false,
    })
  })

  it('should report a non-Error failure', async () => {
    writeBuiltTheme(theme)
    vi.mocked(fs.readFile).mockRejectedValue('Permission denied')

    await expect(validate(theme, config)).resolves.toEqual({
      reason: 'Validation error: Permission denied',
      isValid: false,
    })
  })
})
