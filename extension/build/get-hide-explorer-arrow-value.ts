import { workspace } from 'vscode'

export let getHideExplorerArrowValue = (): boolean =>
  workspace.getConfiguration('eyecons').get<boolean>('hideExplorerArrows') ??
  true
