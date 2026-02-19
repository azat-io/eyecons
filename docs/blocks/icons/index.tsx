import { component$ } from '@builder.io/qwik'

import { IllustrationIcons } from '../../elements/illustration-icons'
import { Typography } from '../../elements/typography'
import { Container } from '../../elements/container'
import { Button } from '../../elements/button'
import styles from './index.module.css'

export let Icons = component$(() => (
  <section class={styles['icons']}>
    <Container class={styles['container']}>
      <div>
        <Typography
          size="xl"
          tag="h2"
          mbe="xs"
          bold
        >
          Icons
        </Typography>
        <Typography mbe="m">
          Easily enhance your workspace with icons designed for clarity and
          functionality.
        </Typography>
        <Typography mbe="xl">Is there some icon missing?</Typography>
        <Button
          href="https://github.com/azat-io/eyecons/issues/new?assignees=&labels=feature&projects=&template=icon-request.yml&title=Icon+Request%3A+%28fill+in%29"
          onClick$={() => {
            if (globalThis.fathom) {
              globalThis.fathom.trackEvent('click: request icon')
            }
          }}
          target="_blank"
        >
          Request Icon
        </Button>
      </div>
      <div class={styles['illustration']}>
        <IllustrationIcons />
      </div>
    </Container>
  </section>
))
