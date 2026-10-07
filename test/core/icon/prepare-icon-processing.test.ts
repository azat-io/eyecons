import { describe, expect, it } from 'vitest'

import type { FormattedIconValue } from '../../../extension/types/icon'
import type { Theme } from '../../../extension/types/theme'

import { prepareIconProcessing } from '../../../extension/core/icon/prepare-icon-processing'
import { createMockConfig } from '../../helpers/create-mock-config'
import { createMockTheme } from '../../helpers/create-mock-theme'

describe('prepareIconProcessing', () => {
  let config = createMockConfig()
  let theme = createMockTheme()
  let temporaryDirectory = '/tmp/eyecons-abc123'

  let file: FormattedIconValue = {
    theme: 'dark',
    type: 'base',
    name: 'File',
    id: 'file',
  }

  let fileLight: FormattedIconValue = {
    id: 'file-light',
    theme: 'light',
    name: 'File',
    type: 'base',
  }

  let javascript: FormattedIconValue = {
    extensions: ['js'],
    name: 'JavaScript',
    theme: 'dark',
    type: 'files',
    id: 'js',
  }

  /**
   * Prepares an icon for processing into the temporary directory.
   *
   * @param icon - Icon to prepare.
   * @param forTheme - Theme the icon is built for.
   * @returns Paths and names for the processed icon.
   */
  function prepare(
    icon: FormattedIconValue,
    forTheme: Theme = theme,
  ): ReturnType<typeof prepareIconProcessing> {
    return prepareIconProcessing({ temporaryDirectory, icon }, forTheme, config)
  }

  it('should name the icon file after the icon and a short hash', () => {
    let result = prepare(file)

    expect(result.hash).toMatch(/^[\da-f]{8}$/u)
    expect(result.fileName).toBe(`file--${result.hash}.svg`)
  })

  it('should put the icon file into the directory of its type', () => {
    let result = prepare(javascript)

    expect(result).toEqual(
      expect.objectContaining({
        temporaryFilePath: `/tmp/eyecons-abc123/files/${result.fileName}`,
        iconPath: `./icons/files/${result.fileName}`,
        isLight: false,
        type: 'files',
        baseId: 'js',
        id: 'js',
      }),
    )
  })

  it('should give a light variant its own file and the id of its dark icon', () => {
    let result = prepare(fileLight)

    expect(result).toEqual(
      expect.objectContaining({
        fileName: expect.stringMatching(
          /^file-light--[\da-f]{8}\.svg$/u,
        ) as string,
        temporaryFilePath: `/tmp/eyecons-abc123/base/${result.fileName}`,
        iconPath: `./icons/base/${result.fileName}`,
        id: 'file-light',
        baseId: 'file',
        isLight: true,
      }),
    )
  })

  it('should keep the file name while the icon, theme and folder color stay the same', () => {
    expect(prepare(file).fileName).toBe(prepare(file).fileName)
  })

  it('should rename the icon file when the theme changes', () => {
    let nordTheme = createMockTheme({ id: 'nord' })

    expect(prepare(file, nordTheme).fileName).not.toBe(prepare(file).fileName)
  })

  it('should rename the icon file when the folder color changes', () => {
    let purpleTheme = createMockTheme({ folderColor: 'purple' })

    expect(prepare(file, purpleTheme).fileName).not.toBe(prepare(file).fileName)
  })
})
