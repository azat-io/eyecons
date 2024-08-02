import { describe, expect, it } from 'vitest'

import { enhanceContrast } from '../../extension/colorize/enhance-contrast'

describe('enhanceContrast', () => {
  it('should enhance contrast for first color', () => {
    let [color1, color2] = enhanceContrast([
      { mode: 'oklch', h: 147.94, l: 0.87, c: 0.22 },
      { mode: 'oklch', h: 66.98, l: 0.83, c: 0.12 },
    ])
    expect(color1).toEqual({ mode: 'oklch', h: 147.94, l: 0.87, c: 0.17 })
    expect(color2).toEqual({ mode: 'oklch', h: 66.98, l: 0.83, c: 0.12 })
  })

  it('should enhance contrast for second color', () => {
    let [color1, color2] = enhanceContrast([
      { mode: 'oklch', l: 0.76, c: 0.11, h: 133 },
      { mode: 'oklch', l: 0.82, c: 0.09, h: 133 },
    ])
    expect(color1).toEqual({ mode: 'oklch', l: 0.76, c: 0.11, h: 133 })
    expect(color2).toEqual({ mode: 'oklch', l: 0.82, c: 0.04, h: 133 })
  })

  it('should enhance contrast for light colors', () => {
    let [color1, color2] = enhanceContrast([
      { mode: 'oklch', l: 0.94, c: 0.09, h: 133 },
      { mode: 'oklch', l: 0.96, c: 0.06, h: 133 },
    ])
    expect(color1).toEqual({ mode: 'oklch', l: 0.94, c: 0.14, h: 133 })
    expect(color2).toEqual({ mode: 'oklch', l: 0.96, c: 0.06, h: 133 })
  })

  it('should enhance contrast for dark colors', () => {
    let [color1, color2] = enhanceContrast([
      { mode: 'oklch', l: 0.02, c: 0.15, h: 133 },
      { mode: 'oklch', l: 0.04, c: 0.15, h: 133 },
    ])
    expect(color1).toEqual({ mode: 'oklch', l: 0.02, c: 0.15, h: 133 })
    expect(color2).toEqual({ mode: 'oklch', l: 0.04, c: 0.1, h: 133 })
  })
})
