import { component$, Slot } from '@builder.io/qwik'

import styles from './index.module.css'

interface ContainerProps {
  class?: string
}

export let Container = component$<ContainerProps>(({ class: className }) => (
  <div class={[styles['container'], className]}>
    <Slot />
  </div>
))
