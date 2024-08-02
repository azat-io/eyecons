import type { Signal } from '@builder.io/qwik'

import {
  useContextProvider,
  createContextId,
  useVisibleTask$,
  component$,
  useSignal,
  Slot,
} from '@builder.io/qwik'

import { updateThemeCSSVars } from '../../utils/update-css-vars'

export let ThemeContext = createContextId<Signal<string>>('docs.theme-context')

export let ThemeTypeContext = createContextId<Signal<string>>(
  'docs.theme-type-context',
)

export let ThemeSourceContext = createContextId<Signal<Object | null>>(
  'docs.theme-source-context',
)

export let Theme = component$(() => {
  let theme = useSignal('atom-one-dark')
  let themeType = useSignal<'light' | 'dark'>('dark')
  let themeSource = useSignal<Record<'colors', Record<string, string>> | null>(
    null,
  )

  useContextProvider(ThemeContext, theme)
  useContextProvider(ThemeTypeContext, themeType)
  useContextProvider(ThemeSourceContext, themeSource)

  useVisibleTask$(async ({ track }) => {
    track(() => themeSource.value)
    track(() => themeType.value)

    if (themeSource.value) {
      updateThemeCSSVars({
        themeType: themeType.value,
        ...themeSource.value,
      })
    }
  })

  return <Slot />
})
