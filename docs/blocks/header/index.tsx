import { component$ } from '@builder.io/qwik'

import { Typography } from '../../elements/typography'
import { Container } from '../../elements/container'
import { Button } from '../../elements/button'
import { Logo } from '../../elements/logo'
import styles from './index.module.css'

export let Header = component$(() => (
  <header class={styles['header']}>
    <Container class={styles['container']}>
      <Logo />
      <Typography
        align="center"
        size="2xl"
        mbe="xs"
        tag="h1"
        bold
      >
        Eyecons
      </Typography>
      <Typography
        align="center"
        size="l"
      >
        Advanced VS Code Icon Theme
      </Typography>
      <div class={styles['buttons']}>
        <Button
          onClick$={() => {
            if (globalThis.fathom) {
              globalThis.fathom.trackEvent('click: marketplace')
            }
          }}
          href="https://marketplace.visualstudio.com/items?itemName=azat-io.eyecons"
          variant="primary"
          target="_blank"
        >
          Install
        </Button>
        <Button
          onClick$={() => {
            if (globalThis.fathom) {
              globalThis.fathom.trackEvent('click: github')
            }
          }}
          href="https://github.com/azat-io/eyecons"
          variant="secondary"
          target="_blank"
        >
          View on GitHub
        </Button>
      </div>
    </Container>
  </header>
))
