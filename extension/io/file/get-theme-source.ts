import fs from 'node:fs/promises'
import path from 'node:path'

import type { ThemeSource } from '../../types/theme'

import { logger } from '../vscode/logger'

/**
 * Loads and parses theme source data from a JSON file.
 *
 * @param {string} themeId - The ID of the theme to load (file name without
 *   extension)
 * @returns {Promise<ThemeSource>} Parsed theme data with colors array and
 *   overrides mapping
 * @throws {Error} If the theme file cannot be read or parsed
 */
export async function getThemeSource(themeId: string): Promise<ThemeSource> {
  let themeLogger = logger.withContext('ThemeSource')
  let themePath = path.join(__dirname, '../../../themes', `${themeId}.json`)

  themeLogger.debug(`Loading theme from: ${themePath}`)

  try {
    let source = await fs.readFile(themePath)
    let themeData = JSON.parse(source.toString()) as ThemeSource

    themeLogger.debug(`Successfully loaded theme: ${themeId}`)
    return themeData
  } catch (error) {
    themeLogger.error(
      `Failed to load theme ${themeId}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    throw new Error(`Failed to load theme ${themeId}`)
  }
}
