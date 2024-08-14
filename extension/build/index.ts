import { setTimeout } from 'node:timers/promises'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'

import { getHideExplorerArrowValue } from './get-hide-explorer-arrow-value'
import { generateThemeData } from './generate-theme-data'
import { generateIcons } from './generate-icons'
import { setupLoading } from './setup-loading'
import { console } from '../utils/console'

export let build = async (): Promise<void> => {
  let destDir = path.join(__dirname, '../')
  let iconsDir = path.join(destDir, './icons')

  await setupLoading({ iconsDir, destDir })

  let tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'eyecons'))

  let iconDefinitions = await generateIcons({ tmpDir })
  let themeData = generateThemeData()

  let hidesExplorerArrows = getHideExplorerArrowValue()

  let schema = {
    folderNamesExpanded: {},
    folderNames: {},
    iconDefinitions,
    ...themeData.dark,
    light: {
      file: 'file-light',
      ...themeData.light,
    },
    buildTime: new Date().toISOString(),
    folderExpanded: 'folder-open',
    hidesExplorerArrows,
    folder: 'folder',
    file: 'file',
  }

  await setTimeout(1000)
  await fs.rm(iconsDir, { recursive: true, force: true })
  await fs.mkdir(iconsDir, { recursive: true })
  await fs.cp(tmpDir, iconsDir, { recursive: true })
  await fs.rm(tmpDir, { recursive: true })

  console.log('Writing index.json', path.join(destDir, 'index.json'))

  await fs.writeFile(
    path.join(destDir, 'index.json'),
    JSON.stringify(schema, null, 2),
  )
}
