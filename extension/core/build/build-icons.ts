import { setTimeout } from 'node:timers/promises'

import type { Config } from '../../types/config'
import type { Theme } from '../../types/theme'

import { moveProcessedIcons } from '../../io/file/move-processed-icons'
import { saveThemeSchema } from '../../io/file/save-theme-schema'
import { createThemeSchema } from './create-theme-schema'
import { setupLoaderIcon } from './setup-loader-icon'
import { logger } from '../../io/vscode/logger'
import { processIcons } from './process-icons'

/**
 * Main function that starts the process of building all icons and creating the
 * theme.
 *
 * @param {Theme} theme - Current VS Code theme and its colors.
 * @param {Config} config - Extension configuration.
 * @returns {Promise<void>} Promise that resolves when the build is complete.
 */
export async function buildIcons(theme: Theme, config: Config): Promise<void> {
  let buildLogger = logger.withContext('Build')
  buildLogger.info('Starting icon theme build process')

  try {
    buildLogger.debug('Setting up loader icon')

    await setupLoaderIcon(theme, config)
    buildLogger.info('Processing icons in temporary directory')

    let processIconsResult = await processIcons(theme, config)

    buildLogger.info('Moving processed icons to output directory')
    await moveProcessedIcons(processIconsResult.temporaryDirectory, config)

    buildLogger.info('Creating and saving theme schema')
    let themeSchema = createThemeSchema(
      processIconsResult.iconDefinitions,
      processIconsResult.themeData,
      { config, theme },
    )

    await setTimeout(1000)

    await saveThemeSchema(themeSchema, config)

    buildLogger.info('Icon theme build process completed')
  } catch (error) {
    buildLogger.error(
      `Build process failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      true,
    )
    throw error
  }
}
