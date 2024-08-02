import fs from 'node:fs/promises'
import path from 'node:path'

export let getThemeSource = async (id: string) => {
  let source = await fs.readFile(
    path.join(__dirname, '../../themes', `${id}.json`),
  )
  return JSON.parse(source.toString())
}
