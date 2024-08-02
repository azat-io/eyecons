import { component$ } from '@builder.io/qwik'

import { Typography } from '../../elements/typography'
import styles from './index.module.css'

export let Footer = component$(() => (
  <footer class={styles.footer}>
    <Typography align="center" mbe="2xs" size="s">
      Released under the MIT License
    </Typography>
    <Typography align="center" size="s">
      Copyright © 2024 Azat S. & Contributors
    </Typography>
  </footer>
))
