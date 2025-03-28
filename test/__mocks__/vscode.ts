import { vi } from 'vitest'

let mockAppendLine = vi.fn()
let mockDispose = vi.fn()
let mockClear = vi.fn()

let mockOutputChannel = {
  appendLine: mockAppendLine,
  dispose: mockDispose,
  clear: mockClear,
}

export let window = {
  createOutputChannel: vi.fn().mockReturnValue(mockOutputChannel),
  showInformationMessage: vi.fn(),
  showWarningMessage: vi.fn(),
  showErrorMessage: vi.fn(),
}

export let workspace = {
  getConfiguration: vi.fn(),
}
