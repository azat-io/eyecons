import { component$, Slot } from '@builder.io/qwik'

import styles from './index.module.css'

interface ButtonProps {
  target?: '_parent' | '_blank' | '_self' | '_top'
  type?: 'button' | 'submit' | 'reset'
  variant?: 'secondary' | 'primary'
  onClick?(): void
  href?: string
}

export let Button = component$<ButtonProps>(
  ({ variant = 'primary', type = 'button', ...props }) => {
    let Tag: 'button' | 'a' = 'button'
    if (props.href) {
      Tag = 'a'
    }

    return (
      <Tag
        class={[styles['button'], styles[`variant-${variant}`]]}
        type={type}
        {...props}
      >
        <Slot />
      </Tag>
    )
  },
)
