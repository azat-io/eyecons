interface Args {
  colors: Record<string, undefined | string>
  themeType: 'light' | 'dark'
}

let set = (key: string, values: (undefined | string)[]) => {
  let root = document.documentElement
  for (let value of values) {
    if (value) {
      root.style.setProperty(`--color-${key}`, value)
      return
    }
  }
}

export let updateThemeCSSVars = ({ themeType, colors }: Args) => {
  set('background-brand', [
    colors['activityBarBadge.background'],
    colors['button.background'],
  ])
  set('background-primary', [colors['editor.background']])
  set('background-secondary', [
    colors['editor.background']?.toLowerCase() !==
    colors['tab.activeBackground']?.toLowerCase()
      ? colors['tab.activeBackground']
      : undefined,
    colors['editor.background']?.toLowerCase() !==
    colors['tab.inactiveBackground']?.toLowerCase()
      ? colors['tab.inactiveBackground']
      : undefined,
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
    colors.foreground,
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

export let updateBaseCSSVars = (colors: string[]) => {
  for (let [i, color] of colors.slice(0, colorNames.length).entries()) {
    set(colorNames[i], [color])
  }
}