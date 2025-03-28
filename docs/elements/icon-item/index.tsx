import { component$ } from '@builder.io/qwik'

import { Typography } from '../typography'
import styles from './index.module.css'
import { Icon } from '../icon'

interface IconItemProps {
  light?: boolean
  name: string
  id: string
}

export let IconItem = component$<IconItemProps>(
  ({ light = false, name, id }) => (
    <li class={styles['item']}>
      <Icon light={light} id={id} />
      <Typography align="center" mbs="2xs" size="xs" noWrap>
        {name}
      </Typography>
    </li>
  ),
)
