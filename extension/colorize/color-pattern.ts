import { colorsNamed } from 'culori'

let getColorPattern = (): RegExp => {
  let colorKeys = Object.keys(colorsNamed)
  let colorRegexPart = colorKeys
    .reduce((accumulator, color) => `${accumulator}|${color}`, '')
    .slice(1)

  let hexPattern = /#(?<color>[\da-f]{6}|[\da-f]{3})/giu
  return new RegExp(`(${colorRegexPart}|${hexPattern.source})`, 'gi')
}

export let colorPattern = getColorPattern()
