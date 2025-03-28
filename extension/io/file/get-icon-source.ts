import fs from 'node:fs/promises'
import path from 'node:path'

import type { Config } from '../../types/config'

import { logger } from '../vscode/logger'

/**
 * Gets the source SVG content for an icon.
 *
 * @param {string} iconId - The icon identifier.
 * @param {string} iconType - The icon type (e.g. 'files', 'folder').
 * @param {Config} config - Extension configuration.
 * @returns {Promise<string>} SVG content.
 */
export let getIconSource = async (
  iconId: string,
  iconType: string,
  config: Config,
): Promise<string> => {
  let ioLogger = logger.withContext('IconSource')

  try {
    let fileName = `${iconId}.svg`
    let filePath = path.join(config.sourceIconsPath, iconType, fileName)

    let content = await fs.readFile(filePath, 'utf8')

    ioLogger.debug(`Read source for icon: ${fileName}`)
    return content
  } catch (error) {
    ioLogger.error(
      `Failed to read source for icon ${iconId}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    throw error
  }
}
