import { differenceCiede2000, nearest } from 'culori'

import { colorPattern } from './color-pattern'
import { toOklch } from './to-oklch'

export let recolor = (
  theme: Record<'colors', string[]>,
  source: string,
): string => {
  let findNearestBaseColor = nearest(theme.colors, differenceCiede2000(1, 2, 2))
  let findNearestExtremeColor = nearest(
    theme.colors,
    differenceCiede2000(2, 1, 1),
  )

  let updateColor = (color: string): string => {
    let { l, c } = toOklch(color)
    let isExtreme = c < 0.05 && (l < 0.2 || l > 0.9)
    return isExtreme
      ? findNearestExtremeColor(color)[0]
      : findNearestBaseColor(color)[0]
  }

  return source.replaceAll(colorPattern, matched => updateColor(matched))
}
