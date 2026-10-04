import { vi } from 'vitest'

let outputChannel = {
  appendLine: vi.fn(),
  dispose: vi.fn(),
  clear: vi.fn(),
}

export let window = {
  createOutputChannel: vi.fn(() => outputChannel),
  showInformationMessage: vi.fn(),
  showWarningMessage: vi.fn(),
  showErrorMessage: vi.fn(),
}

export let workspace = {
  getConfiguration: vi.fn(() => ({ get: vi.fn() })),
}
