import type { HighlighterGeneric, BundledLanguage, BuiltinTheme } from 'shiki'

import {
  createHighlighter as createShikiHighlighter,
  createJavaScriptRegexEngine,
} from 'shiki'

let highlighter: HighlighterGeneric<BundledLanguage, BuiltinTheme> | null = null

let jsEngine = createJavaScriptRegexEngine()

export let createHighlighter = async () => {
  if (!highlighter) {
    highlighter = await createShikiHighlighter({
      engine: jsEngine,
      langs: ['tsx'],
      themes: [],
    })
  }
  return highlighter
}
