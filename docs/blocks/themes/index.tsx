import { component$ } from '@builder.io/qwik'

import { IllustrationTheme } from '../../elements/illustration-theme'
import { Typography } from '../../elements/typography'
import { Container } from '../../elements/container'
import { Button } from '../../elements/button'
import styles from './index.module.css'

export let Themes = component$(() => (
  <section class={styles.themes}>
    <Container class={styles.container}>
      <div>
        <IllustrationTheme />
      </div>
      <div>
        <Typography size="xl" tag="h2" mbe="xs" bold>
          Themes
        </Typography>
        <Typography mbe="m">
          Eyecons ensures your icons look great with any VS Code theme, keeping
          your environment visually consistent.
        </Typography>
        <Typography mbe="xl">
          Haven't found your favorite color theme?
        </Typography>
        <Button
          href="https://github.com/azat-io/eyecons/issues/new?assignees=&labels=feature&projects=&template=theme-request.yml&title=Theme+Request%3A+%28fill+in%29"
          target="_blank"
        >
          Request Theme
        </Button>
      </div>
    </Container>
  </section>
))
