import { useVisibleTask$, component$, useContext } from '@builder.io/qwik'
import { isDev } from '@builder.io/qwik/build'

import type { ThemeData } from '../../typings'

import {
  updateBaseCSSVariables,
  colorNames,
} from '../../utils/update-css-variables'
import { ThemeTypeContext, ThemeContext } from '../theme'
import { ColorItem } from '../color-item'
import styles from './index.module.css'

let metaGlobData = import.meta.glob('../../../themes/*', {
  import: 'default',
  eager: !isDev,
}) as Record<string, () => Promise<ThemeData>>

export let ColorList = component$(() => {
  let theme = useContext(ThemeContext)
  let themeType = useContext(ThemeTypeContext)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => themeType.value)
    track(() => theme.value)

    let dataPath = `../../../themes/${theme.value}.json`

    let dataValue = (
      isDev ? await metaGlobData[dataPath]?.() : metaGlobData[dataPath]
    ) as ThemeData

    updateBaseCSSVariables(
      dataValue.colors.length > 0 ? dataValue.colors : [],
      themeType.value,
    )
  })

  return (
    <div class={styles['list']}>
      {colorNames.map((color: string) => (
        <ColorItem color={`var(--color-${color})`} key={color} />
      ))}
    </div>
  )
})
