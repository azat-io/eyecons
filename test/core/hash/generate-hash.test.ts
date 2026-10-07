import { describe, expect, it } from 'vitest'

import { generateHash } from '../../../extension/core/hash/generate-hash'

describe('generateHash', () => {
  it.each([
    [['file', 'dark', 'blue']],
    [['justOneInput']],
    [['', 'Theme', '']],
    [['file-with-специальные-символы.svg', 'Theme!@#$', '青色']],
    [[]],
  ])('should make eight hexadecimal characters out of %j', parts => {
    expect(generateHash(...parts)).toMatch(/^[\da-f]{8}$/u)
  })

  it('should generate the same hash for the same inputs', () => {
    expect(generateHash('file', 'dark', 'blue')).toBe(
      generateHash('file', 'dark', 'blue'),
    )
  })

  it('should generate different hashes for different inputs', () => {
    expect(generateHash('file', 'dark', 'blue')).not.toBe(
      generateHash('folder', 'dark', 'blue'),
    )
  })

  it('should generate different hashes when the order of the inputs changes', () => {
    expect(generateHash('a', 'b', 'c')).not.toBe(generateHash('c', 'b', 'a'))
  })

  it('should keep the boundaries between the inputs', () => {
    expect(generateHash('ab', 'c')).not.toBe(generateHash('a', 'bc'))
  })
})
