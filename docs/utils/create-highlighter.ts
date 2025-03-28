import type {
  HighlighterGeneric,
  BundledLanguage,
  BundledTheme,
  BuiltinTheme,
} from 'shiki'

import {
  createHighlighter as createShikiHighlighter,
  createJavaScriptRegexEngine,
} from 'shiki'

let highlighter: HighlighterGeneric<BundledLanguage, BuiltinTheme> | null = null

let jsEngine = createJavaScriptRegexEngine()

export let createHighlighter = async (): Promise<
  HighlighterGeneric<BundledLanguage, BundledTheme>
> => {
  highlighter ??= await createShikiHighlighter({
    engine: jsEngine,
    langs: ['tsx'],
    themes: [],
  })
  return highlighter
}
