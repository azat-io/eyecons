import type { Oklch } from 'culori'

import { getFolderValue } from '../build/get-folder-value'
import { colorNames } from '../build/color-names'
import { toOklch } from './to-oklch'
import { toRgb } from './to-rgb'

let primaryColor = '#ffca28'
let secondaryColor = '#ffa000'

export let recolorFolder = (source: string, colors: string[]): string => {
  let folderColor = getFolderValue()
  let newPrimaryColor = colors[colorNames.indexOf(folderColor)]
  let newSecondaryColor: string | Oklch = toOklch(newPrimaryColor)
  newSecondaryColor.l -= 0.2
  newSecondaryColor = toRgb(newSecondaryColor)

  return source
    .replace(primaryColor, newPrimaryColor)
    .replace(secondaryColor, newSecondaryColor)
}
