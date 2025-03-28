import type { Vector } from '@texel/color'

export const HEX_REGEX =
  /#(?<hex>[\dA-Fa-f]{3,4}|[\dA-Fa-f]{6}(?:[\dA-Fa-f]{2})?)\b/gu

export const RGB_REGEX =
  /(?<rgb>rgba?\(\s*(?<r>\d+%?)\s*(?:,\s*|\s)(?<g>\d+%?)\s*(?:,\s*|\s)(?<b>\d+%?)(?:\s*(?:,|\/)\s*(?<a>0?\.\d+|[01]|\d{1,3}%))?\s*\))/gu

export const HSL_REGEX =
  /hsla?\(\s*(?<h>\d+(?:\.\d+)?(?:deg|grad|rad|turn)?)\s*(?:,\s*|\s)(?<s>\d+%)\s*(?:,\s*|\s)(?<l>\d+%)(?:\s*(?:,|\/)\s*(?<a>0?\.\d+|[01]|\d{1,3}%))?/gu

export const NAMED_COLORS = new Map<string, Vector>([
  ['lightgoldenrodyellow', [250, 250, 210]],
  ['mediumaquamarine', [102, 205, 170]],
  ['mediumslateblue', [123, 104, 238]],
  ['mediumspringgreen', [0, 250, 154]],
  ['blanchedalmond', [255, 235, 205]],
  ['cornflowerblue', [100, 149, 237]],
  ['lightslategray', [119, 136, 153]],
  ['lightslategrey', [119, 136, 153]],
  ['lightsteelblue', [176, 196, 222]],
  ['mediumturquoise', [72, 209, 204]],
  ['mediumvioletred', [199, 21, 133]],
  ['lavenderblush', [255, 240, 245]],
  ['mediumseagreen', [60, 179, 113]],
  ['palegoldenrod', [238, 232, 170]],
  ['paleturquoise', [175, 238, 238]],
  ['palevioletred', [219, 112, 147]],
  ['antiquewhite', [250, 235, 215]],
  ['darkgoldenrod', [184, 134, 11]],
  ['darkolivegreen', [85, 107, 47]],
  ['darkseagreen', [143, 188, 143]],
  ['lemonchiffon', [255, 250, 205]],
  ['lightseagreen', [32, 178, 170]],
  ['lightskyblue', [135, 206, 250]],
  ['mediumpurple', [147, 112, 219]],
  ['rebeccapurple', [102, 51, 153]],
  ['darkslateblue', [72, 61, 139]],
  ['darkturquoise', [0, 206, 209]],
  ['floralwhite', [255, 250, 240]],
  ['lightsalmon', [255, 160, 122]],
  ['lightyellow', [255, 255, 224]],
  ['mediumorchid', [186, 85, 211]],
  ['navajowhite', [255, 222, 173]],
  ['aquamarine', [127, 255, 212]],
  ['darksalmon', [233, 150, 122]],
  ['darkslategray', [47, 79, 79]],
  ['darkslategrey', [47, 79, 79]],
  ['ghostwhite', [248, 248, 255]],
  ['greenyellow', [173, 255, 47]],
  ['lightcoral', [240, 128, 128]],
  ['lightgreen', [144, 238, 144]],
  ['midnightblue', [25, 25, 112]],
  ['papayawhip', [255, 239, 213]],
  ['powderblue', [176, 224, 230]],
  ['whitesmoke', [245, 245, 245]],
  ['yellowgreen', [154, 205, 50]],
  ['aliceblue', [240, 248, 255]],
  ['blueviolet', [138, 43, 226]],
  ['burlywood', [222, 184, 135]],
  ['darkkhaki', [189, 183, 107]],
  ['darkmagenta', [139, 0, 139]],
  ['darkorchid', [153, 50, 204]],
  ['deepskyblue', [0, 191, 255]],
  ['dodgerblue', [30, 144, 255]],
  ['forestgreen', [34, 139, 34]],
  ['gainsboro', [220, 220, 220]],
  ['lightblue', [173, 216, 230]],
  ['lightcyan', [224, 255, 255]],
  ['lightgray', [211, 211, 211]],
  ['lightgrey', [211, 211, 211]],
  ['lightpink', [255, 182, 193]],
  ['mintcream', [245, 255, 250]],
  ['mistyrose', [255, 228, 225]],
  ['palegreen', [152, 251, 152]],
  ['peachpuff', [255, 218, 185]],
  ['rosybrown', [188, 143, 143]],
  ['saddlebrown', [139, 69, 19]],
  ['sandybrown', [244, 164, 96]],
  ['slategray', [112, 128, 144]],
  ['slategrey', [112, 128, 144]],
  ['springgreen', [0, 255, 127]],
  ['cadetblue', [95, 158, 160]],
  ['chartreuse', [127, 255, 0]],
  ['chocolate', [210, 105, 30]],
  ['cornsilk', [255, 248, 220]],
  ['darkgray', [169, 169, 169]],
  ['darkgrey', [169, 169, 169]],
  ['darkorange', [255, 140, 0]],
  ['darkviolet', [148, 0, 211]],
  ['goldenrod', [218, 165, 32]],
  ['honeydew', [240, 255, 240]],
  ['lavender', [230, 230, 250]],
  ['moccasin', [255, 228, 181]],
  ['olivedrab', [107, 142, 35]],
  ['royalblue', [65, 105, 225]],
  ['seashell', [255, 245, 238]],
  ['slateblue', [106, 90, 205]],
  ['steelblue', [70, 130, 180]],
  ['turquoise', [64, 224, 208]],
  ['deeppink', [255, 20, 147]],
  ['dimgray', [105, 105, 105]],
  ['dimgrey', [105, 105, 105]],
  ['firebrick', [178, 34, 34]],
  ['hotpink', [255, 105, 180]],
  ['indianred', [205, 92, 92]],
  ['lawngreen', [124, 252, 0]],
  ['limegreen', [50, 205, 50]],
  ['oldlace', [253, 245, 230]],
  ['skyblue', [135, 206, 235]],
  ['thistle', [216, 191, 216]],
  ['bisque', [255, 228, 196]],
  ['darkcyan', [0, 139, 139]],
  ['mediumblue', [0, 0, 205]],
  ['orangered', [255, 69, 0]],
  ['orchid', [218, 112, 214]],
  ['salmon', [250, 128, 114]],
  ['seagreen', [46, 139, 87]],
  ['silver', [192, 192, 192]],
  ['violet', [238, 130, 238]],
  ['azure', [240, 255, 255]],
  ['beige', [245, 245, 220]],
  ['crimson', [220, 20, 60]],
  ['darkgreen', [0, 100, 0]],
  ['fuchsia', [255, 0, 255]],
  ['ivory', [255, 255, 240]],
  ['khaki', [240, 230, 140]],
  ['linen', [250, 240, 230]],
  ['magenta', [255, 0, 255]],
  ['wheat', [245, 222, 179]],
  ['white', [255, 255, 255]],
  ['coral', [255, 127, 80]],
  ['darkblue', [0, 0, 139]],
  ['gray', [128, 128, 128]],
  ['grey', [128, 128, 128]],
  ['orange', [255, 165, 0]],
  ['pink', [255, 192, 203]],
  ['plum', [221, 160, 221]],
  ['purple', [128, 0, 128]],
  ['sienna', [160, 82, 45]],
  ['snow', [255, 250, 250]],
  ['tomato', [255, 99, 71]],
  ['yellow', [255, 255, 0]],
  ['brown', [165, 42, 42]],
  ['darkred', [139, 0, 0]],
  ['indigo', [75, 0, 130]],
  ['olive', [128, 128, 0]],
  ['peru', [205, 133, 63]],
  ['tan', [210, 180, 140]],
  ['aqua', [0, 255, 255]],
  ['cyan', [0, 255, 255]],
  ['gold', [255, 215, 0]],
  ['maroon', [128, 0, 0]],
  ['teal', [0, 128, 128]],
  ['green', [0, 128, 0]],
  ['blue', [0, 0, 255]],
  ['lime', [0, 255, 0]],
  ['navy', [0, 0, 128]],
  ['black', [0, 0, 0]],
  ['red', [255, 0, 0]],
])

export const NAMED_COLOR_REGEX = new RegExp(
  `(?:^|\\W)(?<color>${[...NAMED_COLORS.keys()].sort().join('|')})(?:$|\\W)`,
  'giu',
)

export const COLOR_ATTRIBUTES = [
  'fill',
  'stroke',
  'color',
  'flood-color',
  'lighting-color',
  'stop-color',
]

export const STYLE_REGEX = /<style[^>]*>(?<style>[\s\S]*?)<\/style>/giu

export const CSS_PROPERTY_REGEX =
  /(?:color|fill|stop-color|stroke):\s*(?<value>[^;]+)/giu

export const ATTRIBUTES_PATTERNS = COLOR_ATTRIBUTES.map(
  attribute =>
    new RegExp(`${attribute}\\s*=\\s*["'](?<value>[^"']+)["']`, 'gi'),
)

/**
 * Constants for color matching weights in different scenarios.
 *
 * These weights determine how the algorithm prioritizes different color
 * components when finding the closest match. Each set of weights is optimized
 * for a specific type of color:
 *
 * - HIGH_SATURATION: For vivid colors where maintaining the correct hue is
 *   crucial
 * - CHROMATIC: For medium-saturation colors that balance hue and lightness
 * - LOW_SATURATION: For colors with some but minimal saturation
 * - ACHROMATIC: For grayscale colors where only lightness matters
 */
export const COLOR_WEIGHTS = {
  /**
   * Weights for colors in the purple-pink family, which need strong hue
   * preservation.
   */
  PURPLE_PINK_FAMILY: {
    lightness: 0.2,
    chroma: 0.4,
    hue: 11,
  },

  /**
   * Weights for bright, chromatic colors with high saturation balanced approach
   * with emphasis on hue and chroma.
   */
  BRIGHT_CHROMATIC: {
    lightness: 0.2,
    chroma: 0.5,
    hue: 7.5,
  },

  /**
   * Weights for highly saturated colors Emphasizes preserving hue and chroma
   * over exact lightness matching.
   */
  HIGH_SATURATION: {
    lightness: 0.25,
    chroma: 0.5,
    hue: 5,
  },

  /**
   * Weights for colors in the yellow family, which have unique perceptual.
   * properties.
   */
  YELLOW_FAMILY: {
    lightness: 0.15,
    chroma: 0.4,
    hue: 10,
  },

  /**
   * Weights for colors with low saturation but not achromatic Emphasizes
   * preserving lightness with some attention to hue.
   */
  LOW_SATURATION: {
    lightness: 0.6,
    chroma: 0.3,
    hue: 3,
  },

  /**
   * Weights for chromatic colors with medium-high saturation Balanced approach
   * with emphasis on hue.
   */
  CHROMATIC: {
    lightness: 0.3,
    chroma: 0.4,
    hue: 5.5,
  },

  /**
   * Weights for achromatic colors (grayscale) Only cares about lightness,
   * ignores hue completely.
   */
  ACHROMATIC: {
    lightness: 1,
    chroma: 0.1,
    hue: 0,
  },
}

/**
 * Thresholds for color classification.
 *
 * These values determine how a color is categorized:
 *
 * - Below MEDIUM_SATURATION: Considered low saturation
 * - Between MEDIUM and HIGH: Considered medium saturation
 * - Above HIGH_SATURATION: Considered highly saturated
 *
 * These thresholds are for OKLCH chroma values, not traditional HSL saturation.
 */
export const COLOR_THRESHOLDS = {
  /** Threshold for medium saturation colors. */
  MEDIUM_SATURATION: 0.08,

  /** Threshold for high saturation colors. */
  HIGH_SATURATION: 0.14,
}

/**
 * Defines color categories by hue ranges for more accurate matching. Categories
 * represent different regions of the color wheel.
 */
export const COLOR_CATEGORIES = {
  YELLOW_GREEN: {
    name: 'yellowGreen',
    maxHue: 105,
    minHue: 100,
  },
  MAGENTA: {
    name: 'magenta',
    minHue: 285,
    maxHue: 345,
  },
  PURPLE: {
    name: 'purple',
    minHue: 255,
    maxHue: 285,
  },
  YELLOW: {
    name: 'yellow',
    maxHue: 100,
    minHue: 45,
  },
  ORANGE: {
    name: 'orange',
    minHue: 25,
    maxHue: 45,
  },
  GREEN: {
    name: 'green',
    minHue: 105,
    maxHue: 165,
  },
  CYAN: {
    name: 'cyan',
    minHue: 165,
    maxHue: 195,
  },
  BLUE: {
    name: 'blue',
    minHue: 195,
    maxHue: 255,
  },
  RED: {
    name: 'red',
    minHue: 345,
    maxHue: 25,
  },
}

/** Maps each color category to its adjacent categories for fallback matching. */
export const ADJACENT_CATEGORIES = {
  [COLOR_CATEGORIES.YELLOW.name]: [
    COLOR_CATEGORIES.ORANGE.name,
    COLOR_CATEGORIES.YELLOW_GREEN.name,
  ],
  [COLOR_CATEGORIES.YELLOW_GREEN.name]: [
    COLOR_CATEGORIES.YELLOW.name,
    COLOR_CATEGORIES.GREEN.name,
  ],
  [COLOR_CATEGORIES.GREEN.name]: [
    COLOR_CATEGORIES.YELLOW_GREEN.name,
    COLOR_CATEGORIES.CYAN.name,
  ],
  [COLOR_CATEGORIES.PURPLE.name]: [
    COLOR_CATEGORIES.BLUE.name,
    COLOR_CATEGORIES.MAGENTA.name,
  ],
  [COLOR_CATEGORIES.RED.name]: [
    COLOR_CATEGORIES.MAGENTA.name,
    COLOR_CATEGORIES.ORANGE.name,
  ],
  [COLOR_CATEGORIES.MAGENTA.name]: [
    COLOR_CATEGORIES.PURPLE.name,
    COLOR_CATEGORIES.RED.name,
  ],
  [COLOR_CATEGORIES.ORANGE.name]: [
    COLOR_CATEGORIES.RED.name,
    COLOR_CATEGORIES.YELLOW.name,
  ],
  [COLOR_CATEGORIES.BLUE.name]: [
    COLOR_CATEGORIES.CYAN.name,
    COLOR_CATEGORIES.PURPLE.name,
  ],
  [COLOR_CATEGORIES.CYAN.name]: [
    COLOR_CATEGORIES.GREEN.name,
    COLOR_CATEGORIES.BLUE.name,
  ],
}
