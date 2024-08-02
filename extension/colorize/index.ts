import { enhanceContrast } from './enhance-contrast'
import { checkContrast } from './check-contrast'
import { parseSvg } from './parse-svg'
import { override } from './override'
import { toOklch } from './to-oklch'
import { recolor } from './recolor'
import { toRgb } from './to-rgb'

interface Theme {
  overrides?: Record<string, Record<string, string>>
  colors: string[]
}

export let colorize = async (
  id: string,
  theme: Theme,
  source: string,
): Promise<string> => {
  if (id.includes('folder')) {
    let { recolorFolder } = await import('./recolor-folder')
    return recolorFolder(source, theme.colors)
  }
  let overrided = theme.overrides
    ? override(id, theme.overrides, source)
    : source
  let recolored = await recolor(theme, overrided)
  let parsed = parseSvg(recolored)
  if (!parsed) {
    return recolored
  }
  let isContrasted = checkContrast(parsed)
  if (isContrasted) {
    return recolored
  }
  let backgroundOklch = toOklch(parsed.background)
  let foregroundOklch = toOklch(parsed.foreground)
  let enhancedColors = enhanceContrast([backgroundOklch, foregroundOklch])
  let [newBackground, newForeground] = enhancedColors.map(color => toRgb(color))
  return recolored
    .replace(parsed.background, newBackground)
    .replace(parsed.foreground, newForeground)
}
