import fs from 'node:fs/promises'
import path from 'node:path'

import type { Config } from '../../types/config'

import { logger } from '../../io/vscode/logger'

/**
 * Moves processed icons from the temporary directory to the output directory.
 *
 * @param {string} temporaryDirectory - Path to the temporary directory with
 *   processed icons
 * @param {Config} config - Extension configuration with output path information
 * @returns {Promise<void>} - Promise that resolves when all files are moved
 */
export async function moveProcessedIcons(
  temporaryDirectory: string,
  config: Config,
): Promise<void> {
  let moveLogger = logger.withContext('MoveIcons')
  moveLogger.debug(
    `Moving icons from ${temporaryDirectory} to ${config.outputIconsPath}`,
  )

  try {
    await fs.mkdir(path.dirname(config.outputIconsPath), { recursive: true })

    try {
      await fs.rm(config.outputIconsPath, { recursive: true, force: true })
      moveLogger.debug(
        `Removed existing output directory: ${config.outputIconsPath}`,
      )
    } catch (error) {
      moveLogger.debug(
        `Output directory did not exist or could not be removed: ${config.outputIconsPath}`,
      )
      moveLogger.debug(
        `Error message: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }

    await fs.cp(temporaryDirectory, config.outputIconsPath, { recursive: true })
    await fs.rm(temporaryDirectory, { recursive: true, force: true })
    moveLogger.info(`Successfully copied icons to ${config.outputIconsPath}`)
  } catch (error) {
    moveLogger.error(
      `Failed to move icons: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    throw error
  }
}
