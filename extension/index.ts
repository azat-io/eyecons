import { workspace, commands } from 'vscode'

import { validate } from './build/validate'
import { console } from './utils/console'
import { build } from './build'

let buildEyecons = async () => {
  try {
    let validateValue = await validate()
    console.log('Validate:', validateValue)

    if (!validateValue) {
      await build()
    }
  } catch (error) {
    console.log(error)
  }
}

export let activate = async () => {
  console.init()

  try {
    commands.registerCommand('eyecons.rebuild', build)
    workspace.onDidChangeConfiguration(buildEyecons)

    buildEyecons()
  } catch (error) {
    console.log(error)
  }
}

export let deactivate = () => {}
