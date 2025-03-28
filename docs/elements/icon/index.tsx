import type { ExtensionContext } from 'vscode'

import { component$, useContext, useSignal, useTask$ } from '@builder.io/qwik'
import { isDev } from '@builder.io/qwik/build'

import type { ThemeSource } from '../../../extension/types/theme'

import { adaptIconColors } from '../../../extension/core/color/adapt-icon-colors'
import { getConfig } from '../../../extension/core/build/get-config'
import { ThemeTypeContext, ThemeContext } from '../theme'

interface IconProps {
  light: boolean
  id: string
}

let metaGlobIcons = import.meta.glob('../../../icons/files/*', {
  import: 'default',
  eager: !isDev,
  query: '?raw',
}) as Record<string, () => Promise<string>>

let metaGlobData = import.meta.glob('../../../themes/*', {
  import: 'default',
  eager: !isDev,
}) as Record<string, () => Promise<ThemeSource>>

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

    let svgContent = (
      isDev ? await metaGlobIcons[iconPath]?.() : metaGlobIcons[iconPath]
    ) as string

    let dataPath = `../../../themes/${theme.value}.json`

    let dataValue = (
      isDev ? await metaGlobData[dataPath]?.() : metaGlobData[dataPath]
    ) as ThemeSource

    let themeValue = {
      folderColor: 'blue',
      id: theme.value,
      ...dataValue,
    }

    let extensionContext = {} as ExtensionContext

    icon.value = adaptIconColors(
      {
        svgContent,
        id,
      },
      themeValue,
      getConfig(extensionContext),
    )
  })

  if (!icon.value) {
    return null
  }

  return <div dangerouslySetInnerHTML={icon.value} />
})
