import type { Vector } from '@texel/color'

import { describe, expect, vi, it } from 'vitest'

import type { ColorMatchContext } from '../../../extension/types/color'
import type { Config } from '../../../extension/types/config'

import { filterPaletteForAchromatic } from '../../../extension/core/color/filter-palette-for-achromatic'
import * as isAchromaticModule from '../../../extension/core/color/is-achromatic'

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
  let mockConfig: Config = {
    processing: {
      extremeLightnessThresholds: {
        light: 0.95,
        dark: 0.05,
      },
      lowSaturationThreshold: 0.05,
      saturationFactor: 1.2,
      adjustContrast: true,
    },
    errorHandling: {
      showNotifications: true,
      continueOnError: true,
    },
    logging: {
      level: 'info',
      toFile: false,
    },
    iconDefinitionsPath: '',
    sourceIconsPath: '',
    outputIconsPath: '',
    extensionPath: '',
    version: '1.0.0',
    outputPath: '',
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

    let context: ColorMatchContext = {
      sourceAchromatic: true,
      config: mockConfig,
      themePalette,
      sourceColor,
    }

    let result = filterPaletteForAchromatic(context)

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

    let context: ColorMatchContext = {
      sourceAchromatic: true,
      config: mockConfig,
      themePalette,
      sourceColor,
    }

    let result = filterPaletteForAchromatic(context)

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

    let context: ColorMatchContext = {
      sourceAchromatic: true,
      config: mockConfig,
      themePalette,
      sourceColor,
    }

    let result = filterPaletteForAchromatic(context)

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

    let context: ColorMatchContext = {
      sourceAchromatic: true,
      config: mockConfig,
      themePalette,
      sourceColor,
    }

    let result = filterPaletteForAchromatic(context)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual([0.7, 0.03, 0])
    expect(result).toContainEqual([0.3, 0.04, 180])

    isAchromaticSpy.mockRestore()
  })

  it('should handle edge case with empty palette', () => {
    let sourceColor: Vector = [0.95, 0.02, 0]
    let themePalette: Vector[] = []

    let context: ColorMatchContext = {
      sourceAchromatic: true,
      config: mockConfig,
      themePalette,
      sourceColor,
    }

    let result = filterPaletteForAchromatic(context)

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

    let contextAtBoundary: ColorMatchContext = {
      sourceColor: sourceColorAtBoundary,
      sourceAchromatic: true,
      config: mockConfig,
      themePalette,
    }

    let resultAtBoundary = filterPaletteForAchromatic(contextAtBoundary)

    expect(resultAtBoundary).toHaveLength(1)
    expect(resultAtBoundary).toContainEqual([0.95, 0.01, 0])

    let contextBelowBoundary: ColorMatchContext = {
      sourceColor: sourceColorBelowBoundary,
      sourceAchromatic: true,
      config: mockConfig,
      themePalette,
    }

    let resultBelowBoundary = filterPaletteForAchromatic(contextBelowBoundary)

    expect(resultBelowBoundary).toHaveLength(2)

    isAchromaticSpy.mockRestore()
  })
})
