import type { Vector } from '@texel/color'

import type { ColorComponents } from '../../types/color'

import { logger } from '../../io/vscode/logger'
import { COLOR_THRESHOLDS } from './constants'

const REFINEMENT_THRESHOLDS = {
  BRIGHT_MEDIUM_SATURATION_MIN: 0.08,
  BRIGHT_MEDIUM_CHROMA_MIN: 0.05,
  BRIGHT_MEDIUM_LIGHTNESS: 0.7,
  BRIGHT_SATURATION_MIN: 0.09,
  PURPLE_CHROMA_MIN: 0.07,
  YELLOW_CHROMA_MIN: 0.08,
  BRIGHT_CHROMA_MIN: 0.1,
  MAX_HUE_DIFFERENCE: 30,
  BRIGHT_LIGHTNESS: 0.8,
  PURPLE_HUE_MIN: 270,
  PURPLE_HUE_MAX: 330,
  YELLOW_HUE_MAX: 110,
  YELLOW_HUE_MIN: 40,
} as const

interface ColorFilter {
  filter(color: Vector, sourceParameters: ColorComponents): boolean
  condition(parameters: ColorComponents): boolean
  name: string
}

/**
 * Extracts color parameters from a vector.
 *
 * @param color - Color vector in OKLCH format.
 * @returns Extracted color parameters.
 */
function getColorComponents(color: Vector): ColorComponents {
  let [lightness, chroma, hue] = color as [number, number, number]
  return { lightness, chroma, hue }
}

/**
 * Calculates normalized hue difference between two colors.
 *
 * @param hue1 - First hue value.
 * @param hue2 - Second hue value.
 * @returns Normalized hue difference.
 */
function getNormalizedHueDiff(hue1: number, hue2: number): number {
  let diff = Math.abs(hue1 - hue2)
  return Math.min(diff, 360 - diff)
}

/** Collection of color filters with their conditions and filtering logic. */
const COLOR_FILTERS: ColorFilter[] = [
  {
    filter: color => {
      let { chroma, hue } = getColorComponents(color)
      return (
        hue >= REFINEMENT_THRESHOLDS.PURPLE_HUE_MIN &&
        hue <= REFINEMENT_THRESHOLDS.PURPLE_HUE_MAX &&
        chroma > REFINEMENT_THRESHOLDS.PURPLE_CHROMA_MIN
      )
    },
    condition: ({ chroma, hue }) =>
      chroma > REFINEMENT_THRESHOLDS.PURPLE_CHROMA_MIN &&
      hue >= REFINEMENT_THRESHOLDS.PURPLE_HUE_MIN &&
      hue <= REFINEMENT_THRESHOLDS.PURPLE_HUE_MAX,
    name: 'pure purple/magenta',
  },
  {
    filter: (color, source) => {
      let { chroma, hue } = getColorComponents(color)
      return (
        chroma > REFINEMENT_THRESHOLDS.YELLOW_CHROMA_MIN &&
        getNormalizedHueDiff(hue, source.hue) <
          REFINEMENT_THRESHOLDS.MAX_HUE_DIFFERENCE
      )
    },
    condition: ({ chroma, hue }) =>
      chroma > REFINEMENT_THRESHOLDS.YELLOW_CHROMA_MIN &&
      hue >= REFINEMENT_THRESHOLDS.YELLOW_HUE_MIN &&
      hue <= REFINEMENT_THRESHOLDS.YELLOW_HUE_MAX,
    name: 'saturated yellow',
  },
  {
    filter: (color, source) => {
      let { chroma, hue } = getColorComponents(color)
      return (
        chroma > REFINEMENT_THRESHOLDS.BRIGHT_SATURATION_MIN &&
        getNormalizedHueDiff(hue, source.hue) <
          REFINEMENT_THRESHOLDS.MAX_HUE_DIFFERENCE
      )
    },
    condition: ({ lightness, chroma }) =>
      lightness > REFINEMENT_THRESHOLDS.BRIGHT_LIGHTNESS &&
      chroma > REFINEMENT_THRESHOLDS.BRIGHT_CHROMA_MIN,
    name: 'saturated colors with similar hue',
  },
  {
    filter: color => {
      let { chroma } = getColorComponents(color)
      return chroma > COLOR_THRESHOLDS.MEDIUM_SATURATION
    },
    condition: ({ chroma }) => chroma > COLOR_THRESHOLDS.HIGH_SATURATION,
    name: 'high-saturation',
  },
  {
    filter: color => {
      let { lightness, chroma } = getColorComponents(color)
      return (
        lightness > REFINEMENT_THRESHOLDS.BRIGHT_MEDIUM_LIGHTNESS &&
        chroma > REFINEMENT_THRESHOLDS.BRIGHT_MEDIUM_SATURATION_MIN
      )
    },
    condition: ({ lightness, chroma }) =>
      lightness > REFINEMENT_THRESHOLDS.BRIGHT_LIGHTNESS &&
      chroma > REFINEMENT_THRESHOLDS.BRIGHT_MEDIUM_CHROMA_MIN,
    name: 'bright, saturated',
  },
]

/**
 * Further filters colors based on saturation and lightness properties.
 *
 * After filtering by hue category, this function performs additional refinement
 * based on the source color's characteristics:
 *
 * - For highly saturated colors: prioritizes other highly saturated colors
 * - For bright saturated colors: prioritizes other bright colors.
 *
 * This ensures that vibrant colors match with other vibrant colors, and bright
 * colors match with other bright colors, preserving the visual quality and
 * impact of the original.
 *
 * @param sourceColor - The source color to match.
 * @param filteredPalette - Palette already filtered by hue.
 * @returns Further refined palette.
 */
export function refineColorsByProperties(
  sourceColor: Vector,
  filteredPalette: Vector[],
): Vector[] {
  if (filteredPalette.length <= 1) {
    return filteredPalette
  }

  let colorLogger = logger.withContext('ColorMatch')
  let sourceParameters = getColorComponents(sourceColor)

  for (let { condition, filter, name } of COLOR_FILTERS) {
    if (condition(sourceParameters)) {
      let refinedColors = filteredPalette.filter(color =>
        filter(color, sourceParameters),
      )

      if (refinedColors.length > 0) {
        colorLogger.info(
          `Further refined to ${refinedColors.length} ${name} colors`,
        )
        return refinedColors
      }
    }
  }

  return filteredPalette
}
