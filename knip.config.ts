import type { KnipConfig } from 'knip'

export default {
  qwik: {
    config: ['vite.config.documentation.ts'],
  },
  ignoreDependencies: ['@types/vscode'],
  entry: ['vite.config.preview.ts'],
  ignore: ['docs/mocks/**'],
} satisfies KnipConfig
