import fs from 'node:fs/promises'
import path from 'node:path'

import type { ThemeSchema } from '../../types/theme'
import type { Config } from '../../types/config'

import { logger } from '../vscode/logger'

/**
 * Saves the theme definition schema to a JSON file.
 *
 * @param schema - The theme schema to save.
 * @param config - Extension configuration.
 * @returns Promise that resolves when the save is complete.
 */
export async function saveThemeSchema(
  schema: ThemeSchema,
  config: Config,
): Promise<void> {
  let ioLogger = logger.withContext('IO')

  try {
    ioLogger.debug(`Writing theme definition to ${config.iconDefinitionsPath}`)

    let directory = path.dirname(config.iconDefinitionsPath)
    await fs.mkdir(directory, { recursive: true })

    await fs.writeFile(
      config.iconDefinitionsPath,
      JSON.stringify(schema, null, 2),
      'utf8',
    )

    ioLogger.debug(`Theme definition saved to ${config.iconDefinitionsPath}`)
  } catch (error) {
    ioLogger.error(
      `Failed to save theme definition: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    throw error
  }
}
