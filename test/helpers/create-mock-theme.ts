import type { Theme } from '../../extension/types/theme'

/**
 * Builds a theme for tests from the colors of the bundled "Dark (Visual
 * Studio)" theme.
 *
 * The palette is trimmed to one dark and one light gray plus a red, a teal and
 * a blue, so the theme color an icon color should end up with is obvious.
 *
 * @param overrides - Fields replacing the defaults.
 * @returns Theme to hand to the function under test.
 */
export function createMockTheme(overrides: Partial<Theme> = {}): Theme {
  return {
    main: {
      orange: '#ce9178',
      yellow: '#d7ba7d',
      purple: '#c586c0',
      green: '#4ec9b0',
      blue: '#569cd6',
      red: '#d16969',
    },
    colors: ['#1e1e1e', '#d4d4d4', '#d16969', '#4ec9b0', '#569cd6'],
    backgroundSecondary: '#202020',
    backgroundTertiary: '#202020',
    backgroundPrimary: '#1e1e1e',
    backgroundBrand: '#0078d4',
    contentPrimary: '#d4d4d4',
    contentBrand: '#ffffff',
    folderColor: 'blue',
    border: '#3c3c3c',
    overrides: {},
    id: 'dark',
    ...overrides,
  }
}
