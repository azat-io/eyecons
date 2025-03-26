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

describe('color Regular Expressions', () => {
  it.each([
    'rgb(255, 0, 0)',
    'rgb(0, 255, 0)',
    'rgb(0, 0, 255)',
    'rgb(0, 0, 0)',
    'rgb(255, 255, 255)',
  ])('should match old format RGB value: %s', value => {
    RGB_REGEX.lastIndex = 0
    let match = RGB_REGEX.exec(value)
    expect(match).not.toBeNull()
    expect(match!.groups).toHaveProperty('r')
    expect(match!.groups).toHaveProperty('g')
    expect(match!.groups).toHaveProperty('b')
  })

  it.each([
    'rgba(255, 0, 0, 0.5)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 0, 255, 0.8)',
    'rgba(0, 0, 0, 0)',
    'rgba(255, 255, 255, 0.3)',
  ])('should match old format RGBA value: %s', value => {
    RGB_REGEX.lastIndex = 0
    let match = RGB_REGEX.exec(value)
    expect(match).not.toBeNull()
    expect(match!.groups).toHaveProperty('r')
    expect(match!.groups).toHaveProperty('g')
    expect(match!.groups).toHaveProperty('b')
    expect(match!.groups).toHaveProperty('a')
  })

  it.each([
    'rgb(255 0 0)',
    'rgb(0 255 0)',
    'rgb(0 0 255)',
    'rgb(0 0 0)',
    'rgb(255 255 255)',
  ])('should match new format RGB value with spaces: %s', value => {
    RGB_REGEX.lastIndex = 0
    let match = RGB_REGEX.exec(value)
    expect(match).not.toBeNull()
    expect(match!.groups).toHaveProperty('r')
    expect(match!.groups).toHaveProperty('g')
    expect(match!.groups).toHaveProperty('b')
  })

  it.each([
    'rgb(255 0 0 / 0.5)',
    'rgb(0 255 0 / 1)',
    'rgb(0 0 255 / 0.8)',
    'rgb(0 0 0 / 0)',
    'rgb(255 255 255 / 0.3)',
  ])('should match new format RGB value with alpha via slash: %s', value => {
    RGB_REGEX.lastIndex = 0
    let match = RGB_REGEX.exec(value)
    expect(match).not.toBeNull()
    expect(match!.groups).toHaveProperty('r')
    expect(match!.groups).toHaveProperty('g')
    expect(match!.groups).toHaveProperty('b')
    expect(match!.groups).toHaveProperty('a')
  })

  it.each([
    'rgb(100%, 0%, 0%)',
    'rgb(0% 100% 0%)',
    'rgb(0%, 0%, 100%)',
    'rgb(100% 100% 100% / 50%)',
  ])('should match RGB value with percentage values: %s', value => {
    RGB_REGEX.lastIndex = 0
    let match = RGB_REGEX.exec(value)
    expect(match).not.toBeNull()
    expect(match!.groups).toHaveProperty('r')
    expect(match!.groups).toHaveProperty('g')
    expect(match!.groups).toHaveProperty('b')
  })

  it.each([
    'rgb(255 0 0 / 50%)',
    'rgba(0, 255, 0, 100%)',
    'rgb(0 0 255 / 80%)',
    'rgba(255, 255, 255, 30%)',
  ])('should match RGB value with percentage alpha: %s', value => {
    RGB_REGEX.lastIndex = 0
    let match = RGB_REGEX.exec(value)
    expect(match).not.toBeNull()
    expect(match!.groups).toHaveProperty('r')
    expect(match!.groups).toHaveProperty('g')
    expect(match!.groups).toHaveProperty('b')
    expect(match!.groups).toHaveProperty('a')
  })

  it.each([
    {
      value: 'rgb(255, 0, 0)',
      r: '255',
      g: '0',
      b: '0',
    },
    {
      value: 'rgba(0, 255, 0, 0.5)',
      g: '255',
      a: '0.5',
      r: '0',
      b: '0',
    },
    {
      value: 'rgb(0 0 255 / 80%)',
      b: '255',
      a: '80%',
      r: '0',
      g: '0',
    },
  ])('should extract correct groups from %s', ({ value, r, g, b, a }) => {
    RGB_REGEX.lastIndex = 0
    let match = RGB_REGEX.exec(value)
    expect(match!.groups!['r']).toBe(r)
    expect(match!.groups!['g']).toBe(g)
    expect(match!.groups!['b']).toBe(b)
    expect(match!.groups!['a']).toBe(a)
  })

  it.each([
    'hsl(0, 100%, 50%)',
    'hsl(120, 100%, 50%)',
    'hsl(240, 100%, 50%)',
    'hsl(0, 0%, 0%)',
    'hsl(0, 0%, 100%)',
  ])('should match old format HSL value: %s', value => {
    HSL_REGEX.lastIndex = 0
    let match = HSL_REGEX.exec(value)
    expect(match).not.toBeNull()
    expect(match!.groups).toHaveProperty('h')
    expect(match!.groups).toHaveProperty('s')
    expect(match!.groups).toHaveProperty('l')
  })

  it.each([
    'hsla(0, 100%, 50%, 0.5)',
    'hsla(120, 100%, 50%, 1)',
    'hsla(240, 100%, 50%, 0.8)',
    'hsla(0, 0%, 0%, 0)',
    'hsla(0, 0%, 100%, 0.3)',
  ])('should match old format HSLA value: %s', value => {
    HSL_REGEX.lastIndex = 0
    let match = HSL_REGEX.exec(value)
    expect(match).not.toBeNull()
    expect(match!.groups).toHaveProperty('h')
    expect(match!.groups).toHaveProperty('s')
    expect(match!.groups).toHaveProperty('l')
    expect(match!.groups).toHaveProperty('a')
  })

  it.each([
    'hsl(0 100% 50%)',
    'hsl(120 100% 50%)',
    'hsl(240 100% 50%)',
    'hsl(0 0% 0%)',
    'hsl(0 0% 100%)',
  ])('should match new format HSL value with spaces: %s', value => {
    HSL_REGEX.lastIndex = 0
    let match = HSL_REGEX.exec(value)
    expect(match).not.toBeNull()
    expect(match!.groups).toHaveProperty('h')
    expect(match!.groups).toHaveProperty('s')
    expect(match!.groups).toHaveProperty('l')
  })

  it.each([
    'hsl(0 100% 50% / 0.5)',
    'hsl(120 100% 50% / 1)',
    'hsl(240 100% 50% / 0.8)',
    'hsl(0 0% 0% / 0)',
    'hsl(0 0% 100% / 0.3)',
  ])('should match new format HSL value with alpha via slash: %s', value => {
    HSL_REGEX.lastIndex = 0
    let match = HSL_REGEX.exec(value)
    expect(match).not.toBeNull()
    expect(match!.groups).toHaveProperty('h')
    expect(match!.groups).toHaveProperty('s')
    expect(match!.groups).toHaveProperty('l')
    expect(match!.groups).toHaveProperty('a')
  })

  it.each([
    'hsl(0 100% 50% / 50%)',
    'hsla(120, 100%, 50%, 100%)',
    'hsl(240 100% 50% / 80%)',
    'hsla(0, 0%, 100%, 30%)',
  ])('should match HSL value with percentage alpha: %s', value => {
    HSL_REGEX.lastIndex = 0
    let match = HSL_REGEX.exec(value)
    expect(match).not.toBeNull()
    expect(match!.groups).toHaveProperty('h')
    expect(match!.groups).toHaveProperty('s')
    expect(match!.groups).toHaveProperty('l')
    expect(match!.groups).toHaveProperty('a')
  })

  it.each([
    'hsl(0deg, 100%, 50%)',
    'hsl(0.5turn 100% 50%)',
    'hsl(6.28rad, 100%, 50%)',
    'hsl(400grad 100% 50%)',
  ])('should match HSL value with angle units: %s', value => {
    HSL_REGEX.lastIndex = 0
    let match = HSL_REGEX.exec(value)
    expect(match).not.toBeNull()
    expect(match!.groups).toHaveProperty('h')
    expect(match!.groups).toHaveProperty('s')
    expect(match!.groups).toHaveProperty('l')
  })

  it.each([
    {
      value: 'hsl(0, 100%, 50%)',
      s: '100%',
      l: '50%',
      h: '0',
    },
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
  ])('should extract correct groups from %s', ({ value, h, s, l, a }) => {
    HSL_REGEX.lastIndex = 0
    let match = HSL_REGEX.exec(value)
    expect(match!.groups!['h']).toBe(h)
    expect(match!.groups!['s']).toBe(s)
    expect(match!.groups!['l']).toBe(l)
    expect(match!.groups!['a']).toBe(a)
  })

  it.each(['#f00', '#0f0', '#00f', '#fff', '#000'])(
    'should match 3-digit hex color: %s',
    value => {
      HEX_REGEX.lastIndex = 0
      let match = HEX_REGEX.exec(value)
      expect(match).not.toBeNull()
      expect(match!.groups).toHaveProperty('hex')
    },
  )

  it.each(['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'])(
    'should match 6-digit hex color: %s',
    value => {
      HEX_REGEX.lastIndex = 0
      let match = HEX_REGEX.exec(value)
      expect(match).not.toBeNull()
      expect(match!.groups).toHaveProperty('hex')
    },
  )

  it.each(['#f00f', '#0f0f', '#00ff', '#fff8', '#0000'])(
    'should match 4-digit hex color with alpha: %s',
    value => {
      HEX_REGEX.lastIndex = 0
      let match = HEX_REGEX.exec(value)
      expect(match).not.toBeNull()
      expect(match!.groups).toHaveProperty('hex')
    },
  )

  it.each(['#ff0000ff', '#00ff00ff', '#0000ff80', '#ffffff33', '#00000000'])(
    'should match 8-digit hex color with alpha: %s',
    value => {
      HEX_REGEX.lastIndex = 0
      let match = HEX_REGEX.exec(value)
      expect(match).not.toBeNull()
      expect(match!.groups).toHaveProperty('hex')
    },
  )

  it.each([
    ['#f00', 'f00'],
    ['#00ff00', '00ff00'],
    ['#0000ff80', '0000ff80'],
  ])('should extract correct hex value from %s', (value, expected) => {
    HEX_REGEX.lastIndex = 0
    let match = HEX_REGEX.exec(value)
    expect(match!.groups!['hex']).toBe(expected)
  })
})
