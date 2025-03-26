import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import type { ThemeSource } from '../../../extension/types/theme'

import { getUserThemeId } from '../../../extension/io/vscode/get-user-theme-id'
import { getFolderColor } from '../../../extension/io/vscode/get-folder-color'
import { getThemeSource } from '../../../extension/io/file/get-theme-source'
import { getTheme } from '../../../extension/core/build/get-theme'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('../../../extension/io/vscode/get-user-theme-id', () => ({
  getUserThemeId: vi.fn(),
}))

vi.mock('../../../extension/io/vscode/get-folder-color', () => ({
  getFolderColor: vi.fn(),
}))

vi.mock('../../../extension/io/file/get-theme-source', () => ({
  getThemeSource: vi.fn(),
}))

vi.mock('../../../extension/io/vscode/logger', () => ({
  logger: {
    withContext: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
  },
}))

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

describe('getTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(logger.withContext).mockReturnValue(mockLoggerContext)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should build a complete theme configuration successfully', async () => {
    vi.mocked(getUserThemeId).mockReturnValue('dark')
    vi.mocked(getFolderColor).mockReturnValue('blue')

    let mockThemeSource: ThemeSource = {
      main: {
        orange: '#ffa500',
        yellow: '#ffff00',
        purple: '#800080',
        green: '#00ff00',
        blue: '#0000ff',
        red: '#ff0000',
      },
      overrides: {
        html: {
          '#f06529': '#ce9178',
        },
      },
      colors: ['#ffffff', '#000000', '#569cd6'],
      backgroundSecondary: '#569cd6',
      backgroundTertiary: '#000000',
      backgroundPrimary: '#ffffff',
      backgroundBrand: '#000000',
      contentPrimary: '#ffffff',
      contentBrand: '#000000',
      border: '#000000',
    }

    vi.mocked(getThemeSource).mockResolvedValue(mockThemeSource)

    let result = await getTheme()

    expect(result).toEqual({
      main: {
        orange: '#ffa500',
        yellow: '#ffff00',
        purple: '#800080',
        green: '#00ff00',
        blue: '#0000ff',
        red: '#ff0000',
      },
      overrides: {
        html: {
          '#f06529': '#ce9178',
        },
      },
      colors: ['#ffffff', '#000000', '#569cd6'],
      backgroundSecondary: '#569cd6',
      backgroundTertiary: '#000000',
      backgroundPrimary: '#ffffff',
      backgroundBrand: '#000000',
      contentPrimary: '#ffffff',
      contentBrand: '#000000',
      folderColor: 'blue',
      border: '#000000',
      id: 'dark',
    })

    expect(getUserThemeId).toHaveBeenCalledTimes(1)
    expect(getFolderColor).toHaveBeenCalledTimes(1)
    expect(getThemeSource).toHaveBeenCalledWith('dark')

    expect(mockLoggerContext.info).toHaveBeenCalledWith('Using theme: dark')
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Using folder color: blue',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Successfully loaded theme source data',
    )
  })

  it('should throw an error when theme source loading fails', async () => {
    vi.mocked(getUserThemeId).mockReturnValue('unknown')
    vi.mocked(getFolderColor).mockReturnValue('blue')

    let mockError = new Error('Theme source not found')
    vi.mocked(getThemeSource).mockRejectedValue(mockError)

    await expect(getTheme()).rejects.toThrow('Theme source not found')

    expect(getUserThemeId).toHaveBeenCalledTimes(1)
    expect(getFolderColor).toHaveBeenCalledTimes(1)
    expect(getThemeSource).toHaveBeenCalledWith('unknown')

    expect(mockLoggerContext.info).toHaveBeenCalledWith('Using theme: unknown')
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Using folder color: blue',
    )
  })
})
