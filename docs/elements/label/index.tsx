import { component$, Slot } from '@builder.io/qwik'

import { Typography } from '../typography'
import styles from './index.module.css'

interface LabelProps {
  for?: string
}

export let Label = component$<LabelProps>(props => (
  <Typography
    class={styles['label']}
    tag="label"
    mbe="2xs"
    size="s"
    {...props}
  >
    <Slot />
  </Typography>
))
