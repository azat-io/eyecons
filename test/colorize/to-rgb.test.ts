import { describe, expect, it } from 'vitest'

import { toRgb } from '../../extension/colorize/to-rgb'

describe('toRgb', () => {
  it('should convert hex to rgb', () => {
    expect(toRgb('#fff')).toBe('#ffffff')
    expect(toRgb('#ff0000')).toBe('#ff0000')
    expect(toRgb('rgb(0, 0, 255)')).toBe('#0000ff')
    expect(toRgb('green')).toBe('#008000')
  })

  it('should convert oklch object to rgb', () => {
    expect(toRgb({ mode: 'oklch', l: 1, c: 0 })).toBe('#ffffff')
    expect(toRgb({ mode: 'oklch', h: 29.23, l: 0.63, c: 0.26 })).toBe('#ff0000')
    expect(toRgb({ mode: 'oklch', h: 142.5, c: 0.18, l: 0.52 })).toBe('#008000')
    expect(toRgb({ mode: 'oklch', h: 147.94, l: 0.87, c: 0.22 })).toBe(
      '#50fa7a',
    )
    expect(toRgb({ mode: 'oklch', h: 147.94, l: 0.97, c: 0.32 })).toBe(
      '#00ff5f',
    )
  })

  it('should throw error for invalid color', () => {
    expect(() => toRgb('invalid')).toThrow('Could not convert invalid to RGB')
  })
})
