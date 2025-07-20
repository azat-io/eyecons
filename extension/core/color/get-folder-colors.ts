import type { Vector } from '@texel/color'

import { serialize, OKLCH } from '@texel/color'

import type { Theme } from '../../types/theme'

import { toOklch } from './to-oklch'

type MainColorKey = keyof Theme['main']

const FOLDER_PRIMARY_COLOR = '#ffca28'
const FOLDER_SECONDARY_COLOR = '#ffa000'

export function getFolderColors({
  folderColor,
  main,
}: Theme): Map<string, string> {
  let isValidKey = Object.keys(main).includes(folderColor)
  let baseColor = isValidKey ? main[folderColor as MainColorKey] : main.blue

  let primaryColor = toOklch(baseColor)
  let [lightness, chroma, hue] = primaryColor
  let secondaryColor: Vector = [lightness! - 0.1, chroma!, hue!]

  let colorMapping = new Map<string, string>()
  colorMapping.set(FOLDER_PRIMARY_COLOR, serialize(primaryColor, OKLCH))
  colorMapping.set(FOLDER_SECONDARY_COLOR, serialize(secondaryColor, OKLCH))

  return colorMapping
}
