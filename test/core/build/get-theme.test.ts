import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ThemeSource } from '../../../extension/types/theme'

import { getUserThemeId } from '../../../extension/io/vscode/get-user-theme-id'
import { getFolderColor } from '../../../extension/io/vscode/get-folder-color'
import { getThemeSource } from '../../../extension/io/file/get-theme-source'
import { getTheme } from '../../../extension/core/build/get-theme'

vi.mock('../../../extension/io/vscode/get-user-theme-id', () => ({
  getUserThemeId: vi.fn(),
}))

vi.mock('../../../extension/io/vscode/get-folder-color', () => ({
  getFolderColor: vi.fn(),
}))

vi.mock('../../../extension/io/file/get-theme-source', () => ({
  getThemeSource: vi.fn(),
}))

describe('getTheme', () => {
  let nordSource: ThemeSource = {
    main: {
      orange: '#d08770',
      yellow: '#ebcb8b',
      purple: '#b48ead',
      green: '#a3be8c',
      blue: '#81a1c1',
      red: '#bf616a',
    },
    colors: ['#2e3440', '#d8dee9', '#bf616a', '#a3be8c', '#81a1c1'],
    overrides: { html: { '#e34f26': '#d08770' } },
    backgroundSecondary: '#3b4252',
    backgroundTertiary: '#434c5e',
    backgroundPrimary: '#2e3440',
    backgroundBrand: '#88c0d0',
    contentPrimary: '#d8dee9',
    contentBrand: '#2e3440',
    border: '#4c566a',
  }

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(getUserThemeId).mockReturnValue('nord')
    vi.mocked(getFolderColor).mockReturnValue('purple')
  })

  it('should combine the selected theme, its source and the folder color', async () => {
    let themeSources: Partial<Record<string, ThemeSource>> = {
      nord: nordSource,
    }
    vi.mocked(getThemeSource).mockImplementation(themeId =>
      Promise.resolve(themeSources[themeId]!),
    )

    let result = await getTheme()

    expect(result).toEqual({ ...nordSource, folderColor: 'purple', id: 'nord' })
  })

  it('should reject when the source of the selected theme cannot be loaded', async () => {
    let error = new Error('Failed to load theme nord')
    vi.mocked(getThemeSource).mockRejectedValue(error)

    await expect(getTheme()).rejects.toBe(error)
  })
})
