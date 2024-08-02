import type { HighlighterGeneric, BundledLanguage, BuiltinTheme } from 'shiki'

import { createHighlighter as createShikiHighlighter } from 'shiki'

let highlighter: HighlighterGeneric<BundledLanguage, BuiltinTheme> | null = null

export let createHighlighter = async () => {
  if (!highlighter) {
    highlighter = await createShikiHighlighter({
      langs: ['tsx'],
      themes: [],
    })
  }
  return highlighter
}
