import type { Vector } from '@texel/color'

import type { ColorComponents } from '../../types/color'
import type { Config } from '../../types/config'

/** Minimum chroma value to consider color non-achromatic. */
const MIN_CHROMA = 0.01

/** Minimum chroma value for high-saturation color. */
const HIGH_CHROMA_THRESHOLD = 0.1

/** Medium chroma threshold for hue penalty. */
const MEDIUM_CHROMA_THRESHOLD = 0.05

/** Base chroma penalty multiplier for near-achromatic colors. */
const BASE_CHROMA_PENALTY = 3.5

/** Enhanced chroma penalty multiplier for low saturation. */
const ENHANCED_CHROMA_PENALTY = 5

/** Hue penalty multiplier for saturated colors. */
const HUE_PENALTY_MULTIPLIER = 10

/** Angle to normalize hue differences (half circle). */
const HUE_NORMALIZATION_ANGLE = 180

/** Threshold for moderate hue difference. */
const MODERATE_HUE_DIFFERENCE = 30

/** Threshold for large hue difference. */
const LARGE_HUE_DIFFERENCE = 45

/** Threshold for very large hue difference. */
const VERY_LARGE_HUE_DIFFERENCE = 60

/** Multiplier for moderate hue differences. */
const MODERATE_HUE_MULTIPLIER = 1.8

/** Multiplier for large hue differences. */
const LARGE_HUE_MULTIPLIER = 2.5

/** Hue ranges for special handling. */
const HUE_RANGES = {
  YELLOW_GREEN: { MAX: 110, MIN: 40 },
  RED_PURPLE: { MIN: 270, MAX: 330 },
  COMPLEMENTARY: { MAX: 30, MIN: 0 },
  RED_START: { MAX: 20, MIN: 0 },
  YELLOW: { MAX: 105, MIN: 90 },
  RED: { MIN: 350, MAX: 360 },
  WARM: { MAX: 50, MIN: 0 },
} as const

/** Hue difference power values. */
const HUE_POWERS = {
  YELLOW_GREEN: 1.6,
  COMPLEMENTARY: 2,
  RED_PURPLE: 1.7,
  YELLOW_FAR: 1.9,
  NORMAL: 1.2,
  YELLOW: 1.5,
  LARGE: 1.5,
} as const

/** Hue multipliers for different ranges. */
const HUE_MULTIPLIERS = {
  COMPLEMENTARY: 2.5,
  YELLOW_GREEN: 1.2,
  YELLOW_NEAR: 1.8,
  RED_PURPLE: 1.4,
  YELLOW_FAR: 2.2,
  NORMAL: 1,
  WARM: 1.2,
} as const

/** Parameters for calculating weighted distance between colors. */
interface DistanceParameters {
  /** The weights for each component. */
  weights: ColorComponents

  /** First OKLCH color as [L, C, H]. */
  color1: Vector

  /** Second OKLCH color as [L, C, H]. */
  color2: Vector

  /** Configuration with thresholds. */
  config: Config
}

/**
 * Calculates weighted distance between two OKLCH colors with different weights
 * for each component.
 *
 * The distance calculation takes into account:
 *
 * 1. Lightness differences (L component)
 * 2. Chroma/saturation differences (C component)
 * 3. Hue differences (H component) - only considered when both colors have
 *    sufficient chroma
 * 4. A special penalty for comparing chromatic colors to near-achromatic colors.
 *
 * @param parameters - Parameters for distance calculation.
 * @returns The weighted distance between the colors.
 */
