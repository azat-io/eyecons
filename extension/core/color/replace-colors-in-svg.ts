import type { ColorInfo } from './extract-colors-from-svg'

/**
 * Replaces colors in SVG string with new colors based on provided mapping.
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
  let result = svgContent

  for (let colorInfo of colorInfos) {
    let newColor = colorMapping.get(colorInfo.value)
    if (!newColor) {
      continue
    }

    let escapedColor = colorInfo.value.replaceAll(
      /[$()*+.?[\\\]^{|}]/gu,
      String.raw`\$&`,
    )
    let regex = new RegExp(escapedColor, 'g')

    result = result.replace(regex, newColor)
  }

  return result
}
