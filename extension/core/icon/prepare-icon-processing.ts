import path from 'node:path'

import type { FormattedIconValue } from '../../types/icon'
import type { Config } from '../../types/config'
import type { Theme } from '../../types/theme'

import { toRelativePath } from '../build/to-relative-path'
import { getIconFilename } from './get-icon-filename'
import { generateHash } from '../hash/generate-hash'

/** Result of icon processing preparation. */
interface IconProcessingPreparation {
  /** Temporary file path where the processed icon will be saved. */
  temporaryFilePath: string

  /** Processed icon file name. */
  fileName: string

  /** Path to the icon for use in the theme schema. */
  iconPath: string

  /** Whether this is a light variant of the icon. */
  isLight: boolean

  /** Base icon identifier (without -light suffix). */
  baseId: string

  /** Generated hash for the icon. */
  hash: string

  /** Icon type (e.g. 'base', 'files'). */
  type: string

  /** Icon identifier. */
  id: string
}

/** Icon processing preparation parameters. */
interface IconProcessingParameters {
  /** Temporary directory path. */
  temporaryDirectory: string

  /** The icon to prepare for processing. */
  icon: FormattedIconValue
}

/**
 * Prepares data for icon processing without any side effects.
 *
 * @param {IconProcessingParameters} parameters - Parameters for icon processing
 *   preparation.
 * @param {Theme} theme - Current VS Code theme and its colors.
 * @param {Config} config - Extension configuration.
 * @returns {IconProcessingPreparation} Preparation result with paths and other
 *   data.
 */
export function prepareIconProcessing(
  parameters: IconProcessingParameters,
  theme: Theme,
  config: Config,
): IconProcessingPreparation {
  let { temporaryDirectory, icon } = parameters

  let { theme: iconTheme, type, id } = icon
  let isLight = iconTheme === 'light'
  let baseId = isLight ? id.replace('-light', '') : id
  let hash = generateHash(id, theme.id, theme.folderColor)

  let fileName = getIconFilename(id, hash)
  let temporaryFilePath = path.join(temporaryDirectory, type, fileName)

  let iconPath = toRelativePath(
    path.join(config.outputIconsPath, type, fileName),
    config,
  )

  return {
    temporaryFilePath,
    fileName,
    iconPath,
    isLight,
    baseId,
    hash,
    type,
    id,
  }
}
