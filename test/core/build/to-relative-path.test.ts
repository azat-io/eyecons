import { describe, expect, it } from 'vitest'

import type { Config } from '../../../extension/types/config'

import { toRelativePath } from '../../../extension/core/build/to-relative-path'

describe('toRelativePath', () => {
  it('should convert absolute path to relative path', () => {
    let absolutePath = '/user/extension/dist/output/icons/file.svg'
    let basePath = '/user/extension/dist'

    let result = toRelativePath(absolutePath, {
      outputPath: basePath,
    } as Config)

    expect(result).toBe('./output/icons/file.svg')
  })

  it('should handle paths with different separators', () => {
    let absolutePath = String.raw`/user/extension/dist\output\icons\file.svg`
    let basePath = '/user/extension/dist'

    let result = toRelativePath(absolutePath, {
      outputPath: basePath,
    } as Config)

    expect(result).toBe('./output/icons/file.svg')
  })

  it('should add ./ prefix if not present', () => {
    let absolutePath = '/user/extension/dist/file.svg'
    let basePath = '/user/extension/dist'

    let result = toRelativePath(absolutePath, {
      outputPath: basePath,
    } as Config)

    expect(result).toBe('./file.svg')
  })

  it('should handle already relative paths', () => {
    let relativePath = './output/icons/file.svg'
    let basePath = '/user/extension/dist'

    let result = toRelativePath(relativePath, {
      outputPath: basePath,
    } as Config)

    expect(result).toBe('./output/icons/file.svg')
  })

  it('should handle paths when basePath is not a prefix of absolutePath', () => {
    let absolutePath = '/var/different/path/file.svg'
    let basePath = '/user/extension/dist'

    let result = toRelativePath(absolutePath, {
      outputPath: basePath,
    } as Config)

    expect(result).toBe('./var/different/path/file.svg')
  })

  it('should handle Windows-style paths', () => {
    let absolutePath = String.raw`C:\Users\user\extension\dist\output\icons\file.svg`
    let basePath = String.raw`C:\Users\user\extension\dist`

    let result = toRelativePath(absolutePath, {
      outputPath: basePath,
    } as Config)

    expect(result).toBe('./output/icons/file.svg')
  })
})
