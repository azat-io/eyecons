import type { Vector } from '@texel/color'

import { describe, expect, vi, it } from 'vitest'

import { filterPaletteForAchromatic } from '../../../extension/core/color/filter-palette-for-achromatic'
import * as isAchromaticModule from '../../../extension/core/color/is-achromatic'
import { createMockConfig } from '../../helpers/create-mock-config'

vi.mock('../../io/vscode/logger', () => ({
  logger: {
    withContext: () => ({
      error: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
    }),
  },
}))

describe('filterPaletteForAchromatic', () => {
  let mockConfig = createMockConfig()

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
      config: mockConfig,
      themePalette,
      sourceColor,
    })
  }

  it('should filter light colors with low chroma', () => {
    let sourceColor: Vector = [0.95, 0.02, 0]

    let themePalette: Vector[] = [
      [0.95, 0.01, 0],
      [0.85, 0.05, 180],
      [0.75, 0.3, 240],
      [0.2, 0.01, 0],
      [0.5, 0.15, 120],
    ]

    let result = filterPaletteFor(sourceColor, themePalette)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual([0.95, 0.01, 0])
    expect(result).toContainEqual([0.85, 0.05, 180])
  })

  it('should filter achromatic colors for non-light achromatic source', () => {
    let isAchromaticSpy = vi.spyOn(isAchromaticModule, 'isAchromatic')
    isAchromaticSpy.mockImplementation(color => {
      let [lightness, chroma] = color as [number, number, number]
      return chroma < 0.05 || (lightness < 0.1 && chroma < 0.1)
    })

    let sourceColor: Vector = [0.3, 0.02, 0]

    let themePalette: Vector[] = [
      [0.95, 0.01, 0],
      [0.5, 0.02, 180],
      [0.75, 0.3, 240],
      [0.05, 0.01, 0],
      [0.5, 0.15, 120],
    ]

    let result = filterPaletteFor(sourceColor, themePalette)

    expect(result).toHaveLength(3)
    expect(result).toContainEqual([0.95, 0.01, 0])
    expect(result).toContainEqual([0.5, 0.02, 180])
    expect(result).toContainEqual([0.05, 0.01, 0])

    isAchromaticSpy.mockRestore()
  })

  it('should return full palette if no matching colors found', () => {
    let sourceColor: Vector = [0.95, 0.02, 0]

    let themePalette: Vector[] = [
      [0.75, 0.3, 240],
      [0.2, 0.2, 0],
      [0.5, 0.15, 120],
    ]

    let result = filterPaletteFor(sourceColor, themePalette)

    expect(result).toBe(themePalette)
    expect(result).toHaveLength(3)
  })

  it('should filter all achromatic colors when no light colors found', () => {
    let isAchromaticSpy = vi.spyOn(isAchromaticModule, 'isAchromatic')
    isAchromaticSpy.mockImplementation(color => {
      let [, chroma] = color as [number, number, number]
      return chroma < 0.05
    })

    let sourceColor: Vector = [0.5, 0.02, 0]

    let themePalette: Vector[] = [
      [0.7, 0.03, 0],
      [0.3, 0.04, 180],
      [0.75, 0.3, 240],
      [0.5, 0.15, 120],
    ]

    let result = filterPaletteFor(sourceColor, themePalette)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual([0.7, 0.03, 0])
    expect(result).toContainEqual([0.3, 0.04, 180])

    isAchromaticSpy.mockRestore()
  })

  it('should return palette when achromatic filtering finds no matches', () => {
    let isAchromaticSpy = vi.spyOn(isAchromaticModule, 'isAchromatic')
    isAchromaticSpy.mockReturnValue(false)

    let sourceColor: Vector = [0.4, 0.02, 0]
    let themePalette: Vector[] = [
      [0.7, 0.2, 0],
      [0.3, 0.25, 120],
      [0.5, 0.3, 240],
    ]

    let result = filterPaletteFor(sourceColor, themePalette)

    expect(result).toBe(themePalette)
    expect(result).toHaveLength(3)

    isAchromaticSpy.mockRestore()
  })

  it('should handle edge case with empty palette', () => {
    let sourceColor: Vector = [0.95, 0.02, 0]
    let themePalette: Vector[] = []

    let result = filterPaletteFor(sourceColor, themePalette)

    expect(result).toHaveLength(0)
  })

  it('should handle edge case at the boundary of light colors (lightness=0.9)', () => {
    let sourceColorAtBoundary: Vector = [0.91, 0.02, 0]
    let sourceColorBelowBoundary: Vector = [0.9, 0.02, 0]

    let themePalette: Vector[] = [
      [0.95, 0.01, 0],
      [0.5, 0.02, 180],
    ]

    let isAchromaticSpy = vi.spyOn(isAchromaticModule, 'isAchromatic')
    isAchromaticSpy.mockReturnValue(true)

    let resultAtBoundary = filterPaletteFor(sourceColorAtBoundary, themePalette)

    expect(resultAtBoundary).toHaveLength(1)
    expect(resultAtBoundary).toContainEqual([0.95, 0.01, 0])

    let resultBelowBoundary = filterPaletteFor(
      sourceColorBelowBoundary,
      themePalette,
    )

    expect(resultBelowBoundary).toHaveLength(2)

    isAchromaticSpy.mockRestore()
  })
})
