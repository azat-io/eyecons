import { useVisibleTask$, component$, useContext } from '@builder.io/qwik'
import { isDev } from '@builder.io/qwik/build'

import { updateBaseCSSVars, colorNames } from '../../utils/update-css-vars'
import { ColorItem } from '../color-item'
import { ThemeContext } from '../theme'
import styles from './index.module.css'

let metaGlobData = import.meta.glob('../../../themes/*', {
  import: 'default',
  eager: !isDev,
}) as Record<string, any>

export let ColorList = component$(() => {
  let theme = useContext(ThemeContext)

  useVisibleTask$(async ({ track }) => {
    track(() => theme.value)

    let dataPath = `../../../themes/${theme.value}.json`

    let dataValue = isDev
      ? await metaGlobData[dataPath]()
      : metaGlobData[dataPath]

    updateBaseCSSVars(dataValue.colors ?? [])
  })

  return (
    <div class={styles.list}>
      {colorNames.map((color: string) => (
        <ColorItem color={`var(--color-${color})`} key={color} />
      ))}
    </div>
  )
})
