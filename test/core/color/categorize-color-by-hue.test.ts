import { describe, expect, it } from 'vitest'

import { categorizeColorByHue } from '../../../extension/core/color/categorize-color-by-hue'
import { COLOR_CATEGORIES } from '../../../extension/core/color/constants'

describe('categorizeColorByHue', () => {
  it.each([
    [10, 'red'],
    [30, 'orange'],
    [50, 'yellow'],
    [103, 'yellowGreen'],
    [130, 'green'],
    [180, 'cyan'],
    [220, 'blue'],
    [270, 'purple'],
    [300, 'magenta'],
    [350, 'red'],
  ])('should put hue %d into the %s category', (hue, expectedCategory) => {
    expect(categorizeColorByHue(hue)).toBe(expectedCategory)
  })

  it.each([
    ['on the start of yellow', COLOR_CATEGORIES.YELLOW.minHue, 'yellow'],
    ['just before the start of yellow', 44.99, 'orange'],
    ['on the start of red', COLOR_CATEGORIES.RED.minHue, 'red'],
    ['just before the start of red', 344.99, 'magenta'],
    ['on the end of red', COLOR_CATEGORIES.RED.maxHue, 'orange'],
    ['just before the end of red', 24.99, 'red'],
  ])(
    'should categorize a hue %s by the hue ranges',
    (_, hue, expectedCategory) => {
      expect(categorizeColorByHue(hue)).toBe(expectedCategory)
    },
  )

  it.each([
    [360, 'red'],
    [405, 'yellow'],
    [-1, 'red'],
    [-100, 'purple'],
  ])(
    'should wrap hue %d around the color wheel into the %s category',
    (hue, expectedCategory) => {
      expect(categorizeColorByHue(hue)).toBe(expectedCategory)
    },
  )

  it('should fall back to red for a color without a hue', () => {
    expect(categorizeColorByHue(Number.NaN)).toBe('red')
  })
})
