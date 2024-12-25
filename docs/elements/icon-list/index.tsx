import { component$, Slot } from '@builder.io/qwik'

import styles from './index.module.css'

export let IconList = component$(() => (
  <ul class={styles['list']}>
    <Slot />
  </ul>
))
