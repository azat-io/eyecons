import { describe, expect, it } from 'vitest'

import { generateHash } from '../../../extension/core/hash/generate-hash'

describe('generateHash', () => {
  it('should generate a consistent hash for the same inputs', () => {
    let hash1 = generateHash('file.svg', 'Dark Theme', 'blue')
    let hash2 = generateHash('file.svg', 'Dark Theme', 'blue')

    expect(hash1).toBe(hash2)
  })

  it('should generate different hashes for different inputs', () => {
    let hash1 = generateHash('file1.svg', 'Dark Theme', 'blue')
    let hash2 = generateHash('file2.svg', 'Dark Theme', 'blue')

    expect(hash1).not.toBe(hash2)
  })

  it('should handle any number of input strings', () => {
    let singleHash = generateHash('justOneInput')
    expect(singleHash).toHaveLength(8)

    let manyHash = generateHash(
      'icon.svg',
      'Dark Theme',
      'blue',
      'extra1',
      'extra2',
      'extra3',
    )
    expect(manyHash).toHaveLength(8)
  })

  it('should generate different hashes when order changes', () => {
    let hash1 = generateHash('a', 'b', 'c')
    let hash2 = generateHash('c', 'b', 'a')

    expect(hash1).not.toBe(hash2)
  })

  it('should handle empty strings', () => {
    expect(() => {
      generateHash('', 'Theme', '')
    }).not.toThrow()
  })

  it('should handle special characters in inputs', () => {
    expect(() => {
      generateHash('file-with-специальные-символы.svg', 'Theme!@#$', '青色')
    }).not.toThrow()
  })

  it('should generate a hash even with no inputs', () => {
    let hash = generateHash()
    expect(hash).toHaveLength(8)
    expect(hash).toBe(generateHash())
  })
})
