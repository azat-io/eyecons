import type { ThemeData, ThemeType } from '../../types/theme'
import type { FormattedIconValue } from '../../types/icon'

/**
 * Builds a map of file extensions and file names to icon IDs for both light and
 * dark themes. Processes an array of formatted icon values and extracts file
 * associations for each theme type.
 *
 * @param icons - Formatted icon values to extract associations from.
 * @returns Map of file extensions and file names to icon IDs for light and dark
 *   themes.
 */
export function createThemeAssociations(
  icons: FormattedIconValue[],
): ThemeData {
  let themeData: ThemeData = {
    light: {
      fileExtensions: {},
      fileNames: {},
    },
    dark: {
      fileExtensions: {},
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
  }

  return themeData
}
