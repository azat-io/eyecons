import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import * as vscode from 'vscode'

import { getFolderColor } from '../../../extension/io/vscode/get-folder-color'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('vscode', () => ({
  workspace: {
    getConfiguration: vi.fn(),
  },
}))

let eyeconsConfigMock = {
  update: vi.fn().mockResolvedValue(null),
  inspect: vi.fn(),
  has: vi.fn(),
  get: vi.fn(),
}

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

describe('getFolderColor', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(vscode.workspace.getConfiguration).mockImplementation(
      () => eyeconsConfigMock,
    )

    vi.spyOn(logger, 'withContext').mockReturnValue(mockLoggerContext)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return the configured folder color when valid', () => {
    eyeconsConfigMock.get.mockReturnValue('green')

    let result = getFolderColor()

    expect(result).toBe('green')
    expect(eyeconsConfigMock.get).toHaveBeenCalledWith('folderColor')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Folder color setting: green',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Using folder color: green',
    )
  })

  it('should return default "blue" when folder color is not set', () => {
    eyeconsConfigMock.get.mockReturnValue(null)

    let result = getFolderColor()
    expect(result).toBe('blue')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Folder color setting: not set',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Using default folder color: blue',
    )
  })

  it('should return default "blue" when folder color is invalid', () => {
    eyeconsConfigMock.get.mockReturnValue('pink')
    let result = getFolderColor()
    expect(result).toBe('blue')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Folder color setting: pink',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Using default folder color: blue',
    )
  })
})
