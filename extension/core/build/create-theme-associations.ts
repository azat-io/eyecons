import type { ThemeData, ThemeType } from '../../types/theme'
import type { FormattedIconValue } from '../../types/icon'

/**
 * Builds maps of file extensions, file names and language IDs to icon IDs for
 * both light and dark themes. Processes formatted icon values and extracts
 * associations for each theme type.
 *
 * @param icons - Formatted icon values to extract associations from.
 * @returns Maps of file extensions, file names and language IDs to icon IDs for
 *   light and dark themes.
 */
export function createThemeAssociations(
  icons: FormattedIconValue[],
): ThemeData {
  let themeData: ThemeData = {
    light: {
      fileExtensions: {},
      languageIds: {},
      fileNames: {},
    },
    dark: {
      fileExtensions: {},
      languageIds: {},
      fileNames: {},
    },
  }

  let fileIcons = icons.filter(icon => icon.type === 'files')

  for (let icon of fileIcons) {
    let themeType: ThemeType = icon.theme === 'light' ? 'light' : 'dark'

    if (icon.extensions) {
      for (let extension of icon.extensions) {
        themeData[themeType].fileExtensions![extension] = icon.id
      }
    }

    if (icon.files) {
      for (let file of icon.files) {
        themeData[themeType].fileNames![file] = icon.id
      }
    }

    if (icon.language) {
      for (let languageId of icon.language) {
        themeData[themeType].languageIds![languageId] = icon.id
      }
    }
  }

  return themeData
}
