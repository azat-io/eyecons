import type { NoSerialize } from '@builder.io/qwik'
import type { FocusTrap } from 'focus-trap'

import {
  component$,
  useContext,
  useSignal,
  useTask$,
  $,
} from '@builder.io/qwik'
import { createFocusTrap } from 'focus-trap'

import { themes } from '../../../data/themes'
import { ThemeContext } from '../theme'
import styles from './index.module.css'

interface ThemeDropdownProps {
  close: NoSerialize<() => void>
}

export let ThemeDropdown = component$<ThemeDropdownProps>(({ close }) => {
  let reference = useSignal<HTMLDivElement | undefined>()
  let theme = useContext(ThemeContext)

  let setTheme$ = $((themeValue: string): void => {
    theme.value = themeValue
    close?.()
  })

  useTask$(({ track }) => {
    track(() => reference.value)

    let focusTrap: FocusTrap | null = null
    if (reference.value) {
      focusTrap = createFocusTrap(reference.value, {
        returnFocusOnDeactivate: false,
        allowOutsideClick: true,
      })
    }

    let handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        close?.()
      }
    }

    document.addEventListener('keydown', handleEscape)
    focusTrap?.activate()

    return () => {
      focusTrap?.deactivate()
      document.removeEventListener('keydown', handleEscape)
    }
  })

  return (
    <div
      style={{
        '--total': themes.length,
      }}
      class={styles.dropdown}
      ref={reference}
    >
      {themes.map(({ name, id }) => (
        <button
          onClick$={async () => {
            await setTheme$(id)
          }}
          class={styles['dropdown-item']}
          data-umami-event="Select Theme"
          data-umami-event-name={name}
          key={id}
        >
          {name}
        </button>
      ))}
    </div>
  )
})
