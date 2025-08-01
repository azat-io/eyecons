import type { Vector } from '@texel/color'

import type { ColorMatchContext } from '../../types/color'
import type { Config } from '../../types/config'

import { filterPaletteForAchromatic } from './filter-palette-for-achromatic'
import { filterColorsByHueCategory } from './filter-colors-by-hue-category'
import { filterPaletteForChromatic } from './filter-palette-for-chromatic'
import { calculateWeightedDistance } from './calculate-weighted-distance'
import { refineColorsByProperties } from './refine-colors-by-properties'
import { determineColorWeights } from './determine-color-weights'
import { adjustSaturation } from './adjust-saturation'
import { logger } from '../../io/vscode/logger'
import { isAchromatic } from './is-achromatic'

/**
 * Finds the closest matching color from a theme palette for a given source
 * color.
 *
 * @param sourceColor - The OKLCH color to match.
 * @param themePalette - Array of available theme colors in OKLCH format.
 * @param config - The configuration for color matching.
 * @returns The closest matching color from the theme palette.
 */
export function findClosestColor(
  sourceColor: Vector,
  themePalette: Vector[],
  config: Config,
): Vector {
  let colorLogger = logger.withContext('ColorMatch')

  if (themePalette.length === 0) {
    colorLogger.warn('Empty theme palette provided')
    return sourceColor
  }

  let sourceAchromatic = isAchromatic(sourceColor, config)
  let [lightness, chroma, hue] = sourceColor as [number, number, number]

  let sourceColorInfo = [
    `Lightness=${lightness.toFixed(2)}`,
    `Chroma=${chroma.toFixed(2)}`,
    `Hue=${hue.toFixed(0)}`,
    `Achromatic=${sourceAchromatic}`,
  ]
  colorLogger.info(`Source color info: ${sourceColorInfo.join(', ')}`)

  let context: ColorMatchContext = {
    sourceAchromatic,
    themePalette,
    sourceColor,
    config,
  }

  let filteredPalette = sourceAchromatic
    ? filterPaletteForAchromatic(context)
    : filterPaletteForChromatic(context)

  if (!sourceAchromatic && filteredPalette.length > 1) {
    filteredPalette = filterColorsByHueCategory(sourceColor, filteredPalette)
    filteredPalette = refineColorsByProperties(sourceColor, filteredPalette)
  }

  let weights = determineColorWeights(sourceColor, sourceAchromatic)

  let weightInfo = [
    `Lightness=${weights.lightness}`,
    `Chroma=${weights.chroma}`,
    `Hue=${weights.hue}`,
  ]
  colorLogger.info(`Weight info: ${weightInfo.join(', ')}`)
  colorLogger.info(
    `Using ${filteredPalette.length} of ${
      themePalette.length
    } colors from palette`,
  )

  let [closestColor] = filteredPalette
  let minDistance = calculateWeightedDistance({
    color2: closestColor!,
    color1: sourceColor,
    weights,
    config,
  })

  for (let index = 1; index < filteredPalette.length; index++) {
    let distance = calculateWeightedDistance({
      color2: filteredPalette[index]!,
      color1: sourceColor,
      weights,
      config,
    })

    if (distance < minDistance) {
      minDistance = distance
      closestColor = filteredPalette[index]
    }
  }

  let [closestLightness, closestChroma, closestHue] = closestColor as [
    number,
    number,
    number,
  ]

  let closestColorInfo = [
    `Lightness=${closestLightness.toFixed(2)}`,
    `Chroma=${closestChroma.toFixed(2)}`,
    `Hue=${closestHue.toFixed(0)}`,
    `Distance=${minDistance.toFixed(4)}`,
  ]

  colorLogger.info(`Closest color info: ${closestColorInfo.join(', ')}`)

  return adjustSaturation(closestColor!, config)
}
