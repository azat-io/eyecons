import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import * as vscode from 'vscode'

import { getUserThemeId } from '../../../extension/io/vscode/get-user-theme-id'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('vscode', () => ({
  workspace: {
    getConfiguration: vi.fn(),
  },
}))

vi.mock('../../../data/themes', () => ({
  themes: [
    { aliases: ['Default Dark', 'Dark+'], name: 'Dark Theme', id: 'dark' },
    { aliases: ['Default Light', 'Light+'], name: 'Light Theme', id: 'light' },
    { aliases: ['Monokai Pro'], name: 'Monokai', id: 'monokai' },
    { name: 'Nord', aliases: [], id: 'nord' },
  ],
}))

let eyeconsConfigMock = {
  get: vi.fn(),
}

let workbenchConfigMock = {
  get: vi.fn(),
}

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

describe('getUserThemeId', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(vscode.workspace.getConfiguration).mockImplementation(
      section => ({
        get:
          section === 'eyecons' ?
            eyeconsConfigMock.get
          : workbenchConfigMock.get,
        update: vi.fn().mockResolvedValue(null),
        has: vi.fn(() => true),
        inspect: vi.fn(),
      }),
    )

    vi.spyOn(logger, 'withContext').mockReturnValue(mockLoggerContext)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return explicitly configured theme when set', () => {
    eyeconsConfigMock.get.mockReturnValue('monokai')

    let result = getUserThemeId()

    expect(result).toBe('monokai')
    expect(eyeconsConfigMock.get).toHaveBeenCalledWith('theme')
    expect(workbenchConfigMock.get).not.toHaveBeenCalled()
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Theme setting: monokai',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Using explicitly configured theme: monokai',
    )
  })

  it('should detect theme from VS Code when set to "inherit"', () => {
    eyeconsConfigMock.get.mockReturnValue('inherit')
    workbenchConfigMock.get.mockReturnValue('Monokai Pro')

    let result = getUserThemeId()

    expect(result).toBe('monokai')
    expect(eyeconsConfigMock.get).toHaveBeenCalledWith('theme')
    expect(workbenchConfigMock.get).toHaveBeenCalledWith('colorTheme')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Theme setting: inherit',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'User VS Code theme: Monokai Pro',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Matched user theme to: Monokai (monokai)',
    )
  })

  it('should detect theme from VS Code when theme setting is not set', () => {
    eyeconsConfigMock.get.mockReturnValue(null)
    workbenchConfigMock.get.mockReturnValue('Nord')

    let result = getUserThemeId()

    expect(result).toBe('nord')
    expect(eyeconsConfigMock.get).toHaveBeenCalledWith('theme')
    expect(workbenchConfigMock.get).toHaveBeenCalledWith('colorTheme')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Theme setting: not set',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'User VS Code theme: Nord',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Matched user theme to: Nord (nord)',
    )
  })

  it('should match VS Code theme by alias', () => {
    eyeconsConfigMock.get.mockReturnValue(null)
    workbenchConfigMock.get.mockReturnValue('Default Dark')

    let result = getUserThemeId()

    expect(result).toBe('dark')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Matched user theme to: Dark Theme (dark)',
    )
  })

  it('should default to "dark" when no matching theme is found', () => {
    eyeconsConfigMock.get.mockReturnValue(null)
    workbenchConfigMock.get.mockReturnValue('Unknown Theme')

    let result = getUserThemeId()

    expect(result).toBe('dark')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'No matching theme found, using default "dark"',
    )
  })

  it('should default to "dark" when VS Code theme is not available', () => {
    eyeconsConfigMock.get.mockReturnValue(null)
    workbenchConfigMock.get.mockReturnValue(null)

    let result = getUserThemeId()

    expect(result).toBe('dark')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'User VS Code theme: unknown',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'No matching theme found, using default "dark"',
    )
  })
})
