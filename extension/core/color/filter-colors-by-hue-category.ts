import type { Vector } from '@texel/color'

import type { ColorComponents } from '../../types/color'

import { categorizeColorsByHue } from './categorize-colors-by-hue'
import { categorizeColorByHue } from './categorize-color-by-hue'
import { ADJACENT_CATEGORIES } from './constants'
import { logger } from '../../io/vscode/logger'

/**
 * Color threshold constants for different color families.
 */
const COLOR_THRESHOLDS = {
  YELLOW_GREEN_TARGET_MAX: 95,
  YELLOW_GREEN_HUE_MAX: 105,
  YELLOW_GREEN_HUE_MIN: 90,
  PURPLE_PINK_CHROMA: 0.05,
  RED_ORANGE_CHROMA: 0.05,
  PURPLE_TARGET_MIN: 255,
  PURPLE_TARGET_MAX: 345,
  RED_ORANGE_HUE_MAX: 50,
  RED_ORANGE_HUE_MIN: 0,
  BRIGHT_LIGHTNESS: 0.8,
  RED_ORANGE_WRAP: 345,
  YELLOW_CHROMA: 0.08,
  YELLOW_HUE_MAX: 110,
  PURPLE_HUE_MIN: 270,
  PURPLE_HUE_MAX: 330,
  BRIGHT_HUE_DIFF: 20,
  YELLOW_HUE_MIN: 40,
  BRIGHT_CHROMA: 0.1,
  PINK_HUE_MIN: 350,
  PINK_HUE_MAX: 30,
} as const

/**
 * Function type for filtering colors.
 */
type ColorFilter = (color: Vector) => boolean

/**
 * Filters colors by hue category, with fallback to adjacent categories.
 *
 * This function implements a three-tier fallback strategy:
 *
 * 1. First tries to find colors in the same hue category.
 * 2. If none found, looks in adjacent categories (e.g., blue→cyan, blue→purple).
 * 3. If still no matches, uses all available chromatic colors.
 *
 * @param sourceColor - The source color to match (OKLCH vector).
 * @param chromaticColors - Available chromatic colors (array of OKLCH vectors).
 * @returns Colors with similar hue to the source.
 */
export function filterColorsByHueCategory(
  sourceColor: Vector,
  chromaticColors: Vector[],
): Vector[] {
  let [lightness, chroma, hue] = sourceColor as [number, number, number]
  let colorLogger = logger.withContext('ColorMatch')

  let colorMatchers: {
    matcher: ColorFilter
    condition: boolean
    family: string
  }[] = [
    {
      condition:
        chroma > COLOR_THRESHOLDS.YELLOW_CHROMA &&
        hue >= COLOR_THRESHOLDS.YELLOW_HUE_MIN &&
        hue <= COLOR_THRESHOLDS.YELLOW_HUE_MAX,
      matcher: createColorMatcher(sourceColor, isInYellowFamily),
      family: 'yellow family',
    },
    {
      condition:
        chroma > COLOR_THRESHOLDS.PURPLE_PINK_CHROMA &&
        ((hue >= COLOR_THRESHOLDS.PURPLE_HUE_MIN &&
          hue <= COLOR_THRESHOLDS.PURPLE_HUE_MAX) ||
          hue >= COLOR_THRESHOLDS.PINK_HUE_MIN ||
          hue <= COLOR_THRESHOLDS.PINK_HUE_MAX),
      matcher: createColorMatcher(sourceColor, isInPurplePinkFamily),
      family: 'purple-pink family',
    },
    {
      condition:
        chroma > COLOR_THRESHOLDS.RED_ORANGE_CHROMA &&
        ((hue >= COLOR_THRESHOLDS.RED_ORANGE_HUE_MIN &&
          hue <= COLOR_THRESHOLDS.RED_ORANGE_HUE_MAX) ||
          hue >= COLOR_THRESHOLDS.RED_ORANGE_WRAP),
      matcher: createColorMatcher(sourceColor, (_, color) =>
        isInRedOrangeFamily(color),
      ),
      family: 'red-orange family',
    },
    {
      condition:
        lightness > COLOR_THRESHOLDS.BRIGHT_LIGHTNESS &&
        chroma > COLOR_THRESHOLDS.BRIGHT_CHROMA,
      matcher: createColorMatcher(sourceColor, isBrightColor),
      family: 'bright chromatic source',
    },
  ]

  for (let { condition, matcher, family } of colorMatchers) {
    if (condition) {
      let matches = chromaticColors.filter(matcher)
      if (matches.length > 0) {
        colorLogger.info(`Found ${matches.length} colors in ${family}`)
        return matches
      }
    }
  }

  let sourceCategory = categorizeColorByHue(hue)
  let categorizedColors = categorizeColorsByHue(chromaticColors)
  let similarHueColors = categorizedColors[sourceCategory] ?? []

  let adjacentCategories = ADJACENT_CATEGORIES[sourceCategory] ?? []
  for (let adjacentCategory of adjacentCategories) {
    if (categorizedColors[adjacentCategory]) {
      similarHueColors = [
        ...similarHueColors,
        ...categorizedColors[adjacentCategory],
      ]
    }
  }

  if (similarHueColors.length === 0) {
    colorLogger.info(
      'No colors in similar hue category, using all chromatic colors',
    )
    return chromaticColors
  }

  colorLogger.info(
    `Refined to ${similarHueColors.length} colors with similar hue category`,
  )

  return similarHueColors
}

