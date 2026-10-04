import type { Vector } from '@texel/color'

import { describe, expect, it } from 'vitest'

import { findClosestColor } from '../../../extension/core/color/find-closest-color'
import { createMockConfig } from '../../helpers/create-mock-config'

describe('findClosestColor', () => {
  let config = createMockConfig()

  let red: Vector = [0.62, 0.25, 25]
  let green: Vector = [0.7, 0.2, 140]
  let blue: Vector = [0.5, 0.2, 260]
  let darkGray: Vector = [0.4, 0.005, 0]
  let lightGray: Vector = [0.8, 0.005, 0]

  it('should return the source color when the palette is empty', () => {
    let sourceColor: Vector = [0.5, 0.2, 180]

    let result = findClosestColor(sourceColor, [], config)

    expect(result).toEqual(sourceColor)
  })

  it('should pick the palette color with the closest hue for a colored source', () => {
    let orangeRed: Vector = [0.6, 0.2, 30]

    let result = findClosestColor(
      orangeRed,
      [green, blue, red, darkGray],
      config,
    )

    expect(result).toEqual(red)
  })

  it('should keep a gray source gray even when a colored palette entry has the same lightness', () => {
    let gray: Vector = [0.55, 0.01, 0]
    let tealOfSameLightness: Vector = [0.55, 0.15, 200]

    let result = findClosestColor(
      gray,
      [lightGray, tealOfSameLightness, darkGray],
      config,
    )

    expect(result).toEqual(darkGray)
  })

  it('should keep a yellow source among yellows even when an orange is nearer in hue', () => {
    let yellow: Vector = [0.7, 0.12, 60]
    let darkOrange: Vector = [0.3, 0.09, 30]
    let olive: Vector = [0.55, 0.09, 100]

    let result = findClosestColor(yellow, [darkOrange, olive], config)

    expect(result).toEqual(olive)
  })

  it('should match a gray source by lightness and ignore the tint of gray palette colors', () => {
    let configWithoutContrast = createMockConfig({
      processing: { ...config.processing, adjustContrast: false },
    })
    let gray: Vector = [0.5, 0.04, 60]
    let lighterYellowishGray: Vector = [0.7, 0.04, 60]
    let darkerBluishGray: Vector = [0.45, 0.04, 250]

    let result = findClosestColor(
      gray,
      [lighterYellowishGray, darkerBluishGray],
      configWithoutContrast,
    )

    expect(result).toEqual(darkerBluishGray)
  })

  it('should fall back to gray palette colors when the palette has no colored entries', () => {
    let orangeRed: Vector = [0.6, 0.2, 30]
    let middleGray: Vector = [0.65, 0.005, 0]

    let result = findClosestColor(orangeRed, [darkGray, middleGray], config)

    expect(result).toEqual(middleGray)
  })

  it('should boost the chroma of a dull closest color by the saturation factor', () => {
    let dullBlue: Vector = [0.5, 0.03, 200]
    let expectedChroma = 0.036

    let result = findClosestColor(dullBlue, [dullBlue, lightGray], config)

    expect(result).toEqual([0.5, expect.closeTo(expectedChroma), 200])
  })
})
