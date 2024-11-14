import type { ExtensionContext } from 'vscode'

import { workspace, commands } from 'vscode'

import { validate } from './build/validate'
import { console } from './utils/console'
import { build } from './build'

let buildInProgress = false

let buildEyecons = async (): Promise<void> => {
  try {
    if (buildInProgress) {
      return
    }
    buildInProgress = true
    let validateValue = await validate()
    console.log('Validate:', validateValue)

    if (!validateValue) {
      await build()
    }
  } catch (error) {
    console.log(error)
  } finally {
    buildInProgress = false
  }
}

export let activate = async (context: ExtensionContext): Promise<void> => {
  console.init()

  try {
    let previousVersion = context.globalState.get<string>('extensionVersion')
    let currentVersion = (
      context.extension.packageJSON as {
        version: string
      }
    ).version

    commands.registerCommand('eyecons.rebuild', build)
    workspace.onDidChangeConfiguration(buildEyecons)

    console.log('Previous version:', previousVersion)
    console.log('Current version:', currentVersion)

    if (previousVersion === currentVersion) {
      await buildEyecons()
    } else {
      await build()
      await context.globalState.update('extensionVersion', currentVersion)
    }
  } catch (error) {
    console.log(error)
  }
}

export let deactivate = (): void => {}
