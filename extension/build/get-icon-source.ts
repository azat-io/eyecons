import fs from 'node:fs/promises'
import path from 'node:path'

interface IconOptions {
  type: 'folders' | 'files' | 'base'
  id: string
}

export let getIconSource = async ({ type, id }: IconOptions) => {
  let source = await fs.readFile(
    path.join(__dirname, '../../icons', type, `${id}.svg`),
  )
  return source.toString()
}
