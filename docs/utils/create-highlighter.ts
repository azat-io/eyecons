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

let jsEngine = createJavaScriptRegexEngine({
  target: 'ES2025',
  cache: new Map(),
  forgiving: true,
})

export async function createHighlighter(): Promise<
  HighlighterGeneric<BundledLanguage, BundledTheme>
> {
  highlighter ??= await createShikiHighlighter({
    engine: jsEngine,
    langs: ['tsx'],
    themes: [],
  })
  return highlighter
}
