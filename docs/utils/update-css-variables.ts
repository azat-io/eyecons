import { toOklch } from '../../extension/colorize/to-oklch'
import { toRgb } from '../../extension/colorize/to-rgb'

export interface Arguments {
  colors: Record<string, string>
  themeType: 'light' | 'dark'
}

let set = (key: string, values: (undefined | string)[]): void => {
  let root = document.documentElement
  for (let value of values) {
    if (value) {
      root.style.setProperty(`--color-${key}`, value)
      return
    }
  }
}

export let updateThemeCSSVariables = ({
  themeType,
  colors,
}: Arguments): void => {
  set('background-brand', [
    colors['activityBarBadge.background'],
    colors['button.background'],
  ])
  set('background-primary', [colors['editor.background']])
  set('background-secondary', [
    colors['editor.background']?.toLowerCase() ===
    colors['tab.activeBackground']?.toLowerCase()
      ? '#000'
      : colors['tab.activeBackground'],
    colors['editor.background']?.toLowerCase() ===
    colors['tab.inactiveBackground']?.toLowerCase()
      ? '#000'
      : colors['tab.inactiveBackground'],
    colors['sideBar.background'],
  ])
  set('background-tertiary', [
    colors['input.background'],
    colors['activityBar.background'],
  ])

  set('content-brand', [
    colors['activityBarBadge.foreground'],
    colors['button.foreground'],
    colors['editor.foreground'],
  ])
  set('content-primary', [
    colors['editor.foreground'],
    colors['foreground'],
    colors['sideBar.foreground'],
  ])

  set('border-primary', [
    colors['tab.border'],
    colors['editorGroup.border'],
    colors['editorInfo.border'],
  ])
  set('border-secondary', [colors['input.border']])

  document.documentElement.style.setProperty('color-scheme', themeType)
}

export let colorNames = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

export let updateBaseCSSVariables = (colors: string[], type: string): void => {
  for (let [i, color] of colors.slice(0, colorNames.length).entries()) {
    if (type === 'light') {
      let oklch = toOklch(color)
      oklch.l += 0.2
      color = toRgb(oklch)
    }
    set(colorNames[i]!, [color])
  }
  if (type === 'light') {
    set('inverse', ['var(--color-content-primary)'])
  } else {
    set('inverse', ['rgba(0, 0, 0, 0.15'])
  }
}