export function calculateWeightedDistance(
  parameters: DistanceParameters,
): number {
  let { weights, color1, color2, config } = parameters
  let [l1, c1, h1] = color1 as [number, number, number]
  let [l2, c2, h2] = color2 as [number, number, number]

  let components1 = { lightness: l1, chroma: c1, hue: h1 }
  let components2 = { lightness: l2, chroma: c2, hue: h2 }

  let { lightnessDiff, chromaDiff } = calculateBasicDifferences(
    components1,
    components2,
    weights,
  )

  let hueDiff = calculateHueDifference(components1, components2, weights)
  let chromaPenalty = calculateChromaPenalty(components1, components2, config)

  return Math.sqrt(lightnessDiff + chromaDiff + hueDiff + chromaPenalty)
}

/**
 * Determines the multiplier for hue difference based on specific hue ranges.
 * Applies special handling for yellows, yellow-greens, red-purples, and warm
 * colors.
 *
 * @param hue1 - Hue value of the first color in degrees.
 * @param hue2 - Hue value of the second color in degrees.
 * @returns Multiplier for hue difference calculation.
 */
function getHueMultiplier(hue1: number, hue2: number): number {
  if (hue1 >= HUE_RANGES.YELLOW.MIN && hue1 <= HUE_RANGES.YELLOW.MAX) {
    if (hue2 > HUE_RANGES.YELLOW.MAX) {
      return HUE_MULTIPLIERS.YELLOW_FAR
    }
    if (hue2 < HUE_RANGES.YELLOW_GREEN.MIN) {
      return HUE_MULTIPLIERS.YELLOW_NEAR
    }
    return HUE_MULTIPLIERS.NORMAL
  }

  if (
    hue1 >= HUE_RANGES.YELLOW_GREEN.MIN &&
    hue1 <= HUE_RANGES.YELLOW_GREEN.MAX
  ) {
    return HUE_MULTIPLIERS.YELLOW_GREEN
  }

  let isRedPurple =
    (hue1 >= HUE_RANGES.RED_PURPLE.MIN && hue1 <= HUE_RANGES.RED_PURPLE.MAX) ||
    hue1 >= HUE_RANGES.RED.MIN ||
    hue1 <= HUE_RANGES.RED_START.MAX

  if (isRedPurple) {
    let isComplementary =
      (hue1 >= HUE_RANGES.RED_PURPLE.MIN &&
        hue1 <= HUE_RANGES.RED_PURPLE.MAX &&
        ((hue2 >= HUE_RANGES.COMPLEMENTARY.MIN &&
          hue2 <= HUE_RANGES.COMPLEMENTARY.MAX) ||
          hue2 >= HUE_RANGES.RED.MIN)) ||
      ((hue1 >= HUE_RANGES.RED.MIN || hue1 <= HUE_RANGES.RED_START.MAX) &&
        hue2 >= HUE_RANGES.RED_PURPLE.MIN &&
        hue2 <= HUE_RANGES.RED_PURPLE.MAX)

    return isComplementary
      ? HUE_MULTIPLIERS.COMPLEMENTARY
      : HUE_MULTIPLIERS.RED_PURPLE
  }

  if (hue1 >= HUE_RANGES.WARM.MIN && hue1 <= HUE_RANGES.WARM.MAX) {
    return HUE_MULTIPLIERS.WARM
  }

  return HUE_MULTIPLIERS.NORMAL
}

/**
 * Calculates penalty for differences in chroma between colors, with special
 * handling for near-achromatic colors and large hue differences in saturated
 * colors.
 *
 * @param color1 - First color components.
 * @param color2 - Second color components.
 * @param config - Configuration with thresholds.
 * @returns Combined chroma penalty.
 */
