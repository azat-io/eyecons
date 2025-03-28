import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    alias: {
      vscode: path.resolve(__dirname, './test/__mocks__/vscode.ts'),
    },
    server: {
      deps: {
        external: ['vscode'],
      },
    },
    coverage: {
      all: false,
    },
    setupFiles: ['./test/setup.ts'],
    environment: 'node',
    globals: true,
  },
})
