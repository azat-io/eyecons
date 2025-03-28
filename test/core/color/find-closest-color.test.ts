import type { Vector } from '@texel/color'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Config } from '../../../extension/types/config'

import * as filterPaletteForAchromaticModule from '../../../extension/core/color/filter-palette-for-achromatic'
import * as filterColorsByHueCategoryModule from '../../../extension/core/color/filter-colors-by-hue-category'
import * as filterPaletteForChromaticModule from '../../../extension/core/color/filter-palette-for-chromatic'
import * as calculateWeightedDistanceModule from '../../../extension/core/color/calculate-weighted-distance'
import * as refineColorsByPropertiesModule from '../../../extension/core/color/refine-colors-by-properties'
import * as determineColorWeightsModule from '../../../extension/core/color/determine-color-weights'
import * as adjustSaturationModule from '../../../extension/core/color/adjust-saturation'
import { findClosestColor } from '../../../extension/core/color/find-closest-color'
import * as isAchromaticModule from '../../../extension/core/color/is-achromatic'
import { logger } from '../../../extension/io/vscode/logger'

let mockConfig: Config = {
  processing: {
    extremeLightnessThresholds: {
      light: 0.9,
      dark: 0.1,
    },
    lowSaturationThreshold: 0.05,
    saturationFactor: 1.5,
    adjustContrast: true,
  },
} as Config

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

