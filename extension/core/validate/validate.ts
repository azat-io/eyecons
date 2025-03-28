import fs from 'node:fs/promises'
import path from 'node:path'

import type { ThemeSchema, Theme } from '../../types/theme'
import type { Config } from '../../types/config'

import { getHideExplorerArrowValue } from '../../io/vscode/get-hide-explorer-arrow-value'
import { getIconFilename } from '../../core/icon/get-icon-filename'
import { generateHash } from '../hash/generate-hash'
import { baseIcons } from '../../../data/base-icons'
import { fileIcons } from '../../../data/file-icons'
import { logger } from '../../io/vscode/logger'

interface ValidationResult {
  isValid: boolean
  reason?: string
}

/**
 * Checks if a file or directory exists.
 *
 * @param {string} pathName - Path to check.
 * @returns {Promise<boolean>} True if the file or directory exists, false
 *   otherwise.
 */
let fileExists = async (pathName: string): Promise<boolean> => {
  try {
    await fs.access(pathName)
    return true
  } catch {
    return false
  }
}

/**
 * Validates if the current icon theme is up-to-date and doesn't need
 * rebuilding.
 *
 * @param {Theme} theme - Current VS Code theme and its colors.
 * @param {Config} config - Extension configuration.
 * @returns {Promise<ValidationResult>} Result indicating if the theme is valid
 *   and reason if not.
 */
export let validate = async (
  theme: Theme,
  config: Config,
): Promise<ValidationResult> => {
  let validateLogger = logger.withContext('Validate')
  validateLogger.info('Validating icon theme')

  try {
    if (!(await fileExists(config.iconDefinitionsPath))) {
      return {
        reason: 'Icon definitions file does not exist',
        isValid: false,
      }
    }

    let schemaContent = await fs.readFile(config.iconDefinitionsPath, 'utf8')
    let schema = JSON.parse(schemaContent) as ThemeSchema

    if (!schema.buildTime) {
      return {
        reason: 'Build time not found in schema',
        isValid: false,
      }
    }

    if (schema.version !== config.version) {
      return {
        reason: `Version mismatch: ${schema.version} vs ${config.version}`,
        isValid: false,
      }
    }

    if (schema.folderColor !== theme.folderColor) {
      return {
        reason: `Folder color mismatch: ${
          schema.folderColor
        } vs ${theme.folderColor}`,
        isValid: false,
      }
    }

    let hidesExplorerArrows = getHideExplorerArrowValue()
    if (schema.hidesExplorerArrows !== hidesExplorerArrows) {
      return {
        reason: `Explorer arrows setting mismatch: ${
          schema.hidesExplorerArrows
        } vs ${hidesExplorerArrows}`,
        isValid: false,
      }
    }

    if (!(await fileExists(config.outputIconsPath))) {
      return {
        reason: 'Output icons directory does not exist',
        isValid: false,
      }
    }

    let allIcons = [...baseIcons, ...fileIcons]

    let iconValidations: {
      expectedFileName: string
      iconPath: string
      iconId: string
    }[] = []

    for (let { light, id } of allIcons) {
      let iconIds = light ? [id, `${id}-light`] : [id]

      for (let iconId of iconIds) {
        let hash = generateHash(iconId, theme.id, theme.folderColor)
        let fileName = getIconFilename(iconId, hash)

        let iconDefinition = schema.iconDefinitions[iconId]
        if (!iconDefinition) {
          return {
            reason: `Icon definition for ${iconId} not found`,
            isValid: false,
          }
        }

        if (!iconDefinition.iconPath.endsWith(fileName)) {
          return {
            reason: `Icon path for ${
              iconId
            } does not match expected filename: ${fileName}`,
            isValid: false,
          }
        }

        let iconType =
          id.startsWith('file') || id.startsWith('folder') ? 'base' : 'files'
        let iconPath = path.join(config.outputIconsPath, iconType, fileName)

        iconValidations.push({
          expectedFileName: fileName,
          iconPath,
          iconId,
        })
      }
    }

    let existenceChecks = await Promise.all(
      iconValidations.map(async ({ iconPath }) => {
        let exists = await fileExists(iconPath)
        return { iconPath, exists }
      }),
    )

    for (let { iconPath, exists } of existenceChecks) {
      if (!exists) {
        return {
          reason: `Icon file not found: ${iconPath}`,
          isValid: false,
        }
      }
    }

    validateLogger.info('Icon theme is valid and up-to-date')
    return { isValid: true }
  } catch (error) {
    validateLogger.error(
      `Validation failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
    return {
      reason: `Validation error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      isValid: false,
    }
  }
}
