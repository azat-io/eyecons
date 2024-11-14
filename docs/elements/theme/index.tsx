import type { Signal } from '@builder.io/qwik'

import {
  useContextProvider,
  createContextId,
  useVisibleTask$,
  component$,
  useSignal,
  Slot,
} from '@builder.io/qwik'

import type { Arguments as ThemeArguments } from '../../utils/update-css-variables'
import type { Theme as ThemeType } from '../../typings'

import { updateThemeCSSVariables } from '../../utils/update-css-variables'

export let ThemeContext = createContextId<Signal<string>>('docs.theme-context')

export let ThemeTypeContext = createContextId<Signal<string>>(
  'docs.theme-type-context',
)

export let ThemeSourceContext = createContextId<Signal<ThemeType | null>>(
  'docs.theme-source-context',
)

export let Theme = component$(() => {
  let theme = useSignal('nord')
  let themeType = useSignal<'light' | 'dark'>('dark')
  let themeSource = useSignal<ThemeType | null>(null)

  useContextProvider(ThemeContext, theme)
  useContextProvider(ThemeTypeContext, themeType)
  useContextProvider(ThemeSourceContext, themeSource)

  useVisibleTask$(({ track }) => {
    track(() => themeSource.value)
    track(() => themeType.value)

    if (themeSource.value) {
      updateThemeCSSVariables({
        themeType: themeType.value,
        ...themeSource.value,
      } as unknown as ThemeArguments)
    }
  })

  return <Slot />
})
