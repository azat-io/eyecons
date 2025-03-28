import type { NoSerialize } from '@builder.io/qwik'

import { component$, useContext, useSignal, $ } from '@builder.io/qwik'

import { useClickOutside } from '../../hooks/use-click-outside'
import { getThemeNameById } from '../../../data/themes'
import { ThemeDropdown } from '../theme-dropdown'
import { ThemeContext } from '../theme'
import styles from './index.module.css'
import { Label } from '../label'

export let ThemeSelect = component$(() => {
  let dropdownVisible = useSignal(false)
  let reference = useSignal<HTMLDivElement | undefined>()
  let theme = useContext(ThemeContext)
  let closeDropdown = $(() => {
    dropdownVisible.value = false
  })
  useClickOutside(reference, closeDropdown)

  return (
    <div class={styles['wrapper']} ref={reference}>
      <Label for="theme">Select Theme:</Label>
      <div class={styles['input-wrapper']}>
        <button
          onClick$={() => {
            dropdownVisible.value = true
          }}
          class={styles['input']}
          name="theme"
        >
          {getThemeNameById(theme.value)}
        </button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class={styles['icon']}
          viewBox="0 0 16 16"
        >
          <path
            d="m7.976 10.072l4.357-4.357l.62.618L8.284 11h-.618L3 6.333l.619-.618z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      {dropdownVisible.value && (
        <ThemeDropdown
          close={closeDropdown as unknown as NoSerialize<() => void>}
        />
      )}
    </div>
  )
})
