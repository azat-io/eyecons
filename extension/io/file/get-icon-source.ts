import fs from 'node:fs/promises'
import path from 'node:path'

import type { Config } from '../../types/config'

import { logger } from '../vscode/logger'

/**
 * Gets the source SVG content for an icon.
 *
 * @param iconId - The icon identifier.
 * @param iconType - The icon type (e.g. 'files', 'folder').
 * @param config - Extension configuration.
 * @returns SVG content.
 */
export async function getIconSource(
  iconId: string,
  iconType: string,
  config: Config,
): Promise<string> {
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
