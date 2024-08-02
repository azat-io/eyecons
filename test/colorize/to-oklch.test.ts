import { describe, expect, it } from 'vitest'

import { toOklch } from '../../extension/colorize/to-oklch'

describe('toOklch', () => {
  it('should convert hex to oklch', () => {
    expect(toOklch('#fff')).toEqual({
      mode: 'oklch',
      l: 1,
      c: 0,
    })

    expect(toOklch('#ff0000')).toEqual({
      mode: 'oklch',
      h: 29.23,
      l: 0.63,
      c: 0.26,
    })

    expect(toOklch('rgb(0, 0, 255)')).toEqual({
      mode: 'oklch',
      h: 264.05,
      c: 0.31,
      l: 0.45,
    })

    expect(toOklch('green')).toEqual({
      mode: 'oklch',
      h: 142.5,
      c: 0.18,
      l: 0.52,
    })

    expect(toOklch('oklch(87.06% 0.221 147.94)')).toEqual({
      mode: 'oklch',
      h: 147.94,
      l: 0.87,
      c: 0.22,
    })
  })

  it('should throw error for invalid color', () => {
    expect(() => toOklch('invalid')).toThrow(
      'Could not convert invalid to OKLCH',
    )
  })
})
