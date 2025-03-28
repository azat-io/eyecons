import { describe, expect, it } from 'vitest'

import { categorizeColorByHue } from '../../../extension/core/color/categorize-color-by-hue'
import { COLOR_CATEGORIES } from '../../../extension/core/color/constants'

describe('categorizeColorByHue', () => {
  it('should categorize colors within standard hue ranges correctly', () => {
    expect(categorizeColorByHue(50)).toEqual(COLOR_CATEGORIES.YELLOW.name)
    expect(categorizeColorByHue(103)).toEqual(
      COLOR_CATEGORIES.YELLOW_GREEN.name,
    )
    expect(categorizeColorByHue(180)).toEqual(COLOR_CATEGORIES.CYAN.name)
    expect(categorizeColorByHue(220)).toEqual(COLOR_CATEGORIES.BLUE.name)
    expect(categorizeColorByHue(270)).toEqual(COLOR_CATEGORIES.PURPLE.name)
    expect(categorizeColorByHue(300)).toEqual(COLOR_CATEGORIES.MAGENTA.name)
    expect(categorizeColorByHue(30)).toEqual(COLOR_CATEGORIES.ORANGE.name)
  })

  it('should categorize colors at category boundaries correctly', () => {
    expect(categorizeColorByHue(COLOR_CATEGORIES.YELLOW.minHue)).toEqual(
      COLOR_CATEGORIES.YELLOW.name,
    )
    expect(
      categorizeColorByHue(COLOR_CATEGORIES.YELLOW.maxHue - 0.001),
    ).toEqual(COLOR_CATEGORIES.YELLOW.name)
    expect(categorizeColorByHue(COLOR_CATEGORIES.YELLOW.maxHue)).not.toEqual(
      COLOR_CATEGORIES.YELLOW.name,
    )

    expect(categorizeColorByHue(COLOR_CATEGORIES.GREEN.minHue)).toEqual(
      COLOR_CATEGORIES.GREEN.name,
    )
    expect(categorizeColorByHue(COLOR_CATEGORIES.GREEN.maxHue - 0.001)).toEqual(
      COLOR_CATEGORIES.GREEN.name,
    )
  })

  it('should handle the special case of categories that cross the 0/360 boundary', () => {
    let redCategory = COLOR_CATEGORIES.RED

    expect(categorizeColorByHue(350)).toEqual(redCategory.name)
    expect(categorizeColorByHue(359)).toEqual(redCategory.name)
    expect(categorizeColorByHue(0)).toEqual(redCategory.name)
    expect(categorizeColorByHue(10)).toEqual(redCategory.name)
    expect(categorizeColorByHue(redCategory.maxHue - 0.001)).toEqual(
      redCategory.name,
    )

    expect(categorizeColorByHue(redCategory.minHue)).toEqual(redCategory.name)
    expect(categorizeColorByHue(redCategory.maxHue)).not.toEqual(
      redCategory.name,
    )
  })

  it('should default to RED for edge cases', () => {
    let mockHue = -1

    expect(categorizeColorByHue(mockHue)).toEqual(COLOR_CATEGORIES.RED.name)
  })

  it('should handle edge case hue values', () => {
    expect(categorizeColorByHue(360)).toEqual(COLOR_CATEGORIES.RED.name)
    expect(categorizeColorByHue(361)).toEqual(COLOR_CATEGORIES.RED.name)
    expect(categorizeColorByHue(-10)).toEqual(COLOR_CATEGORIES.RED.name)
    expect(categorizeColorByHue(Number.NaN)).toEqual(COLOR_CATEGORIES.RED.name)
  })

  it('should give consistent results with equivalent hue values', () => {
    let baseHue = 45
    let equivalentHue = baseHue + 360

    expect(categorizeColorByHue(baseHue)).toEqual(
      categorizeColorByHue(equivalentHue),
    )
  })
})
