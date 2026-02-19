import type { Vector } from '@texel/color'

import { categorizeColorByHue } from './categorize-color-by-hue'

/**
 * Interface for categorized colors during matching process.
 */
type CategorizedColors = Record<string, Vector[]>

/**
 * Categorizes palette colors by hue for more accurate matching.
 *
 * Separates colors into nine categories based on hue values (red, orange,
 * yellow, etc.). This categorization enables more intuitive color matching that
 * aligns with human perception of color similarity. Colors with extremely low
 * saturation are excluded as their hue is not visually significant.
 *
 * @param chromaticColors - Array of chromatic colors to categorize.
 * @returns Dictionary of colors organized by hue category.
 */
export function categorizeColorsByHue(
  chromaticColors: Vector[],
): CategorizedColors {
  let colorCategories: CategorizedColors = {
    yellowGreen: [],
    magenta: [],
    orange: [],
    yellow: [],
    purple: [],
    green: [],
    cyan: [],
    blue: [],
    red: [],
  }

  for (let color of chromaticColors) {
    let [, colorChroma, colorHue] = color as [number, number, number]
    if (colorChroma < 0.03) {
      continue
    }

    let category = categorizeColorByHue(colorHue)
    colorCategories[category]?.push(color)
  }

  return colorCategories
}
