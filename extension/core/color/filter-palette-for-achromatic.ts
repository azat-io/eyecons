import type { Vector } from '@texel/color'

import type { ColorMatchContext } from '../../types/color'

import { logger } from '../../io/vscode/logger'
import { isAchromatic } from './is-achromatic'

const LIGHTNESS_THRESHOLD_HIGH = 0.9
const CHROMA_THRESHOLD_LOW = 0.03
const LIGHT_COLOR_LIGHTNESS_THRESHOLD = 0.8
const LIGHT_COLOR_CHROMA_THRESHOLD = 0.1

/**
 * Checks if a color is light and achromatic. A color is considered light
 * achromatic when its lightness is above 0.9 and chroma is below 0.03.
 *
 * @param {Vector} color - Color vector in OKLCH format [lightness, chroma,
 *   hue].
 * @returns {boolean} True if the color is light and achromatic.
 */
let isLightAchromatic = ([lightness, chroma]: Vector): boolean =>
  lightness! > LIGHTNESS_THRESHOLD_HIGH && chroma! < CHROMA_THRESHOLD_LOW

/**
 * Finds light colors in the theme palette. Light colors are defined as having
 * lightness above 0.8 and chroma below 0.1.
 *
 * @param {Vector[]} themePalette - Array of color vectors in OKLCH format.
 * @returns {Vector[]} Array of light colors from the palette.
 */
let findLightColors = (themePalette: Vector[]): Vector[] =>
  themePalette.filter(
    ([colorLightness, colorChroma]) =>
      colorLightness! > LIGHT_COLOR_LIGHTNESS_THRESHOLD &&
      colorChroma! < LIGHT_COLOR_CHROMA_THRESHOLD,
  )

/**
 * Finds achromatic colors in the theme palette. Uses isAchromatic function to
 * determine if a color is achromatic based on the provided configuration.
 *
 * @param {Vector[]} themePalette - Array of color vectors in OKLCH format.
 * @param {ColorMatchContext['config']} config - Configuration for color
 *   matching.
 * @returns {Vector[]} Array of achromatic colors from the palette.
 */
let findAchromaticColors = (
  themePalette: Vector[],
  config: ColorMatchContext['config'],
): Vector[] => themePalette.filter(color => isAchromatic(color, config))

/**
 * Filters palette colors for achromatic source colors.
 *
 * This function is specialized for achromatic colors and handles two cases:
 *
 * - Light colors (near white) - matches with other light colors
 * - Other achromatic colors (gray, black) - matches with other achromatic colors
 *
 * @param {ColorMatchContext} context - Context with source color, palette, and
 *   config.
 * @returns {Vector[]} Filtered palette colors that match achromatic properties.
 */
export let filterPaletteForAchromatic = (
  context: ColorMatchContext,
): Vector[] => {
  let { themePalette, sourceColor, config } = context
  let colorLogger = logger.withContext('ColorMatch')

  if (isLightAchromatic(sourceColor)) {
    let lightColors = findLightColors(themePalette)

    if (lightColors.length > 0) {
      colorLogger.info(
        `Found ${lightColors.length} light colors with low chroma`,
      )
      return lightColors
    }
  } else {
    let achromaticColors = findAchromaticColors(themePalette, config)

    if (achromaticColors.length > 0) {
      colorLogger.info(
        `Found ${achromaticColors.length} achromatic colors in palette`,
      )
      return achromaticColors
    }
  }

  return themePalette
}
