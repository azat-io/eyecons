import { describe, expect, it } from 'vitest'

import {
  COLOR_THRESHOLDS,
  COLOR_WEIGHTS,
} from '../../../extension/core/color/constants'
import { determineColorWeights } from '../../../extension/core/color/determine-color-weights'

describe('determineColorWeights', () => {
  it('should return ACHROMATIC weights for achromatic colors', () => {
    let achromatic: [number, number, number] = [0.5, 0.02, 180]
    let isAchromatic = true

    let result = determineColorWeights(achromatic, isAchromatic)

    expect(result).toEqual(COLOR_WEIGHTS.ACHROMATIC)
  })

  it('should return PURPLE_PINK_FAMILY weights for purples and pinks', () => {
    let purple: [number, number, number] = [0.6, 0.08, 290]
    let pinkMagenta: [number, number, number] = [0.7, 0.1, 320]
    let redPink: [number, number, number] = [0.65, 0.09, 355]
    let pinkRed: [number, number, number] = [0.65, 0.09, 10]

    expect(determineColorWeights(purple, false)).toEqual(
      COLOR_WEIGHTS.PURPLE_PINK_FAMILY,
    )
    expect(determineColorWeights(pinkMagenta, false)).toEqual(
      COLOR_WEIGHTS.PURPLE_PINK_FAMILY,
    )
    expect(determineColorWeights(redPink, false)).toEqual(
      COLOR_WEIGHTS.PURPLE_PINK_FAMILY,
    )
    expect(determineColorWeights(pinkRed, false)).toEqual(
      COLOR_WEIGHTS.PURPLE_PINK_FAMILY,
    )

    let lowChromaPurple: [number, number, number] = [0.6, 0.06, 290]
    expect(determineColorWeights(lowChromaPurple, false)).not.toEqual(
      COLOR_WEIGHTS.PURPLE_PINK_FAMILY,
    )
  })

  it('should return YELLOW_FAMILY weights for yellow colors', () => {
    let yellow: [number, number, number] = [0.8, 0.09, 85]
    let yellowGreen: [number, number, number] = [0.7, 0.1, 105]
    let yellowOrange: [number, number, number] = [0.75, 0.12, 45]

    expect(determineColorWeights(yellow, false)).toEqual(
      COLOR_WEIGHTS.YELLOW_FAMILY,
    )
    expect(determineColorWeights(yellowGreen, false)).toEqual(
      COLOR_WEIGHTS.YELLOW_FAMILY,
    )
    expect(determineColorWeights(yellowOrange, false)).toEqual(
      COLOR_WEIGHTS.YELLOW_FAMILY,
    )

    let lowChromaYellow: [number, number, number] = [0.8, 0.07, 85]
    expect(determineColorWeights(lowChromaYellow, false)).not.toEqual(
      COLOR_WEIGHTS.YELLOW_FAMILY,
    )

    let green: [number, number, number] = [0.7, 0.1, 130]
    let orange: [number, number, number] = [0.7, 0.1, 35]
    expect(determineColorWeights(green, false)).not.toEqual(
      COLOR_WEIGHTS.YELLOW_FAMILY,
    )
    expect(determineColorWeights(orange, false)).not.toEqual(
      COLOR_WEIGHTS.YELLOW_FAMILY,
    )
  })

  it('should return BRIGHT_CHROMATIC weights for bright saturated colors', () => {
    let brightBlue: [number, number, number] = [0.85, 0.15, 240]
    let brightRed: [number, number, number] = [0.82, 0.2, 10]

    expect(determineColorWeights(brightBlue, false)).toEqual(
      COLOR_WEIGHTS.BRIGHT_CHROMATIC,
    )
    expect(determineColorWeights(brightRed, false)).toEqual(
      COLOR_WEIGHTS.BRIGHT_CHROMATIC,
    )

    let mediumBlue: [number, number, number] = [0.7, 0.15, 240]
    expect(determineColorWeights(mediumBlue, false)).not.toEqual(
      COLOR_WEIGHTS.BRIGHT_CHROMATIC,
    )

    let brightLowChroma: [number, number, number] = [0.85, 0.09, 240]
    expect(determineColorWeights(brightLowChroma, false)).not.toEqual(
      COLOR_WEIGHTS.BRIGHT_CHROMATIC,
    )
  })

  it('should return HIGH_SATURATION weights for highly saturated colors', () => {
    let highSaturationThreshold = COLOR_THRESHOLDS.HIGH_SATURATION

    let highlySaturated: [number, number, number] = [
      0.5,
      highSaturationThreshold + 0.01,
      180,
    ]

    expect(determineColorWeights(highlySaturated, false)).toEqual(
      COLOR_WEIGHTS.HIGH_SATURATION,
    )

    let belowThreshold: [number, number, number] = [
      0.5,
      highSaturationThreshold - 0.01,
      180,
    ]
    expect(determineColorWeights(belowThreshold, false)).not.toEqual(
      COLOR_WEIGHTS.HIGH_SATURATION,
    )
  })

  it('should return LOW_SATURATION weights for colors with low saturation', () => {
    let mediumSaturationThreshold = COLOR_THRESHOLDS.MEDIUM_SATURATION

    let lowSaturation: [number, number, number] = [
      0.5,
      mediumSaturationThreshold - 0.01,
      180,
    ]

    expect(determineColorWeights(lowSaturation, false)).toEqual(
      COLOR_WEIGHTS.LOW_SATURATION,
    )

    let aboveThreshold: [number, number, number] = [
      0.5,
      mediumSaturationThreshold + 0.01,
      180,
    ]
    expect(determineColorWeights(aboveThreshold, false)).not.toEqual(
      COLOR_WEIGHTS.LOW_SATURATION,
    )
  })

  it('should return CHROMATIC weights for medium-saturation colors', () => {
    let mediumSaturationThreshold = COLOR_THRESHOLDS.MEDIUM_SATURATION
    let highSaturationThreshold = COLOR_THRESHOLDS.HIGH_SATURATION

    let mediumSaturation: [number, number, number] = [
      0.5,
      (mediumSaturationThreshold + highSaturationThreshold) / 2,
      180,
    ]

    expect(determineColorWeights(mediumSaturation, false)).toEqual(
      COLOR_WEIGHTS.CHROMATIC,
    )
  })

  it('should use the correct order of precedence for overlapping cases', () => {
    let brightYellow: [number, number, number] = [0.85, 0.15, 85]

    expect(determineColorWeights(brightYellow, false)).toEqual(
      COLOR_WEIGHTS.BRIGHT_CHROMATIC,
    )

    let mediumBrightYellow: [number, number, number] = [0.75, 0.15, 85]

    expect(determineColorWeights(mediumBrightYellow, false)).toEqual(
      COLOR_WEIGHTS.YELLOW_FAMILY,
    )

    let brightPurple: [number, number, number] = [0.85, 0.2, 290]
    let mediumPurple: [number, number, number] = [0.7, 0.2, 290]

    expect(determineColorWeights(brightPurple, false)).toEqual(
      COLOR_WEIGHTS.BRIGHT_CHROMATIC,
    )
    expect(determineColorWeights(mediumPurple, false)).toEqual(
      COLOR_WEIGHTS.PURPLE_PINK_FAMILY,
    )
  })
})
