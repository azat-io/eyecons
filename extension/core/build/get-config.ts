import type { ExtensionContext } from 'vscode'

import path from 'node:path'

import type { Config } from '../../types/config'

import { logger } from '../../io/vscode/logger'
import { version } from '../../../package.json'

/**
 * Returns the extension configuration with default values. This function
 * centralizes configuration management and makes it easier to test.
 *
 * @param context - VSCode extension context.
 * @returns The extension configuration object.
 */
export function getConfig(context: ExtensionContext): Config {
  let configLogger = logger.withContext('Config')
  let extensionPath = path.join(context.extensionPath, 'dist')
  let outputPath = path.join(extensionPath, 'output')

  let config: Config = {
    processing: {
      extremeLightnessThresholds: {
        light: 0.95,
        dark: 0.05,
      },
      lowSaturationThreshold: 0.05,
      saturationFactor: 1.2,
      adjustContrast: true,
    },
    errorHandling: {
      showNotifications: true,
      continueOnError: true,
    },
    iconDefinitionsPath: path.join(outputPath, 'definitions.json'),
    logging: {
      level: 'info',
      toFile: false,
    },
    sourceIconsPath: path.join(extensionPath, 'icons'),
    outputIconsPath: path.join(outputPath, 'icons'),
    extensionPath,
    outputPath,
    version,
  }

  configLogger.debug('Extension configuration loaded')

  return config
}
