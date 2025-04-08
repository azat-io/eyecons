import { component$, useContext, $ } from '@builder.io/qwik'

import { themes } from '../../../data/themes'
import { ThemeContext } from '../theme'
import styles from './index.module.css'
import { Button } from '../button'

export let ThemeChanger = component$(() => {
  let theme = useContext(ThemeContext)

  let changeTheme$ = $((direction: -1 | 1): void => {
    let currentThemeIndex = themes.findIndex(t => t.id === theme.value)
    let newThemeIndex =
      (currentThemeIndex + direction + themes.length) % themes.length
    let newThemeValue = themes[newThemeIndex]?.id
    if (newThemeValue && newThemeValue !== theme.value) {
      theme.value = newThemeValue
    }
  })

  let setNextTheme$ = $(() => changeTheme$(1))
  let setPreviousTheme$ = $(() => changeTheme$(-1))

  return (
    <div class={styles['theme-changer']}>
      <Button
        onClick$={setPreviousTheme$}
        aria-label="Previous theme"
        class={styles['button']}
        variant="secondary"
        bordered
        size="s"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class={styles['icon']}
          viewBox="0 0 16 16"
        >
          <path
            d="m5.928 7.976l4.357 4.357l-.618.62L5 8.284v-.618L9.667 3l.618.619z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          />
        </svg>
      </Button>
      <Button
        class={styles['button']}
        onClick$={setNextTheme$}
        aria-label="Next theme"
        variant="secondary"
        bordered
        size="s"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class={styles['icon']}
          viewBox="0 0 16 16"
        >
          <path
            d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          />
        </svg>
      </Button>
    </div>
  )
})