function calculateChromaPenalty(
  color1: ColorComponents,
  color2: ColorComponents,
  config: Config,
): number {
  let { lowSaturationThreshold } = config.processing
  let penalty = 0

  if (color2.chroma <= MIN_CHROMA && color1.chroma > lowSaturationThreshold) {
    penalty = (color1.chroma - color2.chroma) * BASE_CHROMA_PENALTY
  } else if (
    color1.chroma <= MIN_CHROMA &&
    color2.chroma > lowSaturationThreshold
  ) {
    penalty = (color2.chroma - color1.chroma) * BASE_CHROMA_PENALTY
  } else if (
    color2.chroma <= lowSaturationThreshold &&
    color1.chroma > lowSaturationThreshold
  ) {
    penalty = (color1.chroma - color2.chroma) * ENHANCED_CHROMA_PENALTY
  } else if (
    color1.chroma <= lowSaturationThreshold &&
    color2.chroma > lowSaturationThreshold
  ) {
    penalty = (color2.chroma - color1.chroma) * ENHANCED_CHROMA_PENALTY
  }

  if (
    color1.chroma > HIGH_CHROMA_THRESHOLD &&
    color2.chroma > MEDIUM_CHROMA_THRESHOLD
  ) {
    let normalizedHueDiff = normalizeHueDifference(color1.hue, color2.hue)
    if (normalizedHueDiff > LARGE_HUE_DIFFERENCE) {
      penalty +=
        (normalizedHueDiff / HUE_NORMALIZATION_ANGLE) *
        Math.max(color1.chroma, color2.chroma) *
        HUE_PENALTY_MULTIPLIER
    }
  }

  return penalty
}

/**
 * Calculates the weighted difference in hue between two colors, taking into
 * account their chroma values and applying various multipliers based on hue
 * ranges.
 *
 * @param color1 - First color components.
 * @param color2 - Second color components.
 * @param weights - Weights for each component.
 * @returns Weighted hue difference.
 */
function calculateHueDifference(
  color1: ColorComponents,
  color2: ColorComponents,
  weights: ColorComponents,
): number {
  if (color1.chroma <= MIN_CHROMA || color2.chroma <= MIN_CHROMA) {
    return 0
  }

  let normalizedDifference = normalizeHueDifference(color1.hue, color2.hue)
  let huePower = getHuePower(normalizedDifference)
  let multiplier = getHueMultiplier(color1.hue, color2.hue)

  let baseDifference =
    (normalizedDifference / HUE_NORMALIZATION_ANGLE) ** huePower *
    weights.hue *
    multiplier

  if (normalizedDifference > VERY_LARGE_HUE_DIFFERENCE) {
    return baseDifference * LARGE_HUE_MULTIPLIER
  }
  if (normalizedDifference > MODERATE_HUE_DIFFERENCE) {
    return baseDifference * MODERATE_HUE_MULTIPLIER
  }
  return baseDifference
}

/**
 * Calculates basic weighted differences in lightness and chroma between two
 * colors.
 *
 * @param color1 - First color components.
 * @param color2 - Second color components.
 * @param weights - Weights for each component.
 * @returns Object containing weighted differences.
 */
function calculateBasicDifferences(
  color1: ColorComponents,
  color2: ColorComponents,
  weights: ColorComponents,
): { lightnessDiff: number; chromaDiff: number } {
  return {
    lightnessDiff:
      (color1.lightness - color2.lightness) ** 2 * weights.lightness,
    chromaDiff: (color1.chroma - color2.chroma) ** 2 * weights.chroma,
  }
}

/**
 * Normalizes the difference between two hue values to account for circular
 * nature of hue.
 *
 * @param hue1 - First hue value in degrees.
 * @param hue2 - Second hue value in degrees.
 * @returns Normalized difference between hues (0-180).
 */
function normalizeHueDifference(hue1: number, hue2: number): number {
  let rawDifference = Math.abs(hue1 - hue2)
  return Math.min(rawDifference, 360 - rawDifference)
}

/**
 * Determines the power for hue difference calculation based on the normalized
 * difference.
 *
 * @param normalizedDifference - Normalized difference between hues (0-180).
 * @returns Power to use in hue difference calculation.
 */
function getHuePower(normalizedDifference: number): number {
  return normalizedDifference > LARGE_HUE_DIFFERENCE
    ? HUE_POWERS.LARGE
    : HUE_POWERS.NORMAL
}
