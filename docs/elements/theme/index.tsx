import type { Signal } from '@builder.io/qwik'

import {
  useContextProvider,
  createContextId,
  useVisibleTask$,
  component$,
  useSignal,
  Slot,
} from '@builder.io/qwik'
import { isDev } from '@builder.io/qwik/build'

import type { ThemeSource } from '../../../extension/types/theme'
import type { Theme as ThemeType } from '../../typings'

import { updateThemeCSSVariables } from '../../utils/update-css-variables'

export let ThemeContext = createContextId<Signal<string>>('docs.theme-context')

export let ThemeTypeContext = createContextId<Signal<string>>(
  'docs.theme-type-context',
)

export let ThemeSourceContext = createContextId<Signal<ThemeType | null>>(
  'docs.theme-source-context',
)

let metaGlobData = import.meta.glob('../../../themes/*', {
  import: 'default',
  eager: !isDev,
}) as Record<string, () => Promise<ThemeSource>>

export let Theme = component$(() => {
  let theme = useSignal('nord')
  let themeType = useSignal<'light' | 'dark'>('dark')
  let themeSource = useSignal<ThemeType | null>(null)

  useContextProvider(ThemeContext, theme)
  useContextProvider(ThemeTypeContext, themeType)
  useContextProvider(ThemeSourceContext, themeSource)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => themeSource.value)
    track(() => themeType.value)
    track(() => theme.value)

    let dataPath = `../../../themes/${theme.value}.json`

    let dataValue = (
      isDev ? await metaGlobData[dataPath]?.() : metaGlobData[dataPath]
    ) as ThemeSource

    if (themeSource.value) {
      updateThemeCSSVariables({
        themeType: themeType.value,
        ...dataValue,
      })
    }
  })

  return <Slot />
})
