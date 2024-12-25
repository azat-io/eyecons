import { component$ } from '@builder.io/qwik'

import { Typography } from '../../elements/typography'
import { Container } from '../../elements/container'
import styles from './index.module.css'

export let Footer = component$(() => (
  <footer class={styles['footer']}>
    <Container class={styles['container']}>
      <Typography align="center" mbe="2xs" size="s">
        Released under the MIT License
      </Typography>
      <Typography align="center" size="s">
        Copyright © 2024 Azat S. & Contributors
      </Typography>
    </Container>
  </footer>
))
