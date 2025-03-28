import type { Vector } from '@texel/color'

import type { ColorMatchContext } from '../../types/color'

import { logger } from '../../io/vscode/logger'
import { isAchromatic } from './is-achromatic'

/**
 * Filters palette colors for chromatic source colors.
 *
 * For chromatic colors, this function filters out achromatic colors to prevent
 * matching colored icons to grayscale colors. This is essential for maintaining
 * the visual distinction between colored and monochrome elements.
 *
 * @param {ColorMatchContext} context - Context with source color, palette, and
 *   config.
 * @returns {Vector[]} Filtered palette colors containing only chromatic colors
 *   if available.
 */
export let filterPaletteForChromatic = (
  context: ColorMatchContext,
): Vector[] => {
  let { themePalette, config } = context
  let colorLogger = logger.withContext('ColorMatch')

  let chromaticColors = themePalette.filter(
    color => !isAchromatic(color, config),
  )

  if (chromaticColors.length > 0) {
    colorLogger.info(
      `Found ${chromaticColors.length} chromatic colors for chromatic source`,
    )
    return chromaticColors
  }

  colorLogger.warn('No chromatic colors in palette, using full palette')
  return themePalette
}
