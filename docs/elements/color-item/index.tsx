import { component$ } from '@builder.io/qwik'

import styles from './index.module.css'

interface ColorItemProps {
  color: string
}

export let ColorItem = component$<ColorItemProps>(({ color }) => (
  <div
    style={{ '--color-item': color }}
    class={styles['color']}
  ></div>
))
