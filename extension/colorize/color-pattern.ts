import { colorsNamed } from 'culori'

let getColorPattern = () => {
  let colorKeys = Object.keys(colorsNamed)
  let colorRegexPart = colorKeys
    .reduce((acc, color) => acc + '|' + color, '')
    .slice(1)

  let hexPattern = /#([\da-f]{6}|[\da-f]{3})/gi
  return new RegExp(`(${colorRegexPart}|${hexPattern.source})`, 'gi')
}

export let colorPattern = getColorPattern()
