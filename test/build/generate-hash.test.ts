import { describe, expect, it } from 'vitest'

import { generateHash } from '../../extension/build/generate-hash'

describe('generateHash', () => {
  it('should generate a hash', () => {
    let hash = generateHash('javascript', 'github-dark', 'blue')
    expect(hash).toBe('919c6596')
  })
})
