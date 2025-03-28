import type { WorkspaceConfiguration } from 'vscode'

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { workspace } from 'vscode'

import type {
  IconDefinitions,
  ThemeData,
  Theme,
} from '../../../extension/types/theme'
import type { Config } from '../../../extension/types/config'

import { createThemeSchema } from '../../../extension/core/build/create-theme-schema'

describe('createThemeSchema', () => {
  let mockIconDefinitions: IconDefinitions
  let mockThemeData: ThemeData
  let mockTheme: Theme
  let mockConfig: Config
  let mockGet = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-01-01T12:00:00Z'))

    mockGet.mockReturnValue(true)
    vi.mocked(workspace.getConfiguration).mockReturnValue({
      get: mockGet,
    } as unknown as WorkspaceConfiguration)

    mockTheme = {
      colors: ['#000000', '#ffffff'],
      folderColor: 'blue',
      overrides: {},
      id: 'dark',
    } as Theme

    mockConfig = {
      version: '1.0.0',
    } as Config

    mockIconDefinitions = {
      'folder-open': { iconPath: './icons/folder-open.svg' },
      'file-light': { iconPath: './icons/file-light.svg' },
      folder: { iconPath: './icons/folder.svg' },
      file: { iconPath: './icons/file.svg' },
      html: { iconPath: './icons/html.svg' },
      css: { iconPath: './icons/css.svg' },
      js: { iconPath: './icons/js.svg' },
      ts: { iconPath: './icons/ts.svg' },
    }

    mockThemeData = {
      light: {
        fileNames: {
          'package.json': 'package-json',
          'tsconfig.json': 'tsconfig',
        },
        fileExtensions: {
          html: 'html',
          css: 'css',
        },
      },
      dark: {
        fileNames: {
          '.gitignore': 'git-ignore',
          'README.md': 'readme',
        },
        fileExtensions: {
          js: 'js',
          ts: 'ts',
        },
      },
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create a correct theme schema with the provided data and default hidesExplorerArrows value', () => {
    let result = createThemeSchema(mockIconDefinitions, mockThemeData, {
      config: mockConfig,
      theme: mockTheme,
    })

    expect(result).toEqual({
      light: {
        fileNames: {
          'package.json': 'package-json',
          'tsconfig.json': 'tsconfig',
        },
        fileExtensions: {
          html: 'html',
          css: 'css',
        },
        file: 'file-light',
      },
      fileNames: {
        '.gitignore': 'git-ignore',
        'README.md': 'readme',
      },
      fileExtensions: {
        js: 'js',
        ts: 'ts',
      },
      buildTime: '2023-01-01T12:00:00.000Z',
      iconDefinitions: mockIconDefinitions,
      folderExpanded: 'folder-open',
      hidesExplorerArrows: true,
      folderNamesExpanded: {},
      folderColor: 'blue',
      folder: 'folder',
      version: '1.0.0',
      folderNames: {},
      themeId: 'dark',
      file: 'file',
    })
  })

  it('should handle empty file associations', () => {
    let emptyThemeData: ThemeData = {
      light: {},
      dark: {},
    }

    let result = createThemeSchema(mockIconDefinitions, emptyThemeData, {
      config: mockConfig,
      theme: mockTheme,
    })

    expect(result.fileExtensions).toEqual({})
    expect(result.fileNames).toEqual({})
    expect(result.light.fileExtensions).toEqual({})
    expect(result.light.fileNames).toEqual({})
  })

  it('should handle undefined file associations', () => {
    let undefinedThemeData: ThemeData = {
      light: {},
      dark: {},
    }

    let result = createThemeSchema(mockIconDefinitions, undefinedThemeData, {
      config: mockConfig,
      theme: mockTheme,
    })

    expect(result.fileExtensions).toEqual({})
    expect(result.fileNames).toEqual({})
    expect(result.light.fileExtensions).toEqual({})
    expect(result.light.fileNames).toEqual({})
  })

  it('should use the value from configuration when hidesExplorerArrows is set to true', () => {
    mockGet.mockReturnValue(true)

    let result = createThemeSchema(mockIconDefinitions, mockThemeData, {
      config: mockConfig,
      theme: mockTheme,
    })

    expect(result.hidesExplorerArrows).toBeTruthy()
    expect(mockGet).toHaveBeenCalledWith('hidesExplorerArrows')
  })

  it('should use the value from configuration when hidesExplorerArrows is set to false', () => {
    mockGet.mockReturnValue(false)

    let result = createThemeSchema(mockIconDefinitions, mockThemeData, {
      config: mockConfig,
      theme: mockTheme,
    })

    expect(result.hidesExplorerArrows).toBeFalsy()
    expect(mockGet).toHaveBeenCalledWith('hidesExplorerArrows')
  })
})
