import type { Vector } from '@texel/color'

import { describe, expect, it } from 'vitest'

import { filterPaletteForAchromatic } from '../../../extension/core/color/filter-palette-for-achromatic'
import { createMockConfig } from '../../helpers/create-mock-config'

describe('filterPaletteForAchromatic', () => {
  let config = createMockConfig()

  let white: Vector = [0.95, 0.01, 0]
  let lightGray: Vector = [0.85, 0.05, 180]
  let lightYellow: Vector = [0.85, 0.15, 90]
  let middleGray: Vector = [0.5, 0.02, 180]
  let nearBlack: Vector = [0.03, 0.08, 0]
  let saturatedBlue: Vector = [0.75, 0.3, 240]
  let saturatedGreen: Vector = [0.5, 0.15, 120]

  /**
   * Filters a palette for an achromatic source color.
   *
   * @param sourceColor - Source color treated as achromatic.
   * @param themePalette - Palette the filter picks matches from.
   * @returns The filtered palette, or the palette itself when nothing matches.
   */
  function filterPaletteFor(
    sourceColor: Vector,
    themePalette: Vector[],
  ): Vector[] {
    return filterPaletteForAchromatic({
      sourceAchromatic: true,
      themePalette,
      sourceColor,
      config,
    })
  }

  it('should match a near-white source with the light low-chroma palette colors', () => {
    let nearWhite: Vector = [0.95, 0.02, 0]
    let palette = [white, lightYellow, middleGray, lightGray, saturatedGreen]

    let result = filterPaletteFor(nearWhite, palette)

    expect(result).toEqual([white, lightGray])
  })

  it('should match a gray source with every achromatic palette color', () => {
    let darkGray: Vector = [0.3, 0.02, 0]
    let palette = [white, middleGray, saturatedBlue, nearBlack, saturatedGreen]

    let result = filterPaletteFor(darkGray, palette)

    expect(result).toEqual([white, middleGray, nearBlack])
  })

  it('should look only among light colors for a source just above the light threshold', () => {
    let justAboveLightThreshold: Vector = [0.91, 0.02, 0]

    let result = filterPaletteFor(justAboveLightThreshold, [white, middleGray])

    expect(result).toEqual([white])
  })

  it('should look among all achromatic colors for a source exactly on the light threshold', () => {
    let onLightThreshold: Vector = [0.9, 0.02, 0]

    let result = filterPaletteFor(onLightThreshold, [white, middleGray])

    expect(result).toEqual([white, middleGray])
  })

  it('should return the whole palette when it has no achromatic colors', () => {
    let gray: Vector = [0.4, 0.02, 0]
    let palette = [saturatedBlue, saturatedGreen]

    let result = filterPaletteFor(gray, palette)

    expect(result).toBe(palette)
  })

  it('should return the whole palette when a near-white source finds no light colors', () => {
    let nearWhite: Vector = [0.95, 0.02, 0]
    let palette = [saturatedBlue, saturatedGreen]

    let result = filterPaletteFor(nearWhite, palette)

    expect(result).toBe(palette)
  })
})
