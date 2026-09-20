import type { Vector } from '@texel/color'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as filterPaletteForAchromaticModule from '../../../extension/core/color/filter-palette-for-achromatic'
import * as filterColorsByHueCategoryModule from '../../../extension/core/color/filter-colors-by-hue-category'
import * as filterPaletteForChromaticModule from '../../../extension/core/color/filter-palette-for-chromatic'
import * as calculateWeightedDistanceModule from '../../../extension/core/color/calculate-weighted-distance'
import * as refineColorsByPropertiesModule from '../../../extension/core/color/refine-colors-by-properties'
import * as determineColorWeightsModule from '../../../extension/core/color/determine-color-weights'
import * as adjustSaturationModule from '../../../extension/core/color/adjust-saturation'
import { findClosestColor } from '../../../extension/core/color/find-closest-color'
import { createMockLoggerContext } from '../../helpers/create-mock-logger-context'
import * as isAchromaticModule from '../../../extension/core/color/is-achromatic'
import { createMockConfig } from '../../helpers/create-mock-config'
import { logger } from '../../../extension/io/vscode/logger'

let mockConfig = createMockConfig({
  processing: {
    extremeLightnessThresholds: {
      light: 0.9,
      dark: 0.1,
    },
    lowSaturationThreshold: 0.05,
    saturationFactor: 1.5,
    adjustContrast: true,
  },
})

let chromaticPalette: Vector[] = [
  [0.4, 0.2, 90],
  [0.6, 0.3, 175],
  [0.7, 0.4, 270],
]

let mockLoggerContext = createMockLoggerContext()

vi.mock('../../../extension/io/vscode/logger', () => ({
  logger: {
    withContext: vi.fn(),
  },
}))

/**
 * Stubs every step of the chromatic branch so that the palette reaching the
 * distance calculation is known.
 *
 * @param themePalette - Palette `filterPaletteForChromatic` returns.
 * @param refinedPalette - Palette the hue and property refinements return.
 */
function mockChromaticPipeline(
  themePalette: Vector[],
  refinedPalette: Vector[] = themePalette,
): void {
  vi.spyOn(isAchromaticModule, 'isAchromatic').mockReturnValue(false)
  vi.spyOn(
    filterPaletteForChromaticModule,
    'filterPaletteForChromatic',
  ).mockReturnValue(themePalette)
  vi.spyOn(
    filterColorsByHueCategoryModule,
    'filterColorsByHueCategory',
  ).mockReturnValue(refinedPalette)
  vi.spyOn(
    refineColorsByPropertiesModule,
    'refineColorsByProperties',
  ).mockReturnValue(refinedPalette)
}

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
    let filteredPalette: Vector[] = [chromaticPalette[1]!]
    let expectedContext = {
      themePalette: chromaticPalette,
      sourceAchromatic: false,
      config: mockConfig,
      sourceColor,
    }

    mockChromaticPipeline(chromaticPalette, filteredPalette)
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
      chromaticPalette[1]!,
    )

    let result = findClosestColor(sourceColor, chromaticPalette, mockConfig)

    expect(result).toEqual(chromaticPalette[1])
    expect(isAchromaticModule.isAchromatic).toHaveBeenCalledWith(
      sourceColor,
      mockConfig,
    )
    expect(
      filterPaletteForChromaticModule.filterPaletteForChromatic,
    ).toHaveBeenCalledWith(expectedContext)
    expect(
      filterColorsByHueCategoryModule.filterColorsByHueCategory,
    ).toHaveBeenCalledWith(sourceColor, chromaticPalette)
    expect(
      refineColorsByPropertiesModule.refineColorsByProperties,
    ).toHaveBeenCalledWith(sourceColor, filteredPalette)
  })

  it('should log color and weight information', () => {
    let sourceColor: Vector = [0.5, 0.3, 180]
    let palette: Vector[] = [[0.6, 0.3, 175]]

    mockChromaticPipeline(palette)
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

    mockChromaticPipeline(chromaticPalette)
    vi.spyOn(
      calculateWeightedDistanceModule,
      'calculateWeightedDistance',
    ).mockImplementation(({ color2 }) =>
      color2 === chromaticPalette[1] ? 0.1 : 0.5,
    )

    let result = findClosestColor(sourceColor, chromaticPalette, mockConfig)

    expect(result).toEqual(chromaticPalette[1])
    expect(
      calculateWeightedDistanceModule.calculateWeightedDistance,
    ).toHaveBeenCalledTimes(3)
  })
})
