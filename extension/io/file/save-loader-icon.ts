import fs from 'node:fs/promises'
import path from 'node:path'

import type { Config } from '../../types/config'

import { toRelativePath } from '../../core/build/to-relative-path'
import { logger } from '../vscode/logger'

/**
 * Saves the loader icon to the output directory.
 *
 * @param loaderSvgContent - SVG content of the loader icon to save.
 * @param config - Extension configuration.
 * @returns The relative path to the saved loader icon.
 */
export async function saveLoaderIcon(
  loaderSvgContent: string,
  config: Config,
): Promise<string> {
  let ioLogger = logger.withContext('IO')

  try {
    ioLogger.debug(
      `Creating directory for output icons: ${config.outputIconsPath}`,
    )

    await fs.mkdir(config.outputIconsPath, { recursive: true })

    let loaderPath = path.join(config.outputIconsPath, 'loader.svg')
    await fs.writeFile(loaderPath, loaderSvgContent, 'utf8')

    ioLogger.debug(`Loader icon saved to: ${loaderPath}`)

    return toRelativePath(
      path.join(config.outputIconsPath, 'loader.svg'),
      config,
    )
  } catch (error) {
    ioLogger.error(
      `Failed to save loader icon: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    throw error
  }
}
