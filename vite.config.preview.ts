import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      'node:path': path.join(__dirname, './docs/mocks/path.ts'),
      vscode: path.join(__dirname, './docs/mocks/vscode.ts'),
    },
  },
})
