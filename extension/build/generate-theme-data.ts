import { fileIcons } from '../../data/file-icons'

interface IconSchema {
  fileExtensions: {
    [key: string]: string
  }
  fileNames: {
    [key: string]: string
  }
}

let defineIconSchema = (): IconSchema => ({
  fileExtensions: {},
  fileNames: {},
})

export let generateThemeData = () => {
  let themeData: {
    light: IconSchema
    dark: IconSchema
  } = {
    light: defineIconSchema(),
    dark: defineIconSchema(),
  }

  return fileIcons.reduce((accumulator, icon) => {
    if (icon.extensions) {
      icon.extensions.forEach(extension => {
        accumulator.dark.fileExtensions[extension] = icon.id
        if (icon.light) {
          accumulator.light.fileExtensions[extension] = `${icon.id}-light`
        }
      })
    }
    if (icon.files) {
      icon.files.forEach(file => {
        accumulator.dark.fileNames[file] = icon.id
        if (icon.light) {
          accumulator.light.fileNames[file] = `${icon.id}-light`
        }
      })
    }

    return accumulator
  }, themeData)
}
