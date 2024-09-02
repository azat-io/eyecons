import fs from 'node:fs/promises'
import path from 'node:path'

import { getHideExplorerArrowValue } from './get-hide-explorer-arrow-value'
import { getFolderValue } from './get-folder-value'
import { getThemeValue } from './get-theme-value'
import { baseIcons } from '../../data/base-icons'
import { fileIcons } from '../../data/file-icons'
import { generateHash } from './generate-hash'
import { console } from '../utils/console'

export let validate = async (): Promise<boolean> => {
  try {
    let destDir = path.join(__dirname, '../')
    let schema = path.join(destDir, 'index.json')
    console.log('Validating schema', schema)

    let schemaValue = await fs.readFile(schema, 'utf-8')
    if (!schemaValue) {
      return false
    }

    let theme = await getThemeValue()
    let folderValue = getFolderValue()
    let schemaJson = JSON.parse(schemaValue)
    let fileNames: string[] = []

    if (schemaJson.hidesExplorerArrows !== getHideExplorerArrowValue()) {
      return false
    }

    for (let { id } of [baseIcons, fileIcons].flat()) {
      let iconHash = generateHash(id, theme, folderValue)
      let iconDefinition: { iconPath: string } | undefined =
        schemaJson.iconDefinitions[id]
      let fileName = `${id}--${iconHash}.svg`
      if (!iconDefinition?.iconPath.endsWith(fileName)) {
        console.log(
          `Cannot find ${fileName} icon name. Try to rebuild the icons.`,
        )
        return false
      }
      fileNames.push(fileName)
    }

    console.log('All icons file names are correct.')

    let iconFolder = path.join(destDir, 'icons')
    let iconsList = await fs.readdir(iconFolder)

    let countExpectedIcons = (list: { light?: boolean }[]): number =>
      list.reduce((accumulator, { light }) => accumulator + (light ? 2 : 1), 0)

    let receivedIconsLength = iconsList.length
    let expectedIconsLength =
      countExpectedIcons(fileIcons) + countExpectedIcons(baseIcons)

    if (receivedIconsLength !== expectedIconsLength) {
      console.log(
        `The number of icons is not correct. Expected: ${expectedIconsLength}, Received: ${receivedIconsLength}`,
      )
      console.log('Received icons:', JSON.stringify(iconsList, null, 2))
      console.log(
        'Missing icons:',
        [fileIcons, baseIcons]
          .flat()
          .map(({ id }) => id)
          .filter(id => !iconsList.some(icon => icon.includes(id)))
          .join(', '),
      )
      return false
    }
    console.log(
      `The number of icons is correct. Expected: ${expectedIconsLength}, Received: ${receivedIconsLength}`,
    )

    for (let fileName of fileNames) {
      if (!iconsList.includes(fileName)) {
        console.log(`Cannot find ${fileName} file. Try to rebuild the icons.`)
        return false
      }
    }

    return true
  } catch (error) {
    console.log('Validation failed.', error)
    return false
  }
}
