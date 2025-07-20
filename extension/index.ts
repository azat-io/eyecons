import type { ExtensionContext } from 'vscode'

import { workspace, commands } from 'vscode'

import type { Config } from './types/config'
import type { Theme } from './types/theme'

import { buildIcons } from './core/build/build-icons'
import { getConfig } from './core/build/get-config'
import { validate } from './core/validate/validate'
import { getTheme } from './core/build/get-theme'
import { logger } from './io/vscode/logger'

let buildInProgress = false

export async function activate(context: ExtensionContext): Promise<void> {
  logger.init()

  async function buildEyecons(): Promise<void> {
    try {
      if (buildInProgress) {
        return
      }
      let config: Config = getConfig(context)
      let theme: Theme = await getTheme()

      buildInProgress = true

      let validationResult = await validate(theme, config)
      logger.info(
        `Validation result: ${validationResult.isValid ? 'valid' : 'invalid'}`,
      )

      if (validationResult.reason) {
        logger.info(`Validation reason: ${validationResult.reason}`)
      }

      if (!validationResult.isValid) {
        await buildIcons(theme, config)
      }
    } catch (error) {
      logger.error(
        `Error during build: ${error instanceof Error ? error.message : String(error)}`,
      )
    } finally {
      buildInProgress = false
    }
  }

  async function forceBuild(): Promise<void> {
    let config: Config = getConfig(context)
    let theme: Theme = await getTheme()

    await buildIcons(theme, config)
  }

  commands.registerCommand('eyecons.rebuild', forceBuild)
  workspace.onDidChangeConfiguration(buildEyecons)

  await buildEyecons()
}

export function deactivate(): void {}
