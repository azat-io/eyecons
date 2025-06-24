import type { Signal } from '@builder.io/qwik'

import {
  useContextProvider,
  createContextId,
  useVisibleTask$,
  component$,
  useSignal,
  Slot,
  $,
} from '@builder.io/qwik'
import { isDev } from '@builder.io/qwik/build'

import type { ThemeSource } from '../../../extension/types/theme'

import { updateThemeCSSVariables } from '../../utils/update-css-variables'

export let ThemeContext = createContextId<Signal<string>>('docs.theme-context')

export let ThemeTypeContext = createContextId<Signal<string>>(
  'docs.theme-type-context',
)

export let ThemeSourceContext = createContextId<Signal<ThemeSource | null>>(
  'docs.theme-source-context',
)

let metaGlobData = import.meta.glob('../../../themes/*', {
  import: 'default',
  eager: !isDev,
}) as Record<string, (() => Promise<ThemeSource>) | ThemeSource>

let loadThemeData = $(async (themeName: string) => {
  let dataPath = `../../../themes/${themeName}.json`

  try {
    let moduleOrData = metaGlobData[dataPath]

    if (isDev) {
      if (typeof moduleOrData === 'function') {
        return await moduleOrData()
      }
    } else {
      return moduleOrData as ThemeSource
    }
  } catch (error) {
    console.warn(`Failed to load theme: ${themeName}`, error)
  }

  return null
})

export let Theme = component$(() => {
  let theme = useSignal('nord')
  let themeType = useSignal<'light' | 'dark'>('dark')
  let themeSource = useSignal<ThemeSource | null>(null)

  useContextProvider(ThemeContext, theme)
  useContextProvider(ThemeTypeContext, themeType)
  useContextProvider(ThemeSourceContext, themeSource)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    let currentTheme = track(() => theme.value)
    let currentThemeType = track(() => themeType.value)

    let dataValue = await loadThemeData(currentTheme)

    if (dataValue) {
      themeSource.value = dataValue
      updateThemeCSSVariables({
        themeType: currentThemeType,
        ...dataValue,
      })
    }
  })

  return <Slot />
})
