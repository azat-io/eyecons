import * as vscode from 'vscode'

import { logger } from './logger'

const COLOR_NAMES = new Set([
  'orange',
  'yellow',
  'purple',
  'green',
  'blue',
  'red',
])

/**
 * Retrieves the user's configured folder color from settings. If the color is
 * not set or not in the list of valid colors, returns the default 'blue'
 * color.
 *
 * @returns {string} The folder color to use for icon generation.
 */
export let getFolderColor = (): string => {
  let folderLogger = logger.withContext('FolderColor')

  let folderColor: undefined | string = vscode.workspace
    .getConfiguration('eyecons')
    .get('folderColor')

  folderLogger.debug(`Folder color setting: ${folderColor ?? 'not set'}`)

  if (!folderColor || !COLOR_NAMES.has(folderColor)) {
    folderLogger.debug(`Using default folder color: blue`)
    return 'blue'
  }

  folderLogger.debug(`Using folder color: ${folderColor}`)
  return folderColor
}
