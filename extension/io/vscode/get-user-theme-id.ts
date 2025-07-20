import * as vscode from 'vscode'

import { themes } from '../../../data/themes'
import { logger } from './logger'

/**
 * Determines the theme ID based on user's settings and current VS Code theme.
 * If the user has specified a theme in extension settings, it will be used.
 * Otherwise, it will try to detect the current VS Code theme.
 *
 * @returns {Promise<string>} Theme ID to use for icon generation.
 */
export function getUserThemeId(): string {
  let themeLogger = logger.withContext('UserTheme')

  let themeSetting: undefined | string = vscode.workspace
    .getConfiguration('eyecons')
    .get('theme')

  themeLogger.debug(`Theme setting: ${themeSetting ?? 'not set'}`)

  if (themeSetting && themeSetting !== 'inherit') {
    themeLogger.debug(`Using explicitly configured theme: ${themeSetting}`)
    return themeSetting
  }

  let userTheme: undefined | string = vscode.workspace
    .getConfiguration('workbench')
    .get('colorTheme')

  themeLogger.debug(`User VS Code theme: ${userTheme ?? 'unknown'}`)

  if (userTheme) {
    let foundTheme = themes.find(
      ({ aliases, name }) =>
        userTheme.includes(name) ||
        aliases?.some(alias => userTheme.includes(alias)),
    )

    if (foundTheme) {
      themeLogger.debug(
        `Matched user theme to: ${foundTheme.name} (${foundTheme.id})`,
      )
      return foundTheme.id
    }
  }

  themeLogger.debug('No matching theme found, using default "dark"')

  return 'dark'
}
