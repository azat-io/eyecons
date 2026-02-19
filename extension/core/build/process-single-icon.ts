import fs from 'node:fs/promises'
import path from 'node:path'

import type { FormattedIconValue } from '../../types/icon'
import type { Config } from '../../types/config'
import type { Theme } from '../../types/theme'

import { prepareIconProcessing } from '../icon/prepare-icon-processing'
import { getIconSource } from '../../io/file/get-icon-source'
import { adaptIconColors } from '../color/adapt-icon-colors'
import { logger } from '../../io/vscode/logger'

/**
 * Icon processing preparation parameters.
 */
interface IconProcessingParameters {
  /**
   * Temporary directory path.
   */
  temporaryDirectory: string

  /**
   * The icon to prepare for processing.
   */
  icon: FormattedIconValue
}

/**
 * Result of processing a single icon.
 */
interface ProcessedIconResult {
  /**
   * Path to the icon for use in the theme schema.
   */
  iconPath: string

  /**
   * Icon identifier.
   */
  id: string
}

/**
 * Processes a single icon by preparing its data, getting its source SVG, and
 * writing it to the temporary directory.
 *
 * @param parameters - Parameters for icon processing preparation.
 * @param theme - Current VS Code theme and its colors.
 * @param config - Extension configuration.
 * @returns Result containing the icon ID and path.
 */
export async function processSingleIcon(
  parameters: IconProcessingParameters,
  theme: Theme,
  config: Config,
): Promise<ProcessedIconResult> {
  try {
    let preparedIcon = prepareIconProcessing(parameters, theme, config)
    let { temporaryFilePath, iconPath, type, id } = preparedIcon

    let iconSource = await getIconSource(id, type, config)
    let adaptedIcon = adaptIconColors(
      {
        svgContent: iconSource,
        id,
      },
      theme,
      config,
    )

    let directory = path.dirname(temporaryFilePath)
    await fs.mkdir(directory, { recursive: true })

    await fs.writeFile(temporaryFilePath, adaptedIcon, 'utf8')

    return { iconPath, id }
  } catch (error) {
    logger.error(
      `Failed to process icon: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    throw error
  }
}
