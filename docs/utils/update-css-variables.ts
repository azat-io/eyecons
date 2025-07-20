import type { ThemeSource } from '../../extension/types/theme'

export interface AdditionalData {
  themeType: 'light' | 'dark'
}

export let colorNames = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
] as const

export function updateThemeCSSVariables({
  backgroundSecondary,
  backgroundTertiary,
  backgroundPrimary,
  backgroundBrand,
  contentPrimary,
  contentBrand,
  themeType,
  border,
  main,
}: AdditionalData & ThemeSource): void {
  setColor('background-brand', backgroundBrand)
  setColor('background-primary', backgroundPrimary)
  setColor('background-secondary', backgroundSecondary)
  setColor('background-tertiary', backgroundTertiary)
  setColor('content-brand', contentBrand)
  setColor('content-primary', contentPrimary)
  setColor('border', border)

  for (let [key, value] of Object.entries(main)) {
    setColor(key, value)
  }

  document.documentElement.style.setProperty('color-scheme', themeType)
}

function setColor(key: string, value: string): void {
  let root = document.documentElement
  root.style.setProperty(`--color-${key}`, value)
}
