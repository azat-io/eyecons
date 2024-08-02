import type { Color } from 'culori'

import { formatHex } from 'culori'

export let toRgb = (color: string | Color): string => {
  let hex = formatHex(color)
  if (!hex) {
    throw new Error(`Could not convert ${color} to RGB`)
  }
  return hex
}
