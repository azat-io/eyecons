import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getUserThemeId } from '../../../extension/io/vscode/get-user-theme-id'
import { mockSettings } from '../../helpers/mock-settings'

vi.mock('../../../data/themes', () => ({
  themes: [
    { name: 'Solarized Dark', id: 'solarized-dark' },
    { aliases: ['Default Dark', 'Dark+'], name: 'Dark Theme', id: 'dark' },
    { aliases: ['Monokai Pro'], name: 'Monokai', id: 'monokai' },
    { name: 'Nord', aliases: [], id: 'nord' },
  ],
}))

describe('getUserThemeId', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should use the theme the user selected for the icons over the VS Code theme', () => {
    mockSettings({
      workbench: { colorTheme: 'Nord' },
      eyecons: { theme: 'monokai' },
    })

    expect(getUserThemeId()).toBe('monokai')
  })

  it.each([
    ['inherits the VS Code theme', { theme: 'inherit' }],
    ['selected no theme', {}],
  ])(
    'should follow the VS Code theme when the user %s',
    (_, eyeconsSettings) => {
      mockSettings({
        workbench: { colorTheme: 'Nord' },
        eyecons: eyeconsSettings,
      })

      expect(getUserThemeId()).toBe('nord')
    },
  )

  it.each([
    ['its name', 'Solarized Dark', 'solarized-dark'],
    ['a name it is part of', 'Monokai Pro (Filter Spectrum)', 'monokai'],
    ['an alias', 'Default Dark Modern', 'dark'],
  ])(
    'should recognize a VS Code theme by %s',
    (_, colorTheme, expectedThemeId) => {
      mockSettings({ workbench: { colorTheme } })

      expect(getUserThemeId()).toBe(expectedThemeId)
    },
  )

  it('should fall back to the dark theme for an unknown VS Code theme', () => {
    mockSettings({ workbench: { colorTheme: 'Unknown Theme' } })

    expect(getUserThemeId()).toBe('dark')
  })

  it('should fall back to the dark theme when VS Code reports no theme', () => {
    expect(getUserThemeId()).toBe('dark')
  })
})
