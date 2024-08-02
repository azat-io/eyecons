import fs from 'node:fs/promises'
import path from 'node:path'

import { loaderIcon } from './loader-icon'

interface Config {
  iconsDir: string
  destDir: string
}

export let setupLoading = async ({ iconsDir, destDir }: Config) => {
  let loaderIconName = 'loader.svg'
  let schema = {
    iconDefinitions: {
      loader: {
        iconPath: `./icons/${loaderIconName}`,
      },
    },
    hidesExplorerArrows: true,
    folderExpanded: 'loader',
    folder: 'loader',
    file: 'loader',
  }

  await fs.rm(iconsDir, { recursive: true, force: true })
  await fs.mkdir(iconsDir, { recursive: true })
  await fs.writeFile(path.join(iconsDir, loaderIconName), loaderIcon)
  await fs.writeFile(
    path.join(destDir, 'index.json'),
    JSON.stringify(schema, null, 2),
  )
}
