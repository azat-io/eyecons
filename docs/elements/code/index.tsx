import { component$, useContext, useSignal, useTask$ } from '@builder.io/qwik'
import { isDev } from '@builder.io/qwik/build'

import { ThemeSourceContext, ThemeTypeContext, ThemeContext } from '../theme'
import { createHighlighter } from '../../utils/create-highlighter'
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
}) as Record<string, any>

export let Code = component$(() => {
  let theme = useContext(ThemeContext)
  let themeSource = useContext(ThemeSourceContext)
  let themeType = useContext(ThemeTypeContext)

  let html = useSignal('')

  useTask$(async ({ track }) => {
    track(() => themeSource.value)
    track(() => themeType.value)
    track(() => theme.value)

    let themePath = `../../themes/${theme.value}.json`

    let themeValue = isDev
      ? await metaGlobThemes[themePath]()
      : metaGlobThemes[themePath]

    if (themeValue.name.toLowerCase().includes('light')) {
      themeType.value = 'light'
    } else if (themeValue.name.toLowerCase().includes('dark')) {
      themeType.value = 'dark'
    } else {
      themeType.value = themeValue.type === 'light' ? 'light' : 'dark'
    }

    themeSource.value = themeValue

    let highlighter = await createHighlighter()
    await highlighter.loadTheme(themeValue)

    let htmlValue = highlighter.codeToHtml(code, {
      theme: getThemeNameById(theme.value),
      lang: 'tsx',
    })

    html.value = htmlValue
  })

  return <div dangerouslySetInnerHTML={html.value} />
})
