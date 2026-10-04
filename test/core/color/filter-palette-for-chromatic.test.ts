import type { Vector } from '@texel/color'

import { describe, expect, it } from 'vitest'

import { filterPaletteForChromatic } from '../../../extension/core/color/filter-palette-for-chromatic'
import { createMockConfig } from '../../helpers/create-mock-config'

describe('filterPaletteForChromatic', () => {
  let config = createMockConfig()

  let sourceColor: Vector = [0.6, 0.25, 30]
  let teal: Vector = [0.5, 0.3, 180]
  let purple: Vector = [0.6, 0.2, 300]
  let middleGray: Vector = [0.5, 0.02, 0]
  let nearBlack: Vector = [0.03, 0.08, 0]

  /**
   * Filters a palette for the chromatic source color.
   *
   * @param themePalette - Palette the filter picks matches from.
   * @returns The chromatic colors, or the palette itself when there are none.
   */
  function filterPalette(themePalette: Vector[]): Vector[] {
    return filterPaletteForChromatic({
      sourceAchromatic: false,
      themePalette,
      sourceColor,
      config,
    })
  }

  it('should drop the achromatic colors from a palette with chromatic ones', () => {
    let result = filterPalette([middleGray, teal, nearBlack, purple])

    expect(result).toEqual([teal, purple])
  })

  it('should return the whole palette when it has only achromatic colors', () => {
    let palette = [middleGray, nearBlack]

    let result = filterPalette(palette)

    expect(result).toBe(palette)
  })

  it('should return an empty palette as is', () => {
    let palette: Vector[] = []

    let result = filterPalette(palette)

    expect(result).toBe(palette)
  })
})
