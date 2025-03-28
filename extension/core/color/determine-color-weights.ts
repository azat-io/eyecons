import type { Vector } from '@texel/color'

import type { ColorComponents } from '../../types/color'

import { COLOR_THRESHOLDS, COLOR_WEIGHTS } from './constants'

/**
 * Determines which weight set to use based on the color properties.
 *
 * The weight selection is key to how colors are matched:
 *
 * - Achromatic colors prioritize lightness matching
 * - Highly saturated colors prioritize hue matching with some attention to chroma
 * - Colors with low saturation (but not achromatic) balance lightness and hue
 * - Medium saturation colors prioritize hue with balanced lightness and chroma
 *
 * @param {Vector} color - The OKLCH color to analyze.
 * @param {boolean} isColorAchromatic - Whether the color is achromatic.
 * @returns {ColorComponents} The appropriate weights for the color.
 */
export let determineColorWeights = (
  color: Vector,
  isColorAchromatic: boolean,
): ColorComponents => {
  if (isColorAchromatic) {
    return COLOR_WEIGHTS.ACHROMATIC
  }

  let [lightness, chroma, hue] = color as [number, number, number]

  if (lightness > 0.8 && chroma > 0.1) {
    return COLOR_WEIGHTS.BRIGHT_CHROMATIC
  }

  if (
    chroma > 0.07 &&
    ((hue >= 270 && hue <= 330) || hue >= 350 || hue <= 20)
  ) {
    return COLOR_WEIGHTS.PURPLE_PINK_FAMILY
  }

  if (chroma > 0.08 && hue >= 40 && hue <= 110) {
    return COLOR_WEIGHTS.YELLOW_FAMILY
  }

  if (chroma > COLOR_THRESHOLDS.HIGH_SATURATION) {
    return COLOR_WEIGHTS.HIGH_SATURATION
  }

  if (chroma < COLOR_THRESHOLDS.MEDIUM_SATURATION) {
    return COLOR_WEIGHTS.LOW_SATURATION
  }

  return COLOR_WEIGHTS.CHROMATIC
}
