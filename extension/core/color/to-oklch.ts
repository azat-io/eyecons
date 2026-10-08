import type { Vector } from '@texel/color'

import { hexToRGB as hexToRgb, convert, OKLCH, sRGB } from '@texel/color'

import { NAMED_COLORS, HSL_REGEX, RGB_REGEX } from './constants'
import { logger } from '../../io/vscode/logger'

/**
 * A matcher that checks if a color value matches a specific format.
 */
interface ColorMatcher {
  /**
   * Predicate to check if the value matches this handler.
   */
  predicate(value: string): boolean
  /**
   * Handler function to process matching values.
   */
  handler: ColorHandler
}

/**
 * A color handler function that takes a color value and returns RGB values.
 */
type ColorHandler = (value: string) => Vector

/**
 * Number of degrees in one unit of each CSS angle unit.
 */
const DEGREES_PER_ANGLE_UNIT: Record<string, number> = {
  rad: 180 / Math.PI,
  grad: 0.9,
  turn: 360,
  deg: 1,
}

/**
 * Converts CSS HSL values to RGB with the algorithm of the CSS Color 4
 * specification.
 *
 * @param input - The color as [Hue in degrees, Saturation 0-1, Lightness 0-1].
 * @returns RGB values in the range 0-1.
 */
function hslToRgb([hue, saturation, lightness]: Vector): Vector {
  let amplitude = saturation! * Math.min(lightness!, 1 - lightness!)

  function toChannel(offset: number): number {
    let position = (offset + hue! / 30) % 12
    return (
      lightness! -
      amplitude * Math.max(-1, Math.min(position - 3, 9 - position, 1))
    )
  }

  return [toChannel(0), toChannel(8), toChannel(4)]
}

/**
 * Parses an HSL or HSLA color string into HSL components.
 *
 * @param hslString - The HSL(A) color string.
 * @returns HSL values as [Hue in degrees, Saturation 0-1, Lightness 0-1].
 * @throws {Error} If parsing fails.
 */
function parseHsl(hslString: string): Vector {
  HSL_REGEX.lastIndex = 0

  let match = HSL_REGEX.exec(hslString)
  if (!match?.groups) {
    throw new Error(`Failed to parse HSL string: "${hslString}"`)
  }

  let { s: saturation, l: lightness, h: hue } = match.groups

  return [
    parseHue(hue!),
    Number.parseFloat(saturation!) / 100,
    Number.parseFloat(lightness!) / 100,
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

  let { g: green, b: blue, r: red } = match.groups

  return [red!, green!, blue!].map(parseRgbChannel)
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
 * Parses a CSS hue into degrees.
 *
 * @param hue - The hue with an optional angle unit, for example `120`,
 *   `0.5turn` or `3.14rad`.
 * @returns The hue in degrees.
 */
function parseHue(hue: string): number {
  let unit = /[a-z]+$/u.exec(hue)?.[0] ?? 'deg'
  return Number.parseFloat(hue) * DEGREES_PER_ANGLE_UNIT[unit]!
}

/**
 * Parses a CSS RGB channel into the range 0-1.
 *
 * @param channel - The channel as a number from 0 to 255 or as a percentage,
 *   for example `255` or `100%`.
 * @returns The channel value in the range 0-1.
 */
function parseRgbChannel(channel: string): number {
  let scale = channel.endsWith('%') ? 100 : 255
  return Number.parseFloat(channel) / scale
}

/**
 * List of matchers for different color formats, in order of priority.
 */
let colorMatchers: ColorMatcher[] = [
  {
    predicate: (value: string) => value.startsWith('#'),
    handler: hexToRgb,
  },
  {
    predicate: (value: string) => value.startsWith('rgb'),
    handler: parseRgb,
  },
  {
    predicate: (value: string) => value.startsWith('hsl'),
    handler: (value: string) => hslToRgb(parseHsl(value)),
  },
  {
    handler: namedColorToRgb,
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
