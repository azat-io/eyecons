import type { Vector } from '@texel/color'

import type { Config } from './config'

/** Color matching context for palette filtering operations. */
export interface ColorMatchContext {
  /** Whether the source color is achromatic. */
  sourceAchromatic: boolean

  /** Available colors from theme palette. */
  themePalette: Vector[]

  /** Source color to be matched. */
  sourceColor: Vector

  /** Application configuration. */
  config: Config
}

/** Components of a color in OKLCH color space. */
export interface ColorComponents {
  /** Lightness component (L). */
  lightness: number

  /** Chroma/saturation component (C). */
  chroma: number

  /** Hue component (H). */
  hue: number
}
