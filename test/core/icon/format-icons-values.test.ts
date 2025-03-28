import { describe, expect, it } from 'vitest'

import { formatIconsValues } from '../../../extension/core/icon/format-icons-values'

describe('formatIconsValues', () => {
  it('should format base icons without light variants', () => {
    let icons = [
      {
        name: 'Folder',
        id: 'folder',
      },
      {
        name: 'File',
        id: 'file',
      },
    ]

    let result = formatIconsValues(icons, 'base')

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      name: 'Folder',
      theme: 'dark',
      type: 'base',
      id: 'folder',
    })
    expect(result[1]).toEqual({
      theme: 'dark',
      type: 'base',
      name: 'File',
      id: 'file',
    })
  })

  it('should format base icons with light variants', () => {
    let icons = [
      {
        name: 'Folder',
        id: 'folder',
        light: false,
      },
      {
        name: 'File',
        light: true,
        id: 'file',
      },
    ]

    let result = formatIconsValues(icons, 'base')

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({
      name: 'Folder',
      theme: 'dark',
      type: 'base',
      id: 'folder',
    })
    expect(result[1]).toEqual({
      theme: 'dark',
      type: 'base',
      name: 'File',
      id: 'file',
    })
    expect(result[2]).toEqual({
      id: 'file-light',
      theme: 'light',
      type: 'base',
      name: 'File',
    })
  })

  it('should format file icons with extensions and files properties', () => {
    let icons = [
      {
        extensions: ['js', 'mjs', 'cjs'],
        name: 'JavaScript',
        id: 'javascript',
      },
      {
        extensions: ['ts', 'tsx'],
        name: 'TypeScript',
        id: 'typescript',
        light: true,
      },
      {
        files: ['package.json', 'package-lock.json'],
        name: 'Package JSON',
        id: 'package-json',
      },
    ]

    let result = formatIconsValues(icons, 'files')

    expect(result).toHaveLength(4)

    expect(result[0]).toEqual({
      extensions: ['js', 'mjs', 'cjs'],
      name: 'JavaScript',
      id: 'javascript',
      theme: 'dark',
      type: 'files',
    })

    expect(result[1]).toEqual({
      extensions: ['ts', 'tsx'],
      name: 'TypeScript',
      id: 'typescript',
      theme: 'dark',
      type: 'files',
    })

    expect(result[2]).toEqual({
      extensions: ['ts', 'tsx'],
      id: 'typescript-light',
      name: 'TypeScript',
      theme: 'light',
      type: 'files',
    })

    expect(result[3]).toEqual({
      files: ['package.json', 'package-lock.json'],
      name: 'Package JSON',
      id: 'package-json',
      theme: 'dark',
      type: 'files',
    })
  })

  it('should maintain other properties when formatting', () => {
    let icons = [
      {
        customProp1: 'value1',
        customProp2: 42,
        name: 'Custom',
        id: 'custom',
      },
    ]

    let result = formatIconsValues(icons, 'files')

    expect(result[0]).toEqual({
      customProp1: 'value1',
      customProp2: 42,
      name: 'Custom',
      theme: 'dark',
      type: 'files',
      id: 'custom',
    })
  })

  it('should handle empty array', () => {
    let result = formatIconsValues([], 'base')
    expect(result).toEqual([])
  })
})
