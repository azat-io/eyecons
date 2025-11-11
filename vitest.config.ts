import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        statements: 100,
        functions: 100,
        branches: 100,
        lines: 100,
      },
      provider: 'v8',
    },
    alias: {
      vscode: path.resolve(__dirname, './test/__mocks__/vscode.ts'),
    },
    server: {
      deps: {
        external: ['vscode'],
      },
    },
    setupFiles: ['./test/setup.ts'],
    environment: 'node',
    globals: true,
  },
})
