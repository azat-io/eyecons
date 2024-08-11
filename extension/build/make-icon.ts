import { retryAsync } from 'ts-retry'
import fs from 'node:fs/promises'
import path from 'node:path'

import { getThemeSource } from './get-theme-source'
import { getFolderValue } from './get-folder-value'
import { getIconSource } from './get-icon-source'
import { generateHash } from './generate-hash'
import { console } from '../utils/console'
import { colorize } from '../colorize'

interface IconOptions {
  type: 'folders' | 'files' | 'base'
  id: string
}

interface Config {
  tmpDir: string
}

export let makeIcon = async (
  icon: IconOptions,
  config: Config,
  themeValue: string,
  callback: (data: { fileName: string } & IconOptions) => void,
): Promise<void> => {
  let source = await getIconSource(icon)
  let theme = await getThemeSource(themeValue)
  let folderColor = getFolderValue()
  let id = generateHash(icon.id, themeValue, folderColor)
  let fileName = `${icon.id}--${id}.svg`

  await retryAsync(
    async () => {
      console.log(`Making icon: ${icon.id}`)
      try {
        await fs.writeFile(
          path.join(config.tmpDir, fileName),
          await colorize(icon.id, theme, source),
        )
      } catch (error) {
        console.log(`Error making icon: ${icon.id}`, error)
      }
    },
    {
      delay: 100,
      maxTry: 5,
    },
  )

  callback({
    ...icon,
    fileName,
  })
}
