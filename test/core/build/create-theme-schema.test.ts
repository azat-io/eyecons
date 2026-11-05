import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import type { IconDefinitions, ThemeData } from '../../../extension/types/theme'

import { createThemeAssociations } from '../../../extension/core/build/create-theme-associations'
import { createThemeSchema } from '../../../extension/core/build/create-theme-schema'
import { formatIconsValues } from '../../../extension/core/icon/format-icons-values'
import { createMockConfig } from '../../helpers/create-mock-config'
import { createMockTheme } from '../../helpers/create-mock-theme'
import { mockSettings } from '../../helpers/mock-settings'
import { fileIcons } from '../../../data/file-icons'

describe('createThemeSchema', () => {
  let buildTime = '2023-01-01T12:00:00.000Z'
  let config = createMockConfig({ version: '2.3.4' })
  let theme = createMockTheme({ folderColor: 'purple', id: 'nord' })

  let iconDefinitions: IconDefinitions = {
    'folder-open': { iconPath: './icons/base/folder-open.svg' },
    'file-light': { iconPath: './icons/base/file-light.svg' },
    folder: { iconPath: './icons/base/folder.svg' },
    file: { iconPath: './icons/base/file.svg' },
    js: { iconPath: './icons/files/js.svg' },
  }

  let themeData: ThemeData = {
    light: {
      fileNames: { 'package.json': 'package-json-light' },
      fileExtensions: { css: 'css-light' },
      languageIds: { css: 'css-light' },
    },
    dark: {
      fileNames: { 'package.json': 'package-json' },
      languageIds: { javascript: 'js' },
      fileExtensions: { js: 'js' },
    },
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(buildTime))
    mockSettings({})
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should build the schema from the icons, associations, theme and config', () => {
    let result = createThemeSchema(iconDefinitions, themeData, {
      config,
      theme,
    })

    expect(result).toEqual({
      light: {
        fileNames: { 'package.json': 'package-json-light' },
        fileExtensions: { css: 'css-light' },
        languageIds: { css: 'css-light' },
        file: 'file-light',
      },
      fileNames: { 'package.json': 'package-json' },
      languageIds: { javascript: 'js' },
      folderExpanded: 'folder-open',
      fileExtensions: { js: 'js' },
      hidesExplorerArrows: true,
      folderNamesExpanded: {},
      folderColor: 'purple',
      version: '2.3.4',
      folder: 'folder',
      folderNames: {},
      themeId: 'nord',
      iconDefinitions,
      file: 'file',
      buildTime,
    })
  })

  it('should keep empty file associations empty', () => {
    let emptyThemeData: ThemeData = {
      light: { fileExtensions: {}, languageIds: {}, fileNames: {} },
      dark: { fileExtensions: {}, languageIds: {}, fileNames: {} },
    }

    let result = createThemeSchema(iconDefinitions, emptyThemeData, {
      config,
      theme,
    })

    expect(result).toEqual(
      expect.objectContaining({
        light: {
          fileExtensions: {},
          file: 'file-light',
          languageIds: {},
          fileNames: {},
        },
        fileExtensions: {},
        languageIds: {},
        fileNames: {},
      }),
    )
  })

  it('should use empty file associations when the theme data has none', () => {
    let result = createThemeSchema(
      iconDefinitions,
      { light: {}, dark: {} },
      { config, theme },
    )

    expect(result).toEqual(
      expect.objectContaining({
        light: {
          fileExtensions: {},
          file: 'file-light',
          languageIds: {},
          fileNames: {},
        },
        fileExtensions: {},
        languageIds: {},
        fileNames: {},
      }),
    )
  })

  it('includes catalog language fallbacks alongside specific file associations', () => {
    let icons = formatIconsValues(fileIcons, 'files')
    let associations = createThemeAssociations(icons)

    let result = createThemeSchema(iconDefinitions, associations, {
      config,
      theme,
    })

    expect(result.languageIds).toMatchObject({
      javascriptreact: 'react',
      typescriptreact: 'react',
      typescript: 'typescript',
      shellscript: 'console',
      python: 'python',
      dotenv: 'env',
      jsonc: 'json',
      csharp: 'cs',
      fsharp: 'fs',
      json: 'json',
    })
    expect(result.light.languageIds).toMatchObject({ python: 'python-light' })
    expect(result.light.languageIds).not.toHaveProperty('typescript')
    expect(result.fileNames).toHaveProperty(['package.json'], 'nodejs')
    expect(result.fileExtensions).toMatchObject({
      'test.ts': 'typescript-test',
      tsx: 'react',
    })
  })

  it('should follow the user setting for hiding explorer arrows', () => {
    mockSettings({ eyecons: { hidesExplorerArrows: false } })

    let result = createThemeSchema(iconDefinitions, themeData, {
      config,
      theme,
    })

    expect(result.hidesExplorerArrows).toBe(false)
  })
})
