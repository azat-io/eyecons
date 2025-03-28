import { component$ } from '@builder.io/qwik'

import { ThemeChanger } from '../../elements/theme-changer'
import { ThemeSelect } from '../../elements/theme-select'
import { Typography } from '../../elements/typography'
import { ColorList } from '../../elements/color-list'
import { Container } from '../../elements/container'
import { fileIcons } from '../../../data/file-icons'
import { IconList } from '../../elements/icon-list'
import { IconItem } from '../../elements/icon-item'
import { Theme } from '../../elements/theme'
import { Label } from '../../elements/label'
import { Code } from '../../elements/code'
import styles from './index.module.css'

export let Demo = component$(() => (
  <section class={styles['demo']}>
    <Container>
      <Theme>
        <Typography align="center" size="xl" tag="h2" mbe="xs" bold>
          Try it out
        </Typography>
        <Typography
          class={styles['description']}
          align="center"
          size="m"
          mbe="l"
          tag="p"
        >
          Choose your favorite editor color theme to see how the icons will look
          in it.
        </Typography>
        <div class={styles['demo-view']}>
          <div>
            <div class={styles['selection']}>
              <ThemeSelect />
              <ThemeChanger />
              <ColorList />
            </div>
            <IconList>
              {fileIcons.map(icon => (
                <IconItem key={icon.id} {...icon} />
              ))}
            </IconList>
          </div>
          <div>
            <div class={styles['code-example']}>
              <Label>Code Example:</Label>
              <Code />
            </div>
          </div>
        </div>
      </Theme>
    </Container>
  </section>
))
