import type { Vector } from '@texel/color'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { filterColorsByHueCategory } from '../../../extension/core/color/filter-colors-by-hue-category'
import * as categorizeColorsByHueModule from '../../../extension/core/color/categorize-colors-by-hue'
import * as categorizeColorByHueModule from '../../../extension/core/color/categorize-color-by-hue'
import { logger } from '../../../extension/io/vscode/logger'

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

vi.mock('../../../extension/io/vscode/logger', () => ({
  logger: {
    withContext: vi.fn(),
  },
}))

describe('filterColorsByHueCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(logger.withContext).mockReturnValue(mockLoggerContext)
  })

  it('should match colors in yellow family', () => {
    let yellowColor: Vector = [0.7, 0.1, 75]
    let matchingColors: Vector[] = [
      [0.6, 0.09, 45],
      [0.7, 0.15, 95],
      [0.5, 0.2, 200],
    ]

    let result = filterColorsByHueCategory(yellowColor, matchingColors)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual([0.6, 0.09, 45])
    expect(result).toContainEqual([0.7, 0.15, 95])
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Found 2 colors in yellow family',
    )
  })

  it('should match colors in yellow-green range differently', () => {
    let yellowGreenColor: Vector = [0.7, 0.1, 95]
    let matchingColors: Vector[] = [
      [0.6, 0.09, 45],
      [0.7, 0.15, 90],
      [0.5, 0.2, 105],
    ]

    let result = filterColorsByHueCategory(yellowGreenColor, matchingColors)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual([0.6, 0.09, 45])
    expect(result).toContainEqual([0.7, 0.15, 90])
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Found 2 colors in yellow family',
    )
  })

  it('should match colors in purple-pink family', () => {
    let purpleColor: Vector = [0.6, 0.1, 290]
    let matchingColors: Vector[] = [
      [0.5, 0.08, 280],
      [0.7, 0.08, 320],
      [0.6, 0.07, 200],
    ]

    let result = filterColorsByHueCategory(purpleColor, matchingColors)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual([0.5, 0.08, 280])
    expect(result).toContainEqual([0.7, 0.08, 320])
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Found 2 colors in purple-pink family',
    )
  })

  it('should match colors in red-orange family', () => {
    let redColor: Vector = [0.5, 0.1, 10]
    let matchingColors: Vector[] = [
      [0.6, 0.15, 45],
      [0.7, 0.15, 35],
      [0.5, 0.07, 200],
    ]

    let result = filterColorsByHueCategory(redColor, matchingColors)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual([0.6, 0.15, 45])
    expect(result).toContainEqual([0.7, 0.15, 35])
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Found 2 colors in red-orange family',
    )
  })

  it('should handle bright chromatic colors specially', () => {
    let brightColor: Vector = [0.85, 0.15, 180]
    let matchingColors: Vector[] = [
      [0.85, 0.15, 185],
      [0.82, 0.15, 165],
      [0.5, 0.13, 250],
    ]

    let result = filterColorsByHueCategory(brightColor, matchingColors)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual([0.85, 0.15, 185])
    expect(result).toContainEqual([0.82, 0.15, 165])
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Found 2 colors in bright chromatic source',
    )
  })

  it('should fallback to category-based matching', () => {
    let blueColor: Vector = [0.5, 0.1, 230]
    let matchingColors: Vector[] = [
      [0.6, 0.15, 220],
      [0.7, 0.12, 240],
      [0.5, 0.08, 40],
    ]

    vi.spyOn(
      categorizeColorByHueModule,
      'categorizeColorByHue',
    ).mockReturnValue('blue')
    vi.spyOn(
      categorizeColorsByHueModule,
      'categorizeColorsByHue',
    ).mockReturnValue({
      blue: [
        [0.6, 0.15, 220],
        [0.7, 0.12, 240],
      ],
    })

    let result = filterColorsByHueCategory(blueColor, matchingColors)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual([0.6, 0.15, 220])
    expect(result).toContainEqual([0.7, 0.12, 240])
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Refined to 2 colors with similar hue category',
    )
  })

  it('should return all chromatic colors when no matches found', () => {
    let unusualColor: Vector = [0.5, 0.1, 230]
    let chromaticColors: Vector[] = [
      [0.6, 0.15, 40],
      [0.7, 0.12, 120],
    ]

    vi.spyOn(
      categorizeColorByHueModule,
      'categorizeColorByHue',
    ).mockReturnValue('blue')
    vi.spyOn(
      categorizeColorsByHueModule,
      'categorizeColorsByHue',
    ).mockReturnValue({})

    let result = filterColorsByHueCategory(unusualColor, chromaticColors)

    expect(result).toBe(chromaticColors)
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'No colors in similar hue category, using all chromatic colors',
    )
  })

  it('should handle empty input array', () => {
    let color: Vector = [0.5, 0.1, 230]
    let result = filterColorsByHueCategory(color, [])

    expect(result).toHaveLength(0)
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'No colors in similar hue category, using all chromatic colors',
    )
  })

  it('should include colors from adjacent categories when main category has no matches', () => {
    let blueColor: Vector = [0.5, 0.1, 250]

    let chromaticColors: Vector[] = [
      [0.6, 0.08, 240],
      [0.5, 0.07, 200],
      [0.7, 0.09, 280],
      [0.4, 0.06, 100],
    ]

    vi.spyOn(
      categorizeColorByHueModule,
      'categorizeColorByHue',
    ).mockReturnValue('blue')
    vi.spyOn(
      categorizeColorsByHueModule,
      'categorizeColorsByHue',
    ).mockReturnValue({
      purple: [[0.7, 0.09, 280]],
      green: [[0.4, 0.06, 100]],
      blue: [[0.6, 0.08, 240]],
      cyan: [[0.5, 0.07, 200]],
    })

    let result = filterColorsByHueCategory(blueColor, chromaticColors)

    expect(result).toHaveLength(3)
    expect(result).toContainEqual([0.6, 0.08, 240])
    expect(result).toContainEqual([0.5, 0.07, 200])
    expect(result).toContainEqual([0.7, 0.09, 280])
    expect(result).not.toContainEqual([0.4, 0.06, 100])

    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Refined to 3 colors with similar hue category',
    )
  })

  it('should handle non-existent source category gracefully', () => {
    let someColor: Vector = [0.5, 0.1, 250]
    let chromaticColors: Vector[] = [
      [0.6, 0.08, 240],
      [0.5, 0.07, 200],
    ]

    vi.spyOn(
      categorizeColorByHueModule,
      'categorizeColorByHue',
    ).mockReturnValue('non-existent-category')
    vi.spyOn(
      categorizeColorsByHueModule,
      'categorizeColorsByHue',
    ).mockReturnValue({
      blue: [[0.6, 0.08, 240]],
      cyan: [[0.5, 0.07, 200]],
    })

    let result = filterColorsByHueCategory(someColor, chromaticColors)

    expect(result).toEqual(chromaticColors)
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'No colors in similar hue category, using all chromatic colors',
    )
  })

  it('should match colors in purple-pink family with target range and chroma threshold', () => {
    let purpleColor: Vector = [0.6, 0.1, 290]

    let matchingColors: Vector[] = [
      [0.5, 0.06, 280],
      [0.7, 0.04, 320],
      [0.6, 0.07, 340],
      [0.5, 0.08, 350],
      [0.6, 0.07, 200],
    ]

    let result = filterColorsByHueCategory(purpleColor, matchingColors)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual([0.5, 0.06, 280])
    expect(result).toContainEqual([0.6, 0.07, 340])
    expect(result).not.toContainEqual([0.7, 0.04, 320])
    expect(result).not.toContainEqual([0.5, 0.08, 350])
    expect(result).not.toContainEqual([0.6, 0.07, 200])

    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Found 2 colors in purple-pink family',
    )
  })
})
