import { COLOR_CATEGORIES } from './constants'

/**
 * Categorizes a color based on its hue value.
 *
 * @param {number} hue - The hue value in degrees (0-360).
 * @returns {string} The category name ('red', 'blue', etc.).
 */
export let categorizeColorByHue = (hue: number): string => {
  let normalizedHue = ((hue % 360) + 360) % 360

  for (let category of Object.values(COLOR_CATEGORIES)) {
    if (category.minHue > category.maxHue) {
      if (normalizedHue >= category.minHue || normalizedHue < category.maxHue) {
        return category.name
      }
    } else if (
      normalizedHue >= category.minHue &&
      normalizedHue < category.maxHue
    ) {
      return category.name
    }
  }

  return COLOR_CATEGORIES.RED.name
}
