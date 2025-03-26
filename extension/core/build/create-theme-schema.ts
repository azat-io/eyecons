import type { IconDefinitions, ThemeSchema, ThemeData } from '../../types/theme'
import type { Config } from '../../types/config'
import type { Theme } from '../../types/theme'

import { getHideExplorerArrowValue } from '../../io/vscode/get-hide-explorer-arrow-value'

/** Options for creating a theme schema. */
interface CreateThemeSchemaOptions {
  /** Extension configuration. */
  config: Config

  /** Current VS Code theme and its colors. */
  theme: Theme
}

/**
 * Creates a complete theme schema with all icon definitions and associations.
 *
 * @param {IconDefinitions} iconDefinitions - Definitions of all icons used in
 *   the theme
 * @param {ThemeData} themeData - Light and dark theme specific file
 *   associations
 * @param {CreateThemeSchemaOptions} options - Options containing theme and
 *   config
 * @returns {ThemeSchema} The complete theme schema
 */
export let createThemeSchema = (
  iconDefinitions: IconDefinitions,
  themeData: ThemeData,
  options: CreateThemeSchemaOptions,
): ThemeSchema => {
  let { config, theme } = options
  let fileId = 'file'
  let fileLightId = 'file-light'
  let folderId = 'folder'
  let folderOpenId = 'folder-open'
  let buildTime = new Date().toISOString()
  let hidesExplorerArrows = getHideExplorerArrowValue()

  return {
    light: {
      fileExtensions: themeData.light.fileExtensions ?? {},
      fileNames: themeData.light.fileNames ?? {},
      file: fileLightId,
    },
    fileExtensions: themeData.dark.fileExtensions ?? {},
    fileNames: themeData.dark.fileNames ?? {},
    folderColor: theme.folderColor,
    folderExpanded: folderOpenId,
    folderNamesExpanded: {},
    version: config.version,
    hidesExplorerArrows,
    themeId: theme.id,
    folder: folderId,
    iconDefinitions,
    folderNames: {},
    file: fileId,
    buildTime,
  }
}
