import { workspace } from 'vscode'

/**
 * Get the value of the `hidesExplorerArrows` setting.
 *
 * @returns The value of the `hidesExplorerArrows` setting or true if not set.
 */
export function getHideExplorerArrowValue(): boolean {
  return (
    workspace.getConfiguration('eyecons').get<boolean>('hidesExplorerArrows') ??
    true
  )
}
