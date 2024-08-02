import { workspace } from 'vscode'

import { colorNames } from './color-names'

export let getFolderValue = (): string => {
  let folderColor: undefined | string = workspace
    .getConfiguration('eyecons')
    .get('folderColor')
  if (!folderColor || !colorNames.includes(folderColor)) {
    folderColor = 'blue'
  }
  return folderColor
}