/**
 * Checks if a color belongs to the yellow family based on source and target
 * colors.
 *
 * @param source - Source color parameters.
 * @param color - Target color parameters to check.
 * @returns True if the color belongs to yellow family.
 */
function isInYellowFamily(
  source: ColorComponents,
  color: ColorComponents,
): boolean {
  if (
    source.hue >= COLOR_THRESHOLDS.YELLOW_GREEN_HUE_MIN &&
    source.hue <= COLOR_THRESHOLDS.YELLOW_GREEN_HUE_MAX
  ) {
    return (
      color.hue >= COLOR_THRESHOLDS.YELLOW_HUE_MIN &&
      color.hue <= COLOR_THRESHOLDS.YELLOW_GREEN_TARGET_MAX &&
      color.chroma > COLOR_THRESHOLDS.YELLOW_CHROMA
    )
  }
  return (
    color.hue >= COLOR_THRESHOLDS.YELLOW_HUE_MIN &&
    color.hue <= COLOR_THRESHOLDS.YELLOW_HUE_MAX &&
    color.chroma > COLOR_THRESHOLDS.YELLOW_CHROMA
  )
}

/**
 * Checks if a color belongs to the purple-pink family based on source and
 * target colors.
 *
 * @param source - Source color parameters.
 * @param color - Target color parameters to check.
 * @returns True if the color belongs to purple-pink family.
 */
function isInPurplePinkFamily(
  source: ColorComponents,
  color: ColorComponents,
): boolean {
  if (
    source.hue >= COLOR_THRESHOLDS.PURPLE_HUE_MIN &&
    source.hue <= COLOR_THRESHOLDS.PURPLE_HUE_MAX
  ) {
    return (
      color.hue >= COLOR_THRESHOLDS.PURPLE_TARGET_MIN &&
      color.hue <= COLOR_THRESHOLDS.PURPLE_TARGET_MAX &&
      color.chroma > COLOR_THRESHOLDS.PURPLE_PINK_CHROMA
    )
  }
  return (
    color.hue >= COLOR_THRESHOLDS.PURPLE_HUE_MIN ||
    color.hue >= COLOR_THRESHOLDS.PINK_HUE_MIN ||
    color.hue <= COLOR_THRESHOLDS.PINK_HUE_MAX
  )
}

/**
 * Creates a color matcher function based on source color and filter function.
 *
 * @param sourceColor - Source color vector in OKLCH format.
 * @param filterFunction
 *
 *   - Function to filter colors based on parameters.
 *
 * @returns Function that takes a color vector and returns boolean.
 */
function createColorMatcher(
  sourceColor: Vector,
  filterFunction: (source: ColorComponents, color: ColorComponents) => boolean,
): ColorFilter {
  let [sourceLightness, sourceChroma, sourceHue] = sourceColor as [
    number,
    number,
    number,
  ]
  let source = {
    lightness: sourceLightness,
    chroma: sourceChroma,
    hue: sourceHue,
  }

  return (color: Vector) => {
    let [lightness, chroma, hue] = color as [number, number, number]
    return filterFunction(source, { lightness, chroma, hue })
  }
}

/**
 * Checks if a color is bright based on source and target colors.
 *
 * @param source - Source color parameters.
 * @param color - Target color parameters to check.
 * @returns True if the color is considered bright.
 */
function isBrightColor(
  source: ColorComponents,
  color: ColorComponents,
): boolean {
  let hueDiff = Math.abs(source.hue - color.hue)
  let normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff)
  return (
    normalizedHueDiff < COLOR_THRESHOLDS.BRIGHT_HUE_DIFF &&
    color.chroma > COLOR_THRESHOLDS.BRIGHT_CHROMA &&
    color.lightness > COLOR_THRESHOLDS.BRIGHT_LIGHTNESS
  )
}

/**
 * Checks if a color belongs to the red-orange family.
 *
 * @param color - Color parameters to check.
 * @returns True if the color belongs to red-orange family.
 */
function isInRedOrangeFamily(color: ColorComponents): boolean {
  return (
    ((color.hue >= COLOR_THRESHOLDS.RED_ORANGE_HUE_MIN &&
      color.hue <= COLOR_THRESHOLDS.RED_ORANGE_HUE_MAX) ||
      color.hue >= COLOR_THRESHOLDS.RED_ORANGE_WRAP) &&
    color.chroma > COLOR_THRESHOLDS.RED_ORANGE_CHROMA
  )
}
