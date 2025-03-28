import type { Theme } from '../../types/theme'

import { getUserThemeId } from '../../io/vscode/get-user-theme-id'
import { getFolderColor } from '../../io/vscode/get-folder-color'
import { getThemeSource } from '../../io/file/get-theme-source'
import { logger } from '../../io/vscode/logger'

/**
 * Builds a complete theme configuration by combining user theme ID, folder
 * color preference, and theme source data.
 *
 * @returns {Promise<Theme>} Complete theme configuration for icon generation.
 * @throws {Error} If theme source data cannot be loaded.
 */
export let getTheme = async (): Promise<Theme> => {
  let themeLogger = logger.withContext('ThemeBuilder')

  let userThemeId = getUserThemeId()
  themeLogger.info(`Using theme: ${userThemeId}`)

  let folderColor = getFolderColor()
  themeLogger.info(`Using folder color: ${folderColor}`)

  let themeSource = await getThemeSource(userThemeId)
  themeLogger.debug('Successfully loaded theme source data')

  return {
    id: userThemeId,
    folderColor,
    ...themeSource,
  }
}
