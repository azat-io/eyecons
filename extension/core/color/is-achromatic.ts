import type { Vector } from '@texel/color'

import type { Config } from '../../types/config'

/**
 * Determines if a color is achromatic (grayscale) based on its chroma and
 * config thresholds.
 *
 * A color is considered achromatic if:
 *
 * 1. It has very low saturation (chroma below lowSaturationThreshold)
 * 2. OR it has moderate saturation but extreme lightness (very dark or very
 *    light).
 *
 * This distinction is important because achromatic colors use different
 * distance weighting that prioritizes lightness over hue.
 *
 * @param color - The OKLCH color to check.
 * @param config - The configuration with threshold values.
 * @returns True if the color is considered achromatic.
 */
export function isAchromatic(color: Vector, config: Config): boolean {
  let [lightness, chroma] = color as [number, number, number]
  let { extremeLightnessThresholds, lowSaturationThreshold } = config.processing

  if (chroma > 0.1) {
    return false
  }

  if (chroma <= lowSaturationThreshold) {
    return true
  }

  if (lightness < extremeLightnessThresholds.dark) {
    return chroma < lowSaturationThreshold * 3
  }

  if (lightness > extremeLightnessThresholds.light) {
    return chroma < lowSaturationThreshold * 2
  }

  return false
}
