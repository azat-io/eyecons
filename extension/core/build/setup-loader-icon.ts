import type { IconDefinitions, ThemeData } from '../../types/theme'
import type { Config } from '../../types/config'
import type { Theme } from '../../types/theme'

import { saveThemeSchema } from '../../io/file/save-theme-schema'
import { saveLoaderIcon } from '../../io/file/save-loader-icon'
import { createThemeSchema } from './create-theme-schema'
import { createLoaderIcon } from './create-loader-icon'
import { logger } from '../../io/vscode/logger'

/**
 * Sets up the loader icon and creates a temporary theme schema. This function
 * coordinates the process of saving the loader icon and creating a temporary
 * schema.
 *
 * @param {Theme} theme - Current VS Code theme and its colors.
 * @param {Config} config - Extension configuration.
 * @returns {Promise<void>} Promise that resolves when the setup is complete.
 */
export let setupLoaderIcon = async (
  theme: Theme,
  config: Config,
): Promise<void> => {
  let setupLogger = logger.withContext('SetupLoader')

  try {
    let loaderIcon = createLoaderIcon()
    let loaderIconPath = await saveLoaderIcon(loaderIcon, config)

    let iconDefinitions: IconDefinitions = {
      'folder-open': { iconPath: loaderIconPath },
      'file-light': { iconPath: loaderIconPath },
      folder: { iconPath: loaderIconPath },
      file: { iconPath: loaderIconPath },
    }

    let themeData: ThemeData = {
      light: {},
      dark: {},
    }

    let temporarySchema = createThemeSchema(iconDefinitions, themeData, {
      config,
      theme,
    })
    await saveThemeSchema(temporarySchema, config)

    setupLogger.debug('Temporary theme schema created')
  } catch (error) {
    setupLogger.error(
      `Failed to setup loader icon: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    throw error
  }
}
