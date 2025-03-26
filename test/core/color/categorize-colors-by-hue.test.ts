import type { Vector } from '@texel/color'

import { describe, expect, it, vi } from 'vitest'

import { categorizeColorsByHue } from '../../../extension/core/color/categorize-colors-by-hue'

vi.mock('../../core/color/categorize-color-by-hue', () => ({
  categorizeColorByHue: vi.fn(hue => {
    if (hue >= 0 && hue < 25) {
      return 'red'
    }
    if (hue >= 25 && hue < 45) {
      return 'orange'
    }
    if (hue >= 45 && hue < 100) {
      return 'yellow'
    }
    if (hue >= 100 && hue < 105) {
      return 'yellowGreen'
    }
    if (hue >= 105 && hue < 165) {
      return 'green'
    }
    if (hue >= 165 && hue < 195) {
      return 'cyan'
    }
    if (hue >= 195 && hue < 255) {
      return 'blue'
    }
    if (hue >= 255 && hue < 285) {
      return 'purple'
    }
    if (hue >= 285 && hue < 345) {
      return 'magenta'
    }
    return 'red'
  }),
}))

describe('categorizeColorsByHue', () => {
  it('should categorize colors correctly by hue', () => {
    let testColors: [number, number, number][] = [
      [0.5, 0.1, 15],
      [0.6, 0.08, 30],
      [0.7, 0.15, 60],
      [0.6, 0.12, 102],
      [0.5, 0.1, 120],
      [0.6, 0.09, 180],
      [0.4, 0.11, 220],
      [0.5, 0.14, 270],
      [0.6, 0.13, 300],
    ]

    let result = categorizeColorsByHue(testColors)

    expect(result['red']).toHaveLength(1)
    expect(result['red']?.[0]).toEqual([0.5, 0.1, 15])

    expect(result['orange']).toHaveLength(1)
    expect(result['orange']?.[0]).toEqual([0.6, 0.08, 30])

    expect(result['yellow']).toHaveLength(1)
    expect(result['yellow']?.[0]).toEqual([0.7, 0.15, 60])

    expect(result['yellowGreen']).toHaveLength(1)
    expect(result['yellowGreen']?.[0]).toEqual([0.6, 0.12, 102])

    expect(result['green']).toHaveLength(1)
    expect(result['green']?.[0]).toEqual([0.5, 0.1, 120])

    expect(result['cyan']).toHaveLength(1)
    expect(result['cyan']?.[0]).toEqual([0.6, 0.09, 180])

    expect(result['blue']).toHaveLength(1)
    expect(result['blue']?.[0]).toEqual([0.4, 0.11, 220])

    expect(result['purple']).toHaveLength(1)
    expect(result['purple']?.[0]).toEqual([0.5, 0.14, 270])

    expect(result['magenta']).toHaveLength(1)
    expect(result['magenta']?.[0]).toEqual([0.6, 0.13, 300])
  })

  it('should filter out colors with chroma less than 0.03', () => {
    let testColors: [number, number, number][] = [
      [0.5, 0.02, 120],
      [0.6, 0.03, 180],
      [0.7, 0.04, 240],
    ]

    let result = categorizeColorsByHue(testColors)

    expect(Object.values(result).flat()).toHaveLength(2)

    expect(result['cyan']).toHaveLength(1)
    expect(result['cyan']?.[0]).toEqual([0.6, 0.03, 180])

    expect(result['blue']).toHaveLength(1)
    expect(result['blue']?.[0]).toEqual([0.7, 0.04, 240])

    expect(result['green']).toEqual([])
  })

  it('should handle empty input array', () => {
    let result = categorizeColorsByHue([])

    expect(Object.values(result).flat()).toHaveLength(0)
    expect(Object.keys(result)).toHaveLength(9)

    for (let category of Object.values(result)) {
      expect(category).toEqual([])
    }
  })

  it('should handle colors with missing or invalid hue values', () => {
    let testColors = [
      [0.5, 0.1],
      [0.6, 0.08, Number.NaN],
      [0.7, 0.15, 60],
    ]

    let result = categorizeColorsByHue(testColors)

    expect(result['yellow']).toBeDefined()
    expect(result['yellow']?.length).toBeGreaterThanOrEqual(1)

    let allColors = Object.values(result).flat()
    expect(allColors).toContainEqual([0.7, 0.15, 60])
  })

  it('should correctly categorize colors into predefined categories', () => {
    let testColor = [0.5, 0.1, 42]
    let testColors = [testColor]

    let result = categorizeColorsByHue(testColors)

    let categoryWithColor = Object.entries(result).find(([, colors]) =>
      colors.includes(testColor),
    )?.[0]

    expect(categoryWithColor).toBeDefined()

    let nonEmptyCategories = Object.entries(result)
      .filter(([, colors]) => colors.length > 0)
      .map(([category]) => category)

    expect(nonEmptyCategories).toHaveLength(1)

    let categoryContents = result[categoryWithColor!]
    expect(categoryContents).toHaveLength(1)
    expect(categoryContents?.[0]).toEqual(testColor)

    let expectedCategories = [
      'yellowGreen',
      'magenta',
      'orange',
      'yellow',
      'purple',
      'green',
      'cyan',
      'blue',
      'red',
    ]
    expect(Object.keys(result).sort()).toEqual(expectedCategories.toSorted())
  })

  it('should preserve original color objects', () => {
    let testColors = [[0.5, 0.1, 120] as Vector]

    let result = categorizeColorsByHue(testColors)

    expect(result['green']?.[0]).toBe(testColors[0])
  })
})
