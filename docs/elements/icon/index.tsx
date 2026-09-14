import type { ExtensionContext } from 'vscode'

import { component$, useContext } from '@builder.io/qwik'

import type { ThemeSource } from '../../../extension/types/theme'

import { adaptIconColors } from '../../../extension/core/color/adapt-icon-colors'
import { getConfig } from '../../../extension/core/build/get-config'
import { ThemeTypeContext, ThemeContext } from '../theme'

interface IconProps {
  light: boolean
  id: string
}

/**
 * Icons are built during render instead of being stored in a signal. Signal
 * values are part of the component state, so Qwik would serialize every
 * generated SVG into the resumability payload next to the markup it already
 * emitted.
 */
let metaGlobIcons: Record<string, string> = import.meta.glob(
  '../../../icons/files/*',
  {
    import: 'default',
    query: '?raw',
    eager: true,
  },
)

let metaGlobData: Record<string, ThemeSource> = import.meta.glob(
  '../../../themes/*',
  {
    import: 'default',
    eager: true,
  },
)

export let Icon = component$<IconProps>(({ light, id }) => {
  let theme = useContext(ThemeContext)
  let themeType = useContext(ThemeTypeContext)

  let iconPath = `../../../icons/files/${id}${
    light && themeType.value === 'light' ? '-light' : ''
  }.svg`
  let dataPath = `../../../themes/${theme.value}.json`

  let svgContent = metaGlobIcons[iconPath]
  let dataValue = metaGlobData[dataPath]

  if (!svgContent || !dataValue) {
    return null
  }

  let themeValue = {
    folderColor: 'blue',
    id: theme.value,
    ...dataValue,
  }

  let extensionContext = {} as ExtensionContext

  let icon = adaptIconColors(
    {
      svgContent,
      id,
    },
    themeValue,
    getConfig(extensionContext),
  )

  return <div dangerouslySetInnerHTML={icon} />
})
