import type { Vector } from '@texel/color'

import { hexToRGB as hexToRgb, convert, OKLCH, OKHSL, sRGB } from '@texel/color'

import { NAMED_COLORS, HSL_REGEX, RGB_REGEX } from './constants'
import { logger } from '../../io/vscode/logger'

/** Interface for named groups in HSL regular expression. */
interface HSLRegexGroups {
  /** Optional alpha transparency value (0-1). */
  a?: string

  /** Hue value in degrees (0-360). */
  h: string

  /** Saturation value in percentage (0-100%). */
  s: string

  /** Lightness value in percentage (0-100%). */
  l: string
}

/** Interface for named groups in RGB regular expression. */
interface RGBRegexGroups {
  /** Optional alpha transparency value (0-1). */
  a?: string

  /** Red color component (0-255). */
  r: string

  /** Green color component (0-255). */
  g: string

  /** Blue color component (0-255). */
  b: string
}

/** A matcher that checks if a color value matches a specific format. */
interface ColorMatcher {
  /** Predicate to check if the value matches this handler. */
  predicate(value: string): boolean
  /** Handler function to process matching values. */
  handler: ColorHandler
}

/** A color handler function that takes a color value and returns RGB values. */
type ColorHandler = (value: string) => Vector

/**
 * Parses an HSL or HSLA color string into HSL components.
 *
 * @param hslString - The HSL(A) color string.
 * @returns HSL values.
 * @throws {Error} If parsing fails.
 */
function parseHsl(hslString: string): Vector {
  HSL_REGEX.lastIndex = 0

  let match = HSL_REGEX.exec(hslString)
  if (!match?.groups) {
    throw new Error(`Failed to parse HSL string: "${hslString}"`)
  }

  let {
    s: saturation,
    l: lightness,
    h: hue,
  } = match.groups as unknown as HSLRegexGroups

  return [
    Number.parseInt(hue, 10),
    Number.parseInt(saturation, 10),
    Number.parseInt(lightness, 10),
  ]
}

/**
 * Parses an RGB or RGBA color string into RGB components.
 *
 * @param rgbString - The RGB(A) color string.
 * @returns RGB values in the range 0-1.
 * @throws {Error} If parsing fails.
 */
function parseRgb(rgbString: string): Vector {
  RGB_REGEX.lastIndex = 0

  let match = RGB_REGEX.exec(rgbString)
  if (!match?.groups) {
    throw new Error(`Failed to parse RGB string: "${rgbString}"`)
  }

  let { g: green, b: blue, r: red } = match.groups as unknown as RGBRegexGroups

  return [red, green, blue].map(value => Number.parseInt(value, 10) / 255)
}

/**
 * Converts a named color to RGB array.
 *
 * @param colorName - The name of the color to convert.
 * @returns RGB values in the range 0-1.
 * @throws {Error} If the color name is not recognized.
 */
function namedColorToRgb(colorName: string): Vector {
  let vector = NAMED_COLORS.get(colorName.toLowerCase())

  if (!vector) {
    throw new Error(`Color "${colorName}" is not recognized.`)
  }

  let [red, green, blue] = vector
  return [red! / 255, green! / 255, blue! / 255]
}

/**
 * Converts HSL values to RGB.
 *
 * @param input - The color in HSL format as [H, S, L].
 * @returns RGB values in the range 0-1.
 */
function hslToRgb(input: Vector): Vector {
  return convert(input, OKHSL, sRGB)
}

/**
 * Handles hex colors.
 *
 * @param colorValue - The hex color value to convert.
 * @returns RGB values.
 * @throws {Error} If parsing fails.
 */
let handleHex: ColorHandler = (colorValue: string): Vector =>
  hexToRgb(colorValue)

/**
 * Handles RGB colors.
 *
 * @param colorValue - The RGB color value to convert.
 * @returns RGB values.
 * @throws {Error} If parsing fails.
 */
let handleRgb: ColorHandler = (colorValue: string): Vector =>
  parseRgb(colorValue)

/**
 * Handles HSL colors.
 *
 * @param colorValue - The HSL color value to convert.
 * @returns RGB values.
 * @throws {Error} If parsing fails.
 */
let handleHsl: ColorHandler = (colorValue: string): Vector =>
  hslToRgb(parseHsl(colorValue))

/**
 * Handles named colors.
 *
 * @param colorValue - The named color to convert.
 * @returns RGB values.
 * @throws {Error} If the color is not recognized.
 */
let handleNamedColor: ColorHandler = (colorValue: string): Vector =>
  namedColorToRgb(colorValue)

/** List of matchers for different color formats, in order of priority. */
let colorMatchers: ColorMatcher[] = [
  {
    predicate: (value: string) => value.startsWith('#'),
    handler: handleHex,
  },
  {
    predicate: (value: string) => value.startsWith('rgb'),
    handler: handleRgb,
  },
  {
    predicate: (value: string) => value.startsWith('hsl'),
    handler: handleHsl,
  },
  {
    handler: handleNamedColor,
    predicate: () => true,
  },
]

/**
 * Converts a color value from any supported format to OKLCH format. Supported
 * formats: hex, rgb, rgba, hsl, hsla, and named colors.
 *
 * @param colorValue - The color value as a string in any supported format.
 * @returns The color in OKLCH format as [Lightness, Chroma, Hue].
 * @throws {Error} If the color format is not recognized or parsing fails.
 */
export function toOklch(colorValue: string): Vector {
  let colorLogger = logger.withContext('Color')
  try {
    let rgbColor = parseColor(colorValue)
    return rgbToOklch(rgbColor)
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : String(error)
    colorLogger.error(`Failed to convert color: ${errorMessage}`)
    throw error
  }
}

/**
 * Determines the color type and routes to the appropriate handler.
 *
 * @param colorValue - The color value as a string.
 * @returns RGB values.
 * @throws {Error} If the color format is not recognized or parsing fails.
 */
function parseColor(colorValue: string): Vector {
  let preparedValue = colorValue.trim()

  let matcher = colorMatchers.find(colorMatcher =>
    colorMatcher.predicate(preparedValue),
  )!

  return matcher.handler(preparedValue)
}

/**
 * Converts RGB values to OKLCH format.
 *
 * @param rgb - The RGB values to convert.
 * @returns OKLCH values.
 */
function rgbToOklch(rgb: Vector): Vector {
  return convert(rgb, sRGB, OKLCH)
}
