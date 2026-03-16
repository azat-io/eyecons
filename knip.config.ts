import type { KnipConfig } from 'knip'

export default {
  qwik: {
    config: ['vite.config.documentation.ts'],
  },
  entry: ['extension/index.ts', 'vite.config.preview.ts'],
  ignoreDependencies: ['@types/vscode'],
  ignore: ['docs/mocks/**'],
} satisfies KnipConfig
