import { workspace } from 'vscode'

import { console } from '../utils/console'
import { themes } from '../../data/themes'

export let getThemeValue = async (): Promise<string> => {
  let theme: undefined | string = workspace
    .getConfiguration('eyecons')
    .get('theme')

  if (!theme || theme === 'inherit') {
    let userTheme: undefined | string = workspace
      .getConfiguration('workbench')
      .get('colorTheme')
    console.log('User theme', userTheme)
    if (userTheme) {
      let foundTheme = themes.find(
        ({ aliases = [], name }) =>
          userTheme.includes(name) ||
          aliases.some(alias => userTheme.includes(alias)),
      )
      console.log('Use user theme:', JSON.stringify(foundTheme))
      if (foundTheme) {
        theme = foundTheme.id
      } else {
        theme = 'dark'
      }
    } else {
      theme = 'dark'
    }
  }

  return theme
}
