import type { Vector } from '@texel/color'

import { convert, OKLCH, sRGB } from '@texel/color'

/**
 * Converts an OKLCH color to a hexadecimal sRGB string.
 *
 * Adapted icons are written with hex colors rather than `oklch()`. Every color
 * the matcher can return comes from a theme palette, so it already fits inside
 * the sRGB gamut and the hex form is exact while being much shorter.
 *
 * @param color - The color in OKLCH format as [Lightness, Chroma, Hue].
 * @returns The color as a hexadecimal string, for example `#a7b2b5`.
 */
export function toHex(color: Vector): string {
  let channels = convert(color, OKLCH, sRGB).map(channel => {
    let byte = Math.round(Math.min(1, Math.max(0, channel)) * 255)
    return byte.toString(16).padStart(2, '0')
  })

  return `#${channels.join('')}`
}
