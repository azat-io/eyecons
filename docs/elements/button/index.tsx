import { component$, Slot } from '@builder.io/qwik'

import styles from './index.module.css'

interface ButtonProps {
  target?: '_parent' | '_blank' | '_self' | '_top'
  type?: 'button' | 'submit' | 'reset'
  variant?: 'secondary' | 'primary'
  onClick$?(): void
  size?: 's' | 'm'
  class?: string
  href?: string
}

export let Button = component$<ButtonProps>(
  ({
    variant = 'primary',
    class: className,
    type = 'button',
    size = 'm',
    ...props
  }) => {
    let Tag: 'button' | 'a' = 'button'
    if (props.href) {
      Tag = 'a'
    }

    return (
      <Tag
        class={[
          styles['button'],
          styles[`variant-${variant}`],
          styles[`size-${size}`],
          className,
        ]}
        type={type}
        {...props}
      >
        <Slot />
      </Tag>
    )
  },
)
