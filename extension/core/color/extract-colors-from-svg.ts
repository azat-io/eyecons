import {
  ATTRIBUTES_PATTERNS,
  CSS_PROPERTY_REGEX,
  NAMED_COLOR_REGEX,
  COLOR_ATTRIBUTES,
  STYLE_REGEX,
  HEX_REGEX,
  HSL_REGEX,
  RGB_REGEX,
} from './constants'

/**
 * Information about a color found in an SVG.
 */
export interface ColorInfo {
  /**
   * The source type of the color (attribute, CSS property, inline).
   */
  source: 'attribute' | 'inline' | 'css'

  /**
   * The attribute or property name (if applicable).
   */
  property?: string

  /**
   * The original color value as string.
   */
  value: string
}

/**
 * Color data needed to create a ColorInfo object.
 */
interface ColorData {
  /**
   * The source of the color.
   */
  source: 'attribute' | 'inline' | 'css'

  /**
   * The property name (if applicable).
   */
  property?: string

  /**
   * The color value.
   */
  value: string
}

/**
 * Extracts all color values from an SVG string. Searches for colors in common
 * SVG attributes like fill, stroke, and stop-color, as well as in CSS style
 * blocks.
 *
 * @example
 *
 * ```ts
 * const svgString =
 *   '<svg><rect fill="#ff0000" /><circle stroke="rgb(0,0,255)" /></svg>'
 * const colors = extractColorsFromSvg(svgString)
 * // Returns array of ColorInfo objects with information about found colors
 * ```
 *
 * @param svgContent - The SVG content as a string.
 * @returns Array of unique ColorInfo objects found in the SVG.
 */
export function extractColorsFromSvg(svgContent: string): ColorInfo[] {
  let colorMap = new Map<string, ColorInfo>()

  extractColorsFromAttributes(svgContent, colorMap)
  extractColorsFromStyleBlocks(svgContent, colorMap)
  extractInlineColors(svgContent, colorMap)

  return [...colorMap.values()]
}

/**
 * Extracts colors from inline occurrences of color formats.
 *
 * @param svgContent - The SVG content as a string.
 * @param colorMap - The map to store colors in.
 */
function extractInlineColors(
  svgContent: string,
  colorMap: Map<string, ColorInfo>,
): void {
  function extractFromRegex(regex: RegExp): void {
    let match
    regex.lastIndex = 0

    while ((match = regex.exec(svgContent)) !== null) {
      let [colorValue] = match
      if (!colorMap.has(colorValue)) {
        addColorToMap(colorMap, {
          value: colorValue,
          source: 'inline',
        })
      }
    }
  }

  extractFromRegex(HEX_REGEX)
  extractFromRegex(RGB_REGEX)
  extractFromRegex(HSL_REGEX)

  let namedMatch
  NAMED_COLOR_REGEX.lastIndex = 0

  while ((namedMatch = NAMED_COLOR_REGEX.exec(svgContent)) !== null) {
    let colorName = namedMatch.groups?.['color']
    if (colorName) {
      let lowerColorName = colorName.toLowerCase()
      if (!colorMap.has(lowerColorName)) {
        addColorToMap(colorMap, {
          value: lowerColorName,
          source: 'inline',
        })
      }
    }
  }
}

/**
 * Extracts colors from CSS properties.
 *
 * @param styleContent - The CSS content as a string.
 * @param colorMap - The map to store colors in.
 */
function extractColorsFromCssProperties(
  styleContent: string,
  colorMap: Map<string, ColorInfo>,
): void {
  let cssMatch
  CSS_PROPERTY_REGEX.lastIndex = 0

  while ((cssMatch = CSS_PROPERTY_REGEX.exec(styleContent)) !== null) {
    let value = cssMatch.groups?.['value']
    if (!value || value === 'none' || value === 'transparent') {
      continue
    }

    let propertyMatch = cssMatch[0].match(/(?<propertyName>[^:]+):/u)
    let property = propertyMatch?.groups?.['propertyName']?.trim()

    if (property) {
      addColorToMap(colorMap, {
        source: 'css',
        property,
        value,
      })
    }
  }
}

/**
 * Extracts colors from SVG attributes like fill, stroke, and stop-color.
 *
 * @param svgContent - The SVG content as a string.
 * @param colorMap - The map to store colors in.
 */
function extractColorsFromAttributes(
  svgContent: string,
  colorMap: Map<string, ColorInfo>,
): void {
  for (let [i, pattern] of ATTRIBUTES_PATTERNS.entries()) {
    let attributeName = COLOR_ATTRIBUTES[i]
    let match

    pattern.lastIndex = 0
    while ((match = pattern.exec(svgContent)) !== null) {
      let value = match.groups?.['value']
      if (!value || value === 'none' || value === 'transparent') {
        continue
      }

      addColorToMap(colorMap, {
        property: attributeName,
        source: 'attribute',
        value,
      })
    }
  }
}

/**
 * Extracts colors from CSS style blocks.
 *
 * @param svgContent - The SVG content as a string.
 * @param colorMap - The map to store colors in.
 */
function extractColorsFromStyleBlocks(
  svgContent: string,
  colorMap: Map<string, ColorInfo>,
): void {
  let styleMatch
  STYLE_REGEX.lastIndex = 0

  while ((styleMatch = STYLE_REGEX.exec(svgContent)) !== null) {
    let styleContent = styleMatch.groups?.['style']
    if (!styleContent) {
      continue
    }

    extractColorsFromCssProperties(styleContent, colorMap)
  }
}

/**
 * Adds a color to the color map if it's valid.
 *
 * @param colorMap - The map to store colors in.
 * @param colorData - The color data to add to the map if valid.
 */
function addColorToMap(
  colorMap: Map<string, ColorInfo>,
  colorData: ColorData,
): void {
  let trimmedValue = colorData.value.trim()

  colorMap.set(trimmedValue, {
    property: colorData.property,
    source: colorData.source,
    value: trimmedValue,
  })
}
