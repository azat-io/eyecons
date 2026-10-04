import { describe, expect, it } from 'vitest'

import { toRelativePath } from '../../../extension/core/build/to-relative-path'
import { createMockConfig } from '../../helpers/create-mock-config'

describe('toRelativePath', () => {
  let config = createMockConfig({ outputPath: '/user/extension/dist/output' })

  it.each([
    ['/user/extension/dist/output/icons/files/js.svg', './icons/files/js.svg'],
    ['/user/extension/dist/output/loader.svg', './loader.svg'],
    [
      String.raw`/user/extension/dist/output\icons\files\js.svg`,
      './icons/files/js.svg',
    ],
  ])(
    'should make %s relative to the output directory',
    (absolutePath, expected) => {
      expect(toRelativePath(absolutePath, config)).toBe(expected)
    },
  )

  it('should make a Windows path relative to the output directory', () => {
    let windowsConfig = createMockConfig({
      outputPath: String.raw`C:\Users\user\extension\dist\output`,
    })

    let result = toRelativePath(
      String.raw`C:\Users\user\extension\dist\output\icons\files\js.svg`,
      windowsConfig,
    )

    expect(result).toBe('./icons/files/js.svg')
  })

  it('should keep an already relative path', () => {
    expect(toRelativePath('./icons/files/js.svg', config)).toBe(
      './icons/files/js.svg',
    )
  })

  it('should turn a path outside the output directory into a ./ path', () => {
    expect(toRelativePath('/var/different/path/js.svg', config)).toBe(
      './var/different/path/js.svg',
    )
  })
})
