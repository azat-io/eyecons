import type { ExtensionContext } from 'vscode'

import { workspace, commands } from 'vscode'

import { validate } from './build/validate'
import { console } from './utils/console'
import { build } from './build'

let buildInProgress = false

let buildEyecons = async () => {
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
    let currentVersion = context.extension.packageJSON.version

    commands.registerCommand('eyecons.rebuild', build)
    workspace.onDidChangeConfiguration(buildEyecons)

    console.log('Previous version:', previousVersion)
    console.log('Current version:', currentVersion)

    if (previousVersion !== currentVersion) {
      await build()
      context.globalState.update('extensionVersion', currentVersion)
    } else {
      await buildEyecons()
    }
  } catch (error) {
    console.log(error)
  }
}

export let deactivate = () => {}
