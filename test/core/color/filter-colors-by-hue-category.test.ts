import type { Vector } from '@texel/color'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { filterColorsByHueCategory } from '../../../extension/core/color/filter-colors-by-hue-category'
import * as categorizeColorsByHueModule from '../../../extension/core/color/categorize-colors-by-hue'
import * as categorizeColorByHueModule from '../../../extension/core/color/categorize-color-by-hue'

describe('filterColorsByHueCategory', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should keep yellow family colors for a yellow source', () => {
    let yellow: Vector = [0.7, 0.1, 75]
    let goldenOrange: Vector = [0.6, 0.09, 45]
    let limeGreen: Vector = [0.7, 0.15, 108]
    let dullYellow: Vector = [0.6, 0.05, 80]
    let blue: Vector = [0.5, 0.2, 200]

    let result = filterColorsByHueCategory(yellow, [
      goldenOrange,
      dullYellow,
      blue,
      limeGreen,
    ])

    expect(result).toEqual([goldenOrange, limeGreen])
  })

  it('should narrow the yellow family for a yellow-green source', () => {
    let yellowGreen: Vector = [0.7, 0.1, 95]
    let goldenOrange: Vector = [0.6, 0.09, 45]
    let yellow: Vector = [0.7, 0.15, 90]
    let greenishYellow: Vector = [0.6, 0.12, 100]
    let lime: Vector = [0.5, 0.2, 105]

    let result = filterColorsByHueCategory(yellowGreen, [
      goldenOrange,
      greenishYellow,
      yellow,
      lime,
    ])

    expect(result).toEqual([goldenOrange, yellow])
  })

  it('should keep saturated purple and magenta colors for a purple source', () => {
    let purple: Vector = [0.6, 0.1, 290]
    let violet: Vector = [0.5, 0.06, 280]
    let dullMagenta: Vector = [0.7, 0.04, 320]
    let magenta: Vector = [0.6, 0.07, 340]
    let red: Vector = [0.5, 0.08, 350]
    let blue: Vector = [0.6, 0.07, 200]

    let result = filterColorsByHueCategory(purple, [
      violet,
      dullMagenta,
      magenta,
      red,
      blue,
    ])

    expect(result).toEqual([violet, magenta])
  })

  it('should keep red and orange colors for an orange source', () => {
    let orange: Vector = [0.6, 0.1, 35]
    let amber: Vector = [0.6, 0.15, 45]
    let red: Vector = [0.7, 0.15, 5]
    let yellow: Vector = [0.6, 0.15, 60]
    let blue: Vector = [0.5, 0.07, 200]

    let result = filterColorsByHueCategory(orange, [amber, yellow, red, blue])

    expect(result).toEqual([amber, red])
  })

  it('should keep bright colors of a similar hue for a bright source', () => {
    let brightCyan: Vector = [0.85, 0.15, 180]
    let brightAqua: Vector = [0.85, 0.15, 185]
    let brightGreen: Vector = [0.82, 0.15, 165]
    let darkCyan: Vector = [0.6, 0.15, 175]
    let brightSky: Vector = [0.9, 0.15, 210]

    let result = filterColorsByHueCategory(brightCyan, [
      brightAqua,
      darkCyan,
      brightGreen,
      brightSky,
    ])

    expect(result).toEqual([brightAqua, brightGreen])
  })

  it('should keep colors of the same and the adjacent hue categories when no color family applies', () => {
    let blue: Vector = [0.5, 0.1, 230]
    let azure: Vector = [0.6, 0.15, 220]
    let cyan: Vector = [0.7, 0.12, 180]
    let violet: Vector = [0.7, 0.09, 270]
    let yellowGreen: Vector = [0.4, 0.06, 100]
    let orange: Vector = [0.5, 0.2, 30]

    let result = filterColorsByHueCategory(blue, [
      yellowGreen,
      violet,
      orange,
      cyan,
      azure,
    ])

    expect(result).toHaveLength(3)
    expect(result).toEqual(expect.arrayContaining([azure, cyan, violet]))
  })

  it('should fall back to the adjacent hue categories when no color of the source family is available', () => {
    let yellow: Vector = [0.7, 0.1, 75]
    let dullOrange: Vector = [0.6, 0.06, 30]
    let blue: Vector = [0.5, 0.2, 200]

    let result = filterColorsByHueCategory(yellow, [blue, dullOrange])

    expect(result).toEqual([dullOrange])
  })

  it('should keep every color when none has a similar hue', () => {
    let blue: Vector = [0.5, 0.1, 230]
    let palette: Vector[] = [
      [0.6, 0.15, 40],
      [0.7, 0.12, 120],
    ]

    let result = filterColorsByHueCategory(blue, palette)

    expect(result).toBe(palette)
  })

  it('should return an empty palette as is', () => {
    let blue: Vector = [0.5, 0.1, 230]
    let palette: Vector[] = []

    let result = filterColorsByHueCategory(blue, palette)

    expect(result).toBe(palette)
  })

  /*
   * The two tests below reach defensive branches that the real hue helpers
   * never take: they always name one of the nine categories and always return
   * all nine of them. The helpers are replaced only to keep those branches
   * covered.
   */

  it('should keep every color when the hue category of the source is unknown', () => {
    let blue: Vector = [0.5, 0.1, 230]
    let palette: Vector[] = [[0.6, 0.15, 220]]
    vi.spyOn(
      categorizeColorByHueModule,
      'categorizeColorByHue',
    ).mockReturnValue('unknown')

    let result = filterColorsByHueCategory(blue, palette)

    expect(result).toBe(palette)
  })

  it('should skip hue categories missing from the categorized colors', () => {
    let blue: Vector = [0.5, 0.1, 230]
    let palette: Vector[] = [[0.6, 0.15, 220]]
    vi.spyOn(
      categorizeColorsByHueModule,
      'categorizeColorsByHue',
    ).mockReturnValue({})

    let result = filterColorsByHueCategory(blue, palette)

    expect(result).toBe(palette)
  })
})
