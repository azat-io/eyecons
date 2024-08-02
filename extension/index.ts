import { workspace, commands } from 'vscode'

import { console } from './utils/console'
import { build } from './build'

export let activate = async () => {
  console.init()
  try {
    commands.registerCommand('eyecons.rebuild', build)
    workspace.onDidChangeConfiguration(build)
    await build()
  } catch (error) {
    console.log(error)
  }
}

export let deactivate = () => {}
