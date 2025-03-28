import { component$, Slot } from '@builder.io/qwik'

import styles from './index.module.css'

interface TypographyProps {
  tag?: 'label' | 'span' | 'h1' | 'h2' | 'h3' | 'p'
  size?: '2xl' | 'xl' | 'xs' | 's' | 'm' | 'l'
  mbs?: '2xs' | 'xs' | 'xl' | 's' | 'm' | 'l'
  mbe?: '2xs' | 'xs' | 'xl' | 's' | 'm' | 'l'
  align?: 'center' | 'start' | 'end'
  noWrap?: boolean
  class?: string
  bold?: boolean
  for?: string
}

export let Typography = component$<TypographyProps>(
  ({
    class: className,
    align = 'start',
    noWrap = false,
    tag = 'span',
    bold = false,
    size = 'm',
    mbs,
    mbe,
    ...props
  }) => {
    let Tag = tag

    return (
      <Tag
        class={[
          styles['typography'],
          styles[`size-${size}`],
          styles[`align-${align}`],
          mbs && styles[`mbs-${mbs}`],
          mbe && styles[`mbe-${mbe}`],
          bold && styles['bold'],
          noWrap && styles['no-wrap'],
          className,
        ]}
        {...props}
      >
        <Slot />
      </Tag>
    )
  },
)
