import type { ColorInfo } from './extract-colors-from-svg'

/**
 * Replaces colors in SVG string with new colors based on provided mapping.
 *
 * All colors are replaced in a single pass so that a freshly written color can
 * never be matched again by a later source color. Sources are tried longest
 * first, so `#ffffff` wins over `#fff` when both are present.
 *
 * @param svgContent - The SVG content as a string.
 * @param colorMapping - Color mapping from original colors to new colors.
 * @param colorInfos - Color information extracted from SVG.
 * @returns SVG string with replaced colors.
 */
export function replaceColorsInSvg(
  svgContent: string,
  colorMapping: Map<string, string>,
  colorInfos: ColorInfo[],
): string {
  let colorValues = [...new Set(colorInfos.map(colorInfo => colorInfo.value))]
    .filter(colorValue => colorMapping.has(colorValue))
    .toSorted((left, right) => right.length - left.length)

  if (colorValues.length === 0) {
    return svgContent
  }

  let pattern = colorValues
    .map(colorValue => escapeForRegex(colorValue))
    .join('|')

  return svgContent.replace(new RegExp(pattern, 'gu'), match =>
    colorMapping.get(match)!,
  )
}

/**
 * Escapes characters that carry a special meaning inside a regular expression.
 *
 * @param value - The color value to escape.
 * @returns The escaped value.
 */
function escapeForRegex(value: string): string {
  return value.replaceAll(/[$()*+.?[\\\]^{|}]/gu, String.raw`\$&`)
}
