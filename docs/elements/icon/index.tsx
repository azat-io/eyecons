import { component$, useContext, useSignal, useTask$ } from '@builder.io/qwik'
import { isDev } from '@builder.io/qwik/build'

import type { ThemeData } from '../../typings'

import { ThemeTypeContext, ThemeContext } from '../theme'
import { colorize } from '../../../extension/colorize'

interface IconProps {
  light: boolean
  id: string
}

let metaGlobIcons = import.meta.glob('../../../icons/files/*', {
  import: 'default',
  eager: !isDev,
  query: '?raw',
}) as Record<string, () => Promise<string>>

let metaGlobThemeData = import.meta.glob('../../../themes/*', {
  import: 'default',
  eager: !isDev,
}) as Record<string, () => Promise<string>>

export let Icon = component$<IconProps>(({ light, id }) => {
  let icon = useSignal<string | null>(null)
  let theme = useContext(ThemeContext)
  let themeType = useContext(ThemeTypeContext)

  useTask$(async ({ track }) => {
    track(() => themeType.value)
    track(() => theme.value)
    track(() => icon.value)

    let iconPath = `../../../icons/files/${id}${
      themeType.value === 'light' && light ? '-light' : ''
    }.svg`

    let svgValue = (
      isDev ? await metaGlobIcons[iconPath]() : metaGlobIcons[iconPath]
    ) as string

    let themeDataPath = `../../../themes/${theme.value}.json`

    let themeData = (isDev
      ? await metaGlobThemeData[themeDataPath]()
      : metaGlobThemeData[themeDataPath]) as unknown as ThemeData

    icon.value = await colorize(id, themeData, svgValue)
  })

  if (!icon.value) {
    return null
  }

  return <div dangerouslySetInnerHTML={icon.value} />
})
