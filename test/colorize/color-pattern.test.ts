import { describe, expect, it } from 'vitest'

import { colorPattern } from '../../extension/colorize/color-pattern'

describe('getColorPattern', () => {
  it('should return a RegExp', () => {
    expect(colorPattern).toBeInstanceOf(RegExp)
  })

  it('should match color names', () => {
    expect('red'.match(colorPattern)).toBeTruthy()
  })

  it('should match hex colors', () => {
    expect('#f00'.match(colorPattern)).toBeTruthy()
  })
})
