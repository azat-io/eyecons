import { hexToRGB as hexToRgb, convert, OKLCH, sRGB } from '@texel/color'
import { describe, expect, it } from 'vitest'

import { toHex } from '../../../extension/core/color/to-hex'

describe('toHex', () => {
  it('should convert an OKLCH color to a hexadecimal string', () => {
    expect(toHex(convert(hexToRgb('#a7b2b5'), sRGB, OKLCH))).toBe('#a7b2b5')
  })

  it('should pad single digit channels with a zero', () => {
    expect(toHex(convert(hexToRgb('#010203'), sRGB, OKLCH))).toBe('#010203')
  })

  it('should round trip pure black and pure white', () => {
    expect(toHex(convert(hexToRgb('#000000'), sRGB, OKLCH))).toBe('#000000')
    expect(toHex(convert(hexToRgb('#ffffff'), sRGB, OKLCH))).toBe('#ffffff')
  })

  it('should clamp channels that fall outside the sRGB gamut', () => {
    expect(toHex([1.5, 0.4, 120])).toBe('#ffff00')
    expect(toHex([0.8, 0.37, 140])).toBe('#00ee00')
  })
})
