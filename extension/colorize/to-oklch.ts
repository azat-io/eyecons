import type { Oklch } from 'culori'

import { modeOklch, useMode, round } from 'culori'

export let toOklch = (color: string): Oklch => {
  let oklch = useMode(modeOklch)
  let oklchColor = oklch(color)
  let approx = round(2)

  if (oklchColor) {
    return Object.fromEntries(
      Object.entries(oklchColor).map(([key, value]) => [key, approx(value)]),
    ) as Oklch
  }

  throw new Error(`Could not convert ${color} to OKLCH`)
}
