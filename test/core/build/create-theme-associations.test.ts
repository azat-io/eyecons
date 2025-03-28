import { describe, expect, it } from 'vitest'

import type { FormattedIconValue } from '../../../extension/types/icon'

import { createThemeAssociations } from '../../../extension/core/build/create-theme-associations'

describe('buildFileAssociationMap', () => {
  it('should create file associations for different themes', () => {
    let icons: FormattedIconValue[] = [
      {
        theme: 'dark',
        name: 'File',
        type: 'base',
        id: 'file',
      },
      {
        extensions: ['html', 'htm'],
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
      },
      light: {
        fileExtensions: {
          css: 'css-light',
        },
        fileNames: {},
      },
    })
  })

  it('should handle empty input array', () => {
    let result = createThemeAssociations([])

    expect(result).toEqual({
      light: {
        fileExtensions: {},
        fileNames: {},
      },
      dark: {
        fileExtensions: {},
        fileNames: {},
      },
    })
  })

  it('should only process file icons', () => {
    let icons: FormattedIconValue[] = [
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

    let result = createThemeAssociations(icons)

    expect(result).toEqual({
      light: {
        fileExtensions: {},
        fileNames: {},
      },
      dark: {
        fileExtensions: {},
        fileNames: {},
      },
    })
  })

  it('should handle icons with undefined extensions or files', () => {
    let icons: FormattedIconValue[] = [
      {
        name: 'JavaScript',
        theme: 'dark',
        type: 'files',
        id: 'js',
      },
    ]

    let result = createThemeAssociations(icons)

    expect(result).toEqual({
      light: {
        fileExtensions: {},
        fileNames: {},
      },
      dark: {
        fileExtensions: {},
        fileNames: {},
      },
    })
  })
})
