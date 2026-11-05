import { describe, expect, it } from 'vitest'

import type { FormattedIconValue } from '../../../extension/types/icon'
import type { ThemeData } from '../../../extension/types/theme'

import { createThemeAssociations } from '../../../extension/core/build/create-theme-associations'

let emptyAssociations: ThemeData = {
  light: {
    fileExtensions: {},
    languageIds: {},
    fileNames: {},
  },
  dark: {
    fileExtensions: {},
    languageIds: {},
    fileNames: {},
  },
}

describe('createThemeAssociations', () => {
  it('associates extensions, file names and language IDs per theme', () => {
    let icons: FormattedIconValue[] = [
      {
        theme: 'dark',
        name: 'File',
        type: 'base',
        id: 'file',
      },
      {
        extensions: ['html', 'htm'],
        language: ['html'],
        theme: 'dark',
        type: 'files',
        name: 'HTML',
        id: 'html',
      },
      {
        files: ['package.json', 'package-lock.json'],
        name: 'Package JSON',
        id: 'package-json',
        theme: 'dark',
        type: 'files',
      },
      {
        extensions: ['css'],
        language: ['css'],
        name: 'CSS Light',
        id: 'css-light',
        theme: 'light',
        type: 'files',
      },
      {
        name: 'Empty',
        theme: 'dark',
        type: 'files',
        id: 'empty',
      },
    ]

    let result = createThemeAssociations(icons)

    expect(result).toEqual({
      dark: {
        fileNames: {
          'package-lock.json': 'package-json',
          'package.json': 'package-json',
        },
        fileExtensions: {
          html: 'html',
          htm: 'html',
        },
        languageIds: { html: 'html' },
      },
      light: {
        fileExtensions: {
          css: 'css-light',
        },
        languageIds: { css: 'css-light' },
        fileNames: {},
      },
    })
  })

  it('should return empty associations for no icons', () => {
    let result = createThemeAssociations([])

    expect(result).toEqual(emptyAssociations)
  })

  it('ignores extensions, file names and language IDs of base icons', () => {
    let icons: FormattedIconValue[] = [
      {
        extensions: ['svg'],
        language: ['svg'],
        files: ['README'],
        theme: 'dark',
        name: 'File',
        type: 'base',
        id: 'file',
      },
      {
        extensions: ['svg'],
        name: 'File Light',
        language: ['svg'],
        id: 'file-light',
        theme: 'light',
        type: 'base',
      },
    ]

    let result = createThemeAssociations(icons)

    expect(result).toEqual(emptyAssociations)
  })

  it('associates every language ID of a file icon without names or extensions', () => {
    let icons: FormattedIconValue[] = [
      {
        language: ['json', 'jsonc', 'json5'],
        theme: 'dark',
        type: 'files',
        name: 'JSON',
        id: 'json',
      },
    ]

    let result = createThemeAssociations(icons)

    expect(result).toEqual({
      dark: {
        languageIds: { jsonc: 'json', json5: 'json', json: 'json' },
        fileExtensions: {},
        fileNames: {},
      },
      light: {
        fileExtensions: {},
        languageIds: {},
        fileNames: {},
      },
    })
  })

  it.each([
    { description: 'missing', language: undefined },
    { description: 'empty', language: [] },
  ])(
    'skips file icons with no names or extensions and $description language IDs',
    ({ language }) => {
      let icons: FormattedIconValue[] = [
        {
          name: 'JavaScript',
          theme: 'dark',
          type: 'files',
          language,
          id: 'js',
        },
      ]

      let result = createThemeAssociations(icons)

      expect(result).toEqual(emptyAssociations)
    },
  )
})
