import type { Oklch } from 'culori'

import { round } from 'culori'

export let enhanceContrast = (colors: [Oklch, Oklch]): [Oklch, Oklch] => {
  let [color0, color1] = colors.map(color => structuredClone(color))
  let { l: l0, c: c0 } = color0!
  let { l: l1, c: c1 } = color1!

  let shouldEnhanceColor: 0 | 1
  let result: [Oklch, Oklch]

  if (c0 < 0.1) {
    shouldEnhanceColor = 0
  } else if (c1 < 0.1) {
    shouldEnhanceColor = 1
  } else {
    shouldEnhanceColor = l0 > l1 ? 0 : 1
  }

  let approx = round(2)
  let enhance = (color: Oklch, compareColor: Oklch): Oklch => {
    let { l, c } = color
    return {
      ...color,
      c: approx(compareColor.l > l ? c + 0.05 : c - 0.05),
    }
  }

  if (shouldEnhanceColor === 0) {
    result = [enhance(colors[0], colors[1]), colors[1]]
  } else {
    result = [colors[0], enhance(colors[1], colors[0])]
  }

  return result
}
