import type { Vector } from '@texel/color'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { NAMED_COLORS } from '../../../extension/core/color/constants'
import { toOklch } from '../../../extension/core/color/to-oklch'

/**
 * Builds a matcher for an OKLCH color that tolerates the rounding of hex colors
 * to whole channel values.
 *
 * @param color - Expected color as [Lightness, Chroma, Hue].
 * @returns Matcher to pass to `toEqual`.
 */
function closeToOklch([lightness, chroma, hue]: Vector): unknown[] {
  return [
    expect.closeTo(lightness!, 2),
    expect.closeTo(chroma!, 2),
    expect.closeTo(hue!, 0),
  ]
}

describe('toOklch', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should convert a hex color to OKLCH lightness, chroma and hue', () => {
    let expectedRed: Vector = [0.628, 0.2577, 29.23]

    let result = toOklch('#ff0000')

    expect(result).toEqual(closeToOklch(expectedRed))
  })

  it('should convert white and black to the ends of the lightness scale', () => {
    let expectedWhite: Vector = [1, 0, 0]
    let expectedBlack: Vector = [0, 0, 0]

    expect(toOklch('#ffffff')).toEqual(closeToOklch(expectedWhite))
    expect(toOklch('#000000')).toEqual(closeToOklch(expectedBlack))
  })

  it.each([
    ['#f00', '#ff0000'],
    ['rgb(255, 165, 0)', '#ffa500'],
    ['rgb(255 165 0)', '#ffa500'],
    ['rgba(0, 0, 128, 1)', '#000080'],
    ['orange', '#ffa500'],
    ['Navy', '#000080'],
    ['  #ffa500  ', '#ffa500'],
  ])('should convert %s to the same color as %s', (value, hexValue) => {
    let expected = toOklch(hexValue)

    let result = toOklch(value)

    expect(result).toEqual(expected)
  })

  it.each([
    ['hsl(0, 100%, 50%)', '#ff0000'],
    ['hsl(120, 100%, 50%)', '#00ff00'],
    ['hsl(240 100% 50%)', '#0000ff'],
    ['hsla(60, 100%, 50%, 1)', '#ffff00'],
    ['hsl(210, 50%, 40%)', '#336699'],
    ['hsl(240, 100%, 80%)', '#9999ff'],
    ['hsl(120, 100%, 25%)', '#008000'],
    ['hsl(0, 0%, 50%)', '#808080'],
    ['hsl(0, 0%, 100%)', '#ffffff'],
  ])('should convert %s like the CSS color %s', (value, hexValue) => {
    let expected = toOklch(hexValue)

    let result = toOklch(value)

    expect(result).toEqual(closeToOklch(expected))
  })

  it.each([
    'hsl(180deg 100% 50%)',
    'hsl(0.5turn 100% 50%)',
    'hsl(200grad 100% 50%)',
    'hsl(3.14159rad 100% 50%)',
    'hsl(540, 100%, 50%)',
  ])('should read the hue of %s as cyan', value => {
    let expected = toOklch('#00ffff')

    let result = toOklch(value)

    expect(result).toEqual(closeToOklch(expected))
  })

  it.each([
    ['rgb(100%, 0%, 0%)', '#ff0000'],
    ['rgb(0% 100% 0%)', '#00ff00'],
    ['rgb(100% 100% 100% / 50%)', '#ffffff'],
    ['rgb(20%, 40%, 60%)', '#336699'],
    ['rgba(50%, 50%, 50%, 1)', '#808080'],
  ])('should convert %s like the CSS color %s', (value, hexValue) => {
    let expected = toOklch(hexValue)

    let result = toOklch(value)

    expect(result).toEqual(closeToOklch(expected))
  })

  it.each([
    ['rgb(invalid)', 'Failed to parse RGB string: "rgb(invalid)"'],
    ['hsl(invalid)', 'Failed to parse HSL string: "hsl(invalid)"'],
    ['nonexistentcolor', 'Color "nonexistentcolor" is not recognized.'],
  ])('should reject %s', (value, expectedMessage) => {
    expect(() => toOklch(value)).toThrow(expectedMessage)
  })

  it('should rethrow a non-Error failure unchanged', () => {
    let failure: unknown = 'Broken color table'
    vi.spyOn(NAMED_COLORS, 'get').mockImplementation(() => {
      throw failure
    })

    expect(() => toOklch('red')).toThrow(/^Broken color table$/u)
  })
})