describe('findClosestColor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(logger.withContext).mockReturnValue(mockLoggerContext)
  })

  it('should return source color for empty palette', () => {
    let sourceColor: Vector = [0.5, 0.2, 180]

    let result = findClosestColor(sourceColor, [], mockConfig)

    expect(result).toEqual(sourceColor)
    expect(mockLoggerContext.warn).toHaveBeenCalledWith(
      'Empty theme palette provided',
    )
  })

  it('should process achromatic colors correctly', () => {
    let sourceColor: Vector = [0.8, 0.01, 0]
    let palette: Vector[] = [
      [0.3, 0.02, 180],
      [0.7, 0.01, 0],
      [0.9, 0.03, 90],
    ]
    let expectedContext = {
      sourceAchromatic: true,
      themePalette: palette,
      config: mockConfig,
      sourceColor,
    }

    vi.spyOn(isAchromaticModule, 'isAchromatic').mockReturnValue(true)
    vi.spyOn(
      filterPaletteForAchromaticModule,
      'filterPaletteForAchromatic',
    ).mockReturnValue([palette[1]!])
    vi.spyOn(
      filterPaletteForChromaticModule,
      'filterPaletteForChromatic',
    ).mockReturnValue([])
    vi.spyOn(
      determineColorWeightsModule,
      'determineColorWeights',
    ).mockReturnValue({
      lightness: 1,
      chroma: 0.1,
      hue: 0.1,
    })
    vi.spyOn(adjustSaturationModule, 'adjustSaturation').mockReturnValue(
      palette[1]!,
    )

    let result = findClosestColor(sourceColor, palette, mockConfig)

    expect(result).toEqual(palette[1])
    expect(isAchromaticModule.isAchromatic).toHaveBeenCalledWith(
      sourceColor,
      mockConfig,
    )
    expect(
      filterPaletteForAchromaticModule.filterPaletteForAchromatic,
    ).toHaveBeenCalledWith(expectedContext)
    expect(
      filterPaletteForChromaticModule.filterPaletteForChromatic,
    ).not.toHaveBeenCalled()
  })

  it('should process chromatic colors correctly', () => {
    let sourceColor: Vector = [0.5, 0.3, 180]
    let palette: Vector[] = [
      [0.4, 0.2, 90],
      [0.6, 0.3, 175],
      [0.7, 0.4, 270],
    ]
    let filteredPalette: Vector[] = [palette[1]!]
    let expectedContext = {
      sourceAchromatic: false,
      themePalette: palette,
      config: mockConfig,
      sourceColor,
    }

    vi.spyOn(isAchromaticModule, 'isAchromatic').mockReturnValue(false)
    vi.spyOn(
      filterPaletteForChromaticModule,
      'filterPaletteForChromatic',
    ).mockReturnValue(palette)
    vi.spyOn(
      filterColorsByHueCategoryModule,
      'filterColorsByHueCategory',
    ).mockReturnValue(filteredPalette)
    vi.spyOn(
      refineColorsByPropertiesModule,
      'refineColorsByProperties',
    ).mockReturnValue(filteredPalette)
    vi.spyOn(
      determineColorWeightsModule,
      'determineColorWeights',
    ).mockReturnValue({
      lightness: 0.7,
      chroma: 0.3,
      hue: 2,
    })
    vi.spyOn(
      calculateWeightedDistanceModule,
      'calculateWeightedDistance',
    ).mockReturnValue(0.1)
    vi.spyOn(adjustSaturationModule, 'adjustSaturation').mockReturnValue(
      palette[1]!,
    )

    let result = findClosestColor(sourceColor, palette, mockConfig)

    expect(result).toEqual(palette[1])
    expect(isAchromaticModule.isAchromatic).toHaveBeenCalledWith(
      sourceColor,
      mockConfig,
    )
    expect(
      filterPaletteForChromaticModule.filterPaletteForChromatic,
    ).toHaveBeenCalledWith(expectedContext)
    expect(
      filterColorsByHueCategoryModule.filterColorsByHueCategory,
    ).toHaveBeenCalledWith(sourceColor, palette)
    expect(
      refineColorsByPropertiesModule.refineColorsByProperties,
    ).toHaveBeenCalledWith(sourceColor, filteredPalette)
  })

  it('should log color and weight information', () => {
    let sourceColor: Vector = [0.5, 0.3, 180]
    let palette: Vector[] = [[0.6, 0.3, 175]]

    vi.spyOn(isAchromaticModule, 'isAchromatic').mockReturnValue(false)
    vi.spyOn(
      filterPaletteForChromaticModule,
      'filterPaletteForChromatic',
    ).mockReturnValue(palette)
    vi.spyOn(
      filterColorsByHueCategoryModule,
      'filterColorsByHueCategory',
    ).mockReturnValue(palette)
    vi.spyOn(
      refineColorsByPropertiesModule,
      'refineColorsByProperties',
    ).mockReturnValue(palette)
    vi.spyOn(
      determineColorWeightsModule,
      'determineColorWeights',
    ).mockReturnValue({
      lightness: 0.7,
      chroma: 0.3,
      hue: 2,
    })

    findClosestColor(sourceColor, palette, mockConfig)

    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Source color info: Lightness=0.50, Chroma=0.30, Hue=180, Achromatic=false',
    )
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Weight info: Lightness=0.7, Chroma=0.3, Hue=2',
    )
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Using 1 of 1 colors from palette',
    )
  })

  it('should calculate closest color from filtered palette', () => {
    let sourceColor: Vector = [0.5, 0.3, 180]
    let palette: Vector[] = [
      [0.4, 0.2, 90],
      [0.6, 0.3, 175],
      [0.7, 0.4, 270],
    ]

    vi.spyOn(isAchromaticModule, 'isAchromatic').mockReturnValue(false)
    vi.spyOn(
      filterPaletteForChromaticModule,
      'filterPaletteForChromatic',
    ).mockReturnValue(palette)
    vi.spyOn(
      filterColorsByHueCategoryModule,
      'filterColorsByHueCategory',
    ).mockReturnValue(palette)
    vi.spyOn(
      refineColorsByPropertiesModule,
      'refineColorsByProperties',
    ).mockReturnValue(palette)
    vi.spyOn(
      calculateWeightedDistanceModule,
      'calculateWeightedDistance',
    ).mockImplementation(({ color2 }) => (color2 === palette[1] ? 0.1 : 0.5))

    let result = findClosestColor(sourceColor, palette, mockConfig)

    expect(result).toEqual(palette[1])
    expect(
      calculateWeightedDistanceModule.calculateWeightedDistance,
    ).toHaveBeenCalledTimes(3)
  })
})
