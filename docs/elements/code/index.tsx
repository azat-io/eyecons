import type { Signal } from '@builder.io/qwik'
import type { ThemeInput } from 'shiki'

import {
  useVisibleTask$,
  component$,
  useContext,
  useSignal,
  $,
} from '@builder.io/qwik'
import { isDev } from '@builder.io/qwik/build'

import type { Theme } from '../../typings'

import { createHighlighter } from '../../utils/create-highlighter'
import { ThemeTypeContext, ThemeContext } from '../theme'
import { getThemeNameById } from '../../../data/themes'

let code = `import type { FC } from 'react'

import { createRoot } from 'react-dom/client'
import { useState } from 'react'

const Counter: FC = () => {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  return (
    <>
      <h1>{count}</h1>
      <button onClick={increment}>
        Increment
      </button>
    </>
  )
}

const root = createRoot(
  document.getElementById('root')
)

root.render(<Counter />)`

let metaGlobThemes = import.meta.glob('../../themes/*', {
  import: 'default',
  eager: !isDev,
}) as Record<string, (() => Promise<Theme>) | Theme>

let loadCodeTheme = $(async (themeName: string) => {
  let themePath = `../../themes/${themeName}.json`

  try {
    let moduleOrData = metaGlobThemes[themePath]

    if (isDev) {
      if (typeof moduleOrData === 'function') {
        return await moduleOrData()
      }
    } else {
      return moduleOrData as Theme
    }
  } catch (error) {
    console.warn(
      `Failed to load theme for code highlighting: ${themeName}`,
      error,
    )
  }

  return null
})

export let Code = component$(() => {
  let theme = useContext<Signal<string>>(ThemeContext)
  let themeType = useContext<Signal<string>>(ThemeTypeContext)

  let html = useSignal('')

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    let currentTheme = track(() => theme.value)

    let themeValue = await loadCodeTheme(currentTheme)

    if (themeValue) {
      if (themeValue.name.toLowerCase().includes('light')) {
        themeType.value = 'light'
      } else if (themeValue.name.toLowerCase().includes('dark')) {
        themeType.value = 'dark'
      } else {
        themeType.value = themeValue.type === 'light' ? 'light' : 'dark'
      }

      let highlighter = await createHighlighter()
      await highlighter.loadTheme(themeValue as unknown as ThemeInput)

      let htmlValue = highlighter.codeToHtml(code, {
        theme: getThemeNameById(currentTheme),
        lang: 'tsx',
      })

      html.value = htmlValue
    }
  })

  return <div dangerouslySetInnerHTML={html.value} />
})
