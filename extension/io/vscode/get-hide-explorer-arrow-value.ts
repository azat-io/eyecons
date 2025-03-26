import { workspace } from 'vscode'

/**
 * Get the value of the `hidesExplorerArrows` setting.
 *
 * @returns {boolean} The value of the `hidesExplorerArrows` setting or true if
 *   not set.
 */
export let getHideExplorerArrowValue = (): boolean =>
  workspace.getConfiguration('eyecons').get<boolean>('hidesExplorerArrows') ??
  true
