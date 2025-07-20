import type { Vector } from '@texel/color'

import type { Config } from '../../types/config'

/**
 * Adjusts saturation of a color to improve contrast if needed.
 *
 * @param {Vector} color - The OKLCH color to adjust.
 * @param {Config} config - The configuration with adjustment parameters.
 * @returns {Vector} The adjusted OKLCH color.
 */
export function adjustSaturation(color: Vector, config: Config): Vector {
  if (!config.processing.adjustContrast) {
    return color
  }

  let [lightness, chroma, hue] = color as [number, number, number]
  let { lowSaturationThreshold, saturationFactor } = config.processing

  if (chroma > 0.01 && chroma < lowSaturationThreshold) {
    let adjustedChroma = Math.min(chroma * saturationFactor, 0.4)
    return [lightness, adjustedChroma, hue]
  }

  return color
}
