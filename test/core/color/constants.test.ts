/*
  eslint id-length: [
    'error',
    {
      exceptions: ['r', 'g', 'b', 'h', 's', 'l', 'a'],
      min: 2,
    }
  ]
*/

import { describe, expect, it } from 'vitest'

import {
  RGB_REGEX,
  HSL_REGEX,
  HEX_REGEX,
} from '../../../extension/core/color/constants'

/**
 * Runs a global color regular expression over a value from its start.
 *
 * @param regex - Regular expression under test.
 * @param value - Text that may contain a color.
 * @returns The first match, or `null` when the value holds no color.
 */
function matchColor(regex: RegExp, value: string): RegExpExecArray | null {
  regex.lastIndex = 0
  return regex.exec(value)
}

describe('color regular expressions', () => {
  it.each([
    ['#f00', 'f00'],
    ['#f00f', 'f00f'],
    ['#ff0000', 'ff0000'],
    ['#0000ff80', '0000ff80'],
  ])('should match the hex color %s as a whole', (value, hex) => {
    let match = matchColor(HEX_REGEX, value)

    expect(match?.[0]).toBe(value)
    expect(match?.groups).toEqual({ hex })
  })

  it.each(['#ff', '#fffff', '#ggg'])(
    'should not match the malformed hex color %s',
    value => {
      expect(matchColor(HEX_REGEX, value)).toBeNull()
    },
  )

  it.each([
    { value: 'rgb(255, 0, 0)', r: '255', g: '0', b: '0' },
    { value: 'rgba(0, 255, 0, 0.5)', g: '255', a: '0.5', r: '0', b: '0' },
    { value: 'rgb(0 0 255)', b: '255', r: '0', g: '0' },
    { value: 'rgb(0 0 255 / 0.8)', b: '255', a: '0.8', r: '0', g: '0' },
    { value: 'rgb(255 0 0 / 50%)', r: '255', a: '50%', g: '0', b: '0' },
    { value: 'rgb(100%, 0%, 0%)', r: '100%', g: '0%', b: '0%' },
  ])('should capture the channels of $value', ({ value, ...channels }) => {
    let match = matchColor(RGB_REGEX, value)

    expect(match?.[0]).toBe(value)
    expect(match?.groups).toEqual({ rgb: value, ...channels })
  })

  it.each(['rgb(1, 2)', 'rgb(12.5, 0, 0)'])(
    'should not match the malformed rgb() color %s',
    value => {
      expect(matchColor(RGB_REGEX, value)).toBeNull()
    },
  )

  it.each([
    { value: 'hsl(0, 100%, 50%)', s: '100%', l: '50%', h: '0' },
    {
      value: 'hsla(120, 100%, 50%, 0.5)',
      s: '100%',
      h: '120',
      l: '50%',
      a: '0.5',
    },
    {
      value: 'hsl(240deg 100% 50% / 80%)',
      h: '240deg',
      s: '100%',
      l: '50%',
      a: '80%',
    },
    { value: 'hsl(0.5turn 100% 50%)', h: '0.5turn', s: '100%', l: '50%' },
  ])('should capture the components of $value', ({ value, ...components }) => {
    let match = matchColor(HSL_REGEX, value)

    expect(match?.groups).toEqual(components)
  })

  it('should match an hsl() color up to its closing parenthesis', () => {
    let value = 'hsl(0, 100%, 50%)'

    let match = matchColor(HSL_REGEX, value)

    expect(match?.[0]).toBe(value)
  })

  it('should not match an hsl() color without the closing parenthesis', () => {
    expect(matchColor(HSL_REGEX, 'hsl(0, 100%, 50%')).toBeNull()
  })

  it('should not match an hsl() color without percent signs', () => {
    expect(matchColor(HSL_REGEX, 'hsl(0 100 50)')).toBeNull()
  })
})
