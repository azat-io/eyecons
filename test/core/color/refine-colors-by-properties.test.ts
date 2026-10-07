import type { Vector } from '@texel/color'

import { describe, expect, it } from 'vitest'

import { refineColorsByProperties } from '../../../extension/core/color/refine-colors-by-properties'

describe('refineColorsByProperties', () => {
  it('should return an empty palette as is', () => {
    let purple: Vector = [0.5, 0.1, 300]

    expect(refineColorsByProperties(purple, [])).toEqual([])
  })

  it('should return a single-color palette as is', () => {
    let purple: Vector = [0.5, 0.1, 300]
    let palette: Vector[] = [[0.6, 0.15, 280]]

    expect(refineColorsByProperties(purple, palette)).toEqual(palette)
  })

  it('should keep only saturated purples for a purple source', () => {
    let purple: Vector = [0.5, 0.08, 300]
    let dullViolet: Vector = [0.6, 0.06, 260]
    let saturatedPurple: Vector = [0.5, 0.08, 300]
    let dullPurple: Vector = [0.7, 0.06, 300]
    let blue: Vector = [0.4, 0.09, 200]

    let result = refineColorsByProperties(purple, [
      dullViolet,
      saturatedPurple,
      dullPurple,
      blue,
    ])

    expect(result).toEqual([saturatedPurple])
  })

  it('should keep only saturated colors of a similar hue for a saturated yellow source', () => {
    let yellow: Vector = [0.7, 0.09, 60]
    let orangeYellow: Vector = [0.6, 0.09, 50]
    let dullYellow: Vector = [0.5, 0.07, 70]
    let cyan: Vector = [0.7, 0.09, 180]

    let result = refineColorsByProperties(yellow, [
      orangeYellow,
      dullYellow,
      cyan,
    ])

    expect(result).toEqual([orangeYellow])
  })

  it('should keep only saturated colors of a similar hue for a bright saturated source', () => {
    let brightCyan: Vector = [0.85, 0.15, 180]
    let cyan: Vector = [0.7, 0.1, 185]
    let dullGreen: Vector = [0.6, 0.08, 165]
    let blue: Vector = [0.5, 0.12, 250]

    let result = refineColorsByProperties(brightCyan, [cyan, dullGreen, blue])

    expect(result).toEqual([cyan])
  })

  it('should compare hues across the start of the color wheel', () => {
    let brightRed: Vector = [0.85, 0.15, 350]
    let orangeRed: Vector = [0.7, 0.12, 10]
    let purple: Vector = [0.7, 0.12, 300]

    let result = refineColorsByProperties(brightRed, [purple, orangeRed])

    expect(result).toEqual([orangeRed])
  })

  it('should keep only highly saturated colors for a highly saturated source', () => {
    let saturatedCyan: Vector = [0.5, 0.2, 180]
    let teal: Vector = [0.6, 0.15, 185]
    let dullCyan: Vector = [0.5, 0.08, 180]
    let turquoise: Vector = [0.7, 0.16, 190]

    let result = refineColorsByProperties(saturatedCyan, [
      teal,
      dullCyan,
      turquoise,
    ])

    expect(result).toEqual([teal, turquoise])
  })

  it('should keep only light saturated colors for a bright moderately saturated source', () => {
    let paleCyan: Vector = [0.85, 0.06, 180]
    let lightCyan: Vector = [0.75, 0.09, 185]
    let darkCyan: Vector = [0.65, 0.09, 180]
    let paleTeal: Vector = [0.8, 0.07, 190]

    let result = refineColorsByProperties(paleCyan, [
      lightCyan,
      darkCyan,
      paleTeal,
    ])

    expect(result).toEqual([lightCyan])
  })

  it('should try the next refinement when a matching one keeps no colors', () => {
    let brightPurple: Vector = [0.85, 0.15, 300]
    let saturatedPink: Vector = [0.6, 0.12, 345]
    let dullPurple: Vector = [0.5, 0.05, 300]

    let result = refineColorsByProperties(brightPurple, [
      saturatedPink,
      dullPurple,
    ])

    expect(result).toEqual([saturatedPink])
  })

  it('should keep the palette when no refinement keeps any color', () => {
    let purple: Vector = [0.6, 0.08, 300]
    let palette: Vector[] = [
      [0.5, 0.05, 200],
      [0.55, 0.06, 150],
      [0.52, 0.04, 90],
    ]

    let result = refineColorsByProperties(purple, palette)

    expect(result).toBe(palette)
  })

  it('should keep the palette when no refinement applies to the source', () => {
    let dullCyan: Vector = [0.5, 0.04, 180]
    let palette: Vector[] = [
      [0.6, 0.05, 185],
      [0.5, 0.04, 180],
    ]

    let result = refineColorsByProperties(dullCyan, palette)

    expect(result).toBe(palette)
  })

  it('should keep the palette for a dull yellowish source', () => {
    let dullYellow: Vector = [0.5, 0.04, 100]
    let palette: Vector[] = [
      [0.6, 0.12, 95],
      [0.5, 0.04, 100],
    ]

    let result = refineColorsByProperties(dullYellow, palette)

    expect(result).toBe(palette)
  })

  it('should keep the palette for a moderately saturated source of medium lightness', () => {
    let blue: Vector = [0.5, 0.12, 200]
    let palette: Vector[] = [
      [0.5, 0.12, 210],
      [0.5, 0.09, 260],
    ]

    let result = refineColorsByProperties(blue, palette)

    expect(result).toBe(palette)
  })
})
