import type { Vector } from '@texel/color'

import { describe, expect, it } from 'vitest'

import { categorizeColorsByHue } from '../../../extension/core/color/categorize-colors-by-hue'

describe('categorizeColorsByHue', () => {
  let emptyCategories = {
    yellowGreen: [],
    magenta: [],
    orange: [],
    yellow: [],
    purple: [],
    green: [],
    cyan: [],
    blue: [],
    red: [],
  }

  it('should sort colors into their hue categories', () => {
    let red: Vector = [0.5, 0.1, 15]
    let orange: Vector = [0.6, 0.08, 30]
    let yellow: Vector = [0.7, 0.15, 60]
    let yellowGreen: Vector = [0.6, 0.12, 102]
    let green: Vector = [0.5, 0.1, 120]
    let cyan: Vector = [0.6, 0.09, 180]
    let blue: Vector = [0.4, 0.11, 220]
    let purple: Vector = [0.5, 0.14, 270]
    let magenta: Vector = [0.6, 0.13, 300]

    let result = categorizeColorsByHue([
      magenta,
      green,
      red,
      cyan,
      yellow,
      purple,
      orange,
      blue,
      yellowGreen,
    ])

    expect(result).toEqual({
      yellowGreen: [yellowGreen],
      magenta: [magenta],
      orange: [orange],
      yellow: [yellow],
      purple: [purple],
      green: [green],
      cyan: [cyan],
      blue: [blue],
      red: [red],
    })
  })

  it('should keep several colors of one category together', () => {
    let azure: Vector = [0.6, 0.15, 220]
    let navy: Vector = [0.3, 0.12, 250]

    let result = categorizeColorsByHue([azure, navy])

    expect(result).toEqual({ ...emptyCategories, blue: [azure, navy] })
  })

  it('should leave out colors too dull for their hue to matter', () => {
    let dullGreen: Vector = [0.5, 0.02, 120]
    let barelyCyan: Vector = [0.6, 0.03, 180]
    let paleBlue: Vector = [0.7, 0.04, 240]

    let result = categorizeColorsByHue([dullGreen, barelyCyan, paleBlue])

    expect(result).toEqual({
      ...emptyCategories,
      cyan: [barelyCyan],
      blue: [paleBlue],
    })
  })

  it('should put colors without a usable hue into red', () => {
    let withoutHue = [0.5, 0.1] as Vector
    let withUndefinedHue: Vector = [0.6, 0.08, Number.NaN]

    let result = categorizeColorsByHue([withoutHue, withUndefinedHue])

    expect(result).toEqual({
      ...emptyCategories,
      red: [withoutHue, withUndefinedHue],
    })
  })

  it('should return every category empty for an empty palette', () => {
    expect(categorizeColorsByHue([])).toEqual(emptyCategories)
  })
})
