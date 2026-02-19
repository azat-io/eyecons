import { component$ } from '@builder.io/qwik'

import { colorNames } from '../../utils/update-css-variables'
import { ColorItem } from '../color-item'
import styles from './index.module.css'

export let ColorList = component$(() => (
  <div class={styles['list']}>
    {colorNames.map((color: string) => (
      <ColorItem
        color={`var(--color-${color})`}
        key={color}
      />
    ))}
  </div>
))
