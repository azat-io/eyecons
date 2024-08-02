import crypto from 'node:crypto'

export let generateHash = (
  icon: string,
  theme: string,
  folderColor: string,
  length = 8,
): string =>
  crypto
    .createHash('sha256')
    .update(`${icon}__${theme}__${folderColor}`)
    .digest('hex')
    .slice(0, Math.max(0, length))
