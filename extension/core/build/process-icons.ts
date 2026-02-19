import type { IconDefinitions, ThemeData } from '../../types/theme'
import type { Config } from '../../types/config'
import type { Theme } from '../../types/theme'

import { createTemporaryDirectory } from '../../io/file/create-temporary-directory'
import { createThemeAssociations } from './create-theme-associations'
import { formatIconsValues } from '../icon/format-icons-values'
import { processSingleIcon } from './process-single-icon'
import { baseIcons } from '../../../data/base-icons'
import { fileIcons } from '../../../data/file-icons'
import { logger } from '../../io/vscode/logger'

/**
 * Result of processing icons in the temporary directory.
 */
interface ProcessIconsResult {
  /**
   * Icon definitions for the theme schema.
   */
  iconDefinitions: IconDefinitions

  /**
   * Temporary directory path.
   */
  temporaryDirectory: string

  /**
   * Theme data with file associations for light and dark themes.
   */
  themeData: ThemeData
}

/**
 * Processes all icons in the temporary directory.
 *
 * @param theme - Current VS Code theme and its colors.
 * @param config - Extension configuration.
 * @returns Promise that resolves when the icons are processed.
 */
export async function processIcons(
  theme: Theme,
  config: Config,
): Promise<ProcessIconsResult> {
  let processLogger = logger.withContext('ProcessIcons')
  processLogger.info('Processing icons in temporary directory')

  try {
    let temporaryDirectory = await createTemporaryDirectory()
    processLogger.debug(`Using temporary directory: ${temporaryDirectory}`)

    let baseIconValues = formatIconsValues(baseIcons, 'base')
    let fileIconValues = formatIconsValues(fileIcons, 'files')
    let icons = [...baseIconValues, ...fileIconValues]

    processLogger.debug(`Found ${baseIconValues.length} base icons`)
    processLogger.debug(`Found ${fileIconValues.length} file icons`)
    processLogger.debug(`Total icons to process: ${icons.length}`)

    let iconResults = await Promise.all(
      icons.map(async icon => {
        let result = await processSingleIcon(
          {
            temporaryDirectory,
            icon,
          },
          theme,
          config,
        )
        processLogger.debug(`Processed icon: ${result.id}`)
        return result
      }),
    )

    let iconDefinitions: IconDefinitions = {}
    for (let { iconPath, id } of iconResults) {
      iconDefinitions[id] = { iconPath }
    }

    processLogger.debug('Created icon definitions')

    let themeData = createThemeAssociations(icons)

    return {
      temporaryDirectory,
      iconDefinitions,
      themeData,
    }
  } catch (error) {
    processLogger.error(
      `Failed to process icons: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    throw error
  }
}
