import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import path from 'node:path'

import type { Theme } from '../../../extension/types/theme'

import { prepareIconProcessing } from '../../../extension/core/icon/prepare-icon-processing'
import { generateHash } from '../../../extension/core/hash/generate-hash'
import { createMockConfig } from '../../helpers/create-mock-config'

vi.mock('../../../extension/core/hash/generate-hash', () => ({
  generateHash: vi.fn(),
}))

vi.mock('node:path', () => ({
  default: {
    join: vi.fn((...arguments_) => arguments_.join('/')),
  },
}))

describe('prepareIconProcessing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(generateHash).mockReturnValue('abc123')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  /**
   * Builds the theme fixture handed to `prepareIconProcessing`.
   *
   * Only the id and the folder color reach the function under test, the rest of
   * the theme is filled with empty values.
   *
   * @param id - VS Code theme id.
   * @param folderColor - Selected folder color.
   * @returns Theme to pass to the function under test.
   */
  function createTheme(id: string, folderColor: string): Theme {
    return {
      overrides: {},
      folderColor,
      colors: [],
      id,
    } as unknown as Theme
  }

  it('should correctly prepare processing data for a dark icon', () => {
    let icon = {
      theme: 'dark' as const,
      type: 'base' as const,
      name: 'File',
      id: 'file',
    }

    let theme = createTheme('dark-theme', 'blue')

    let config = createMockConfig()

    let result = prepareIconProcessing(
      {
        temporaryDirectory: '/tmp/eyecons',
        icon,
      },
      theme,
      config,
    )

    expect(generateHash).toHaveBeenCalledWith('file', 'dark-theme', 'blue')
    expect(path.join).toHaveBeenCalledWith(
      '/tmp/eyecons',
      'base',
      'file--abc123.svg',
    )

    expect(result).toEqual({
      temporaryFilePath: '/tmp/eyecons/base/file--abc123.svg',
      iconPath: './icons/theme/base/file--abc123.svg',
      fileName: 'file--abc123.svg',
      baseId: 'file',
      isLight: false,
      hash: 'abc123',
      type: 'base',
      id: 'file',
    })
  })

  it('should correctly prepare processing data for a light icon', () => {
    let icon = {
      theme: 'light' as const,
      type: 'base' as const,
      name: 'File Light',
      id: 'file-light',
    }

    let theme = createTheme('light-theme', 'yellow')

    let config = createMockConfig()

    let result = prepareIconProcessing(
      {
        temporaryDirectory: '/tmp/eyecons',
        icon,
      },
      theme,
      config,
    )

    expect(generateHash).toHaveBeenCalledWith(
      'file-light',
      'light-theme',
      'yellow',
    )
    expect(path.join).toHaveBeenCalledWith(
      '/tmp/eyecons',
      'base',
      'file-light--abc123.svg',
    )

    expect(result).toEqual({
      temporaryFilePath: '/tmp/eyecons/base/file-light--abc123.svg',
      iconPath: './icons/theme/base/file-light--abc123.svg',
      fileName: 'file-light--abc123.svg',
      id: 'file-light',
      baseId: 'file',
      hash: 'abc123',
      isLight: true,
      type: 'base',
    })
  })

  it('should handle special characters in paths and filenames', () => {
    let icon = {
      theme: 'dark' as const,
      type: 'files' as const,
      name: 'Special Chars',
      id: 'special-chars',
    }

    let theme = createTheme('theme-&-Special', 'blue & white')

    let config = createMockConfig()
    config.outputIconsPath = 'icons/special theme'

    let result = prepareIconProcessing(
      {
        temporaryDirectory: '/tmp/eyecons with spaces',
        icon,
      },
      theme,
      config,
    )

    expect(generateHash).toHaveBeenCalledWith(
      'special-chars',
      'theme-&-Special',
      'blue & white',
    )
    expect(path.join).toHaveBeenCalledWith(
      '/tmp/eyecons with spaces',
      'files',
      'special-chars--abc123.svg',
    )

    expect(result.temporaryFilePath).toBe(
      '/tmp/eyecons with spaces/files/special-chars--abc123.svg',
    )
    expect(result.iconPath).toBe(
      './icons/special theme/files/special-chars--abc123.svg',
    )
  })

  it('should use config outputIconsPath to build iconPath', () => {
    let icon = {
      theme: 'dark' as const,
      type: 'base' as const,
      name: 'File',
      id: 'file',
    }

    let theme = createTheme('dark-theme', 'blue')

    let config = createMockConfig()
    config.outputIconsPath = 'custom/path/icons'

    let result = prepareIconProcessing(
      {
        temporaryDirectory: '/tmp/eyecons',
        icon,
      },
      theme,
      config,
    )

    expect(result.iconPath).toBe('./custom/path/icons/base/file--abc123.svg')
  })
})
