import { workspace } from 'vscode'

export let getHideExplorerArrowValue = (): boolean =>
  workspace.getConfiguration('eyecons').get<boolean>('hidesExplorerArrows') ??
  true
