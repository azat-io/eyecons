import { serialize, OKLCH } from '@texel/color'

import type { Config } from '../../types/config'
import type { Theme } from '../../types/theme'

import { extractColorsFromSvg } from './extract-colors-from-svg'
import { replaceColorsInSvg } from './replace-colors-in-svg'
import { findClosestColor } from './find-closest-color'
import { getFolderColors } from './get-folder-colors'
import { logger } from '../../io/vscode/logger'
import { toOklch } from './to-oklch'

/** Parameters for adapting icon colors. */
interface AdaptIconColorsParameters {
  /** The SVG content of the icon. */
  svgContent: string

  /** The identifier of the icon. */
  id: string
}

/**
 * Adapts the colors in an SVG icon based on the current theme. This is a
 * placeholder that combines extraction and replacement steps.
 *
 * @param parameters - Parameters for the color adaptation.
 * @param theme - The current theme.
 * @param config - The extension configuration.
 * @returns The SVG content with adapted colors.
 */
export function adaptIconColors(
  parameters: AdaptIconColorsParameters,
  theme: Theme,
  config: Config,
): string {
  let { svgContent, id } = parameters
  let colorLogger = logger.withContext('IconColor')

  try {
    let colorInfos = extractColorsFromSvg(svgContent)
    let themeColors = theme.colors.map(toOklch)
    colorLogger.debug(`Found ${colorInfos.length} colors in icon`)

    if (colorInfos.length === 0) {
      return svgContent
    }

    if (id === 'folder' || id === 'folder-open') {
      let folderColors = getFolderColors(theme)
      return replaceColorsInSvg(svgContent, folderColors, colorInfos)
    }

    let colorMapping = new Map<string, string>()

    for (let { value } of colorInfos) {
      if (theme.overrides[id]?.[value]) {
        colorMapping.set(value, theme.overrides[id][value])
        continue
      }
      let oklchValue = toOklch(value)
      let closestColor = findClosestColor(oklchValue, themeColors, config)
      colorMapping.set(value, serialize(closestColor, OKLCH))
    }

    return replaceColorsInSvg(svgContent, colorMapping, colorInfos)
  } catch (error) {
    colorLogger.error(
      `Failed to adapt icon colors: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    return svgContent
  }
}
