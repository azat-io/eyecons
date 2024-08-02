import type { FocusTrap } from 'focus-trap'

import {
  useVisibleTask$,
  component$,
  useContext,
  useSignal,
  $,
} from '@builder.io/qwik'
import { createFocusTrap } from 'focus-trap'

import { themes } from '../../../data/themes'
import { ThemeContext } from '../theme'
import styles from './index.module.css'

interface ThemeDropdownProps {
  close: () => void
}

export let ThemeDropdown = component$<ThemeDropdownProps>(({ close }) => {
  let ref = useSignal<HTMLDivElement | undefined>(undefined)
  let theme = useContext(ThemeContext)
  let setTheme$ = $((themeValue: string) => {
    theme.value = themeValue
    close()
  })

  useVisibleTask$(() => {
    let focusTrap: FocusTrap | null = null
    if (ref.value) {
      focusTrap = createFocusTrap(ref.value, {
        returnFocusOnDeactivate: false,
        allowOutsideClick: true,
      })
    }
    let handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
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
      ref={ref}
    >
      {themes.map(({ name, id }) => (
        <button
          onClick$={() => {
            setTheme$(id)
          }}
          class={styles['dropdown-item']}
          key={id}
        >
          {name}
        </button>
      ))}
    </div>
  )
})
