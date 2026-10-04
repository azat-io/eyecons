import type { Vector } from '@texel/color'

import { describe, expect, it } from 'vitest'

import type { ColorComponents } from '../../../extension/types/color'

import { calculateWeightedDistance } from '../../../extension/core/color/calculate-weighted-distance'
import { createMockConfig } from '../../helpers/create-mock-config'

describe('calculateWeightedDistance', () => {
  let config = createMockConfig()

  let noWeights: ColorComponents = { lightness: 0, chroma: 0, hue: 0 }
  let hueOnly: ColorComponents = { lightness: 0, chroma: 0, hue: 1 }

  /**
   * Measures the distance between two colors.
   *
   * @param color1 - Color the distance is measured from.
   * @param color2 - Color the distance is measured to.
   * @param weights - Weights for each component.
   * @returns Weighted distance between the colors.
   */
  function distance(
    color1: Vector,
    color2: Vector,
    weights: ColorComponents,
  ): number {
    return calculateWeightedDistance({ weights, config, color1, color2 })
  }

  /**
   * Measures only the hue part of the distance between two moderately saturated
   * colors that differ in hue alone.
   *
   * @param hue1 - Hue the distance is measured from.
   * @param hue2 - Hue the distance is measured to.
   * @returns Distance caused by the hue difference.
   */
  function hueDistance(hue1: number, hue2: number): number {
    return distance([0.5, 0.08, hue1], [0.5, 0.08, hue2], hueOnly)
  }

  describe('lightness and chroma', () => {
    it('should measure the lightness difference', () => {
      let expectedDistance = 0.2

      let result = distance([0.5, 0, 0], [0.7, 0, 0], {
        ...noWeights,
        lightness: 1,
      })

      expect(result).toBeCloseTo(expectedDistance)
    })

    it('should measure the chroma difference', () => {
      let expectedDistance = 0.2

      let result = distance([0.5, 0.2, 180], [0.5, 0.4, 180], {
        ...noWeights,
        chroma: 1,
      })

      expect(result).toBeCloseTo(expectedDistance)
    })

    it('should find no distance between identical colors', () => {
      let color: Vector = [0.5, 0.2, 180]

      expect(distance(color, color, { lightness: 1, chroma: 1, hue: 1 })).toBe(
        0,
      )
    })
  })

  describe('hue', () => {
    it('should ignore the hue of near-gray colors', () => {
      let result = distance([0.5, 0.01, 180], [0.5, 0.01, 270], hueOnly)

      expect(result).toBe(0)
    })

    it('should grow with the hue difference', () => {
      expect(hueDistance(200, 220)).toBeLessThan(hueDistance(200, 240))
      expect(hueDistance(200, 240)).toBeLessThan(hueDistance(200, 280))
    })

    it('should treat hues on both sides of the start of the color wheel as close', () => {
      expect(hueDistance(0, 359)).toBeCloseTo(hueDistance(0, 1))
    })

    it.each([
      { step: 'from yellow towards green', blues: [200, 220], hues: [95, 115] },
      { step: 'from yellow towards orange', blues: [200, 260], hues: [95, 35] },
      { step: 'from yellow-green', blues: [200, 220], hues: [60, 80] },
      { step: 'from a warm orange', blues: [200, 220], hues: [30, 50] },
      { step: 'between purples', blues: [200, 220], hues: [300, 320] },
      { step: 'from purple towards red', blues: [200, 280], hues: [300, 20] },
      { step: 'from red towards purple', blues: [200, 280], hues: [10, 290] },
    ] as { blues: [number, number]; hues: [number, number]; step: string }[])(
      'should weigh a hue step $step more than the same step between blues',
      ({ blues, hues }) => {
        expect(hueDistance(...hues)).toBeGreaterThan(hueDistance(...blues))
      },
    )

    it('should weigh a hue step within yellow like the same step between blues', () => {
      expect(hueDistance(95, 75)).toBeCloseTo(hueDistance(200, 220))
    })
  })

  describe('penalties', () => {
    it.each([
      [
        'a saturated color to a near-gray one',
        [0.5, 0.2, 180],
        [0.5, 0.01, 180],
      ],
      [
        'a near-gray color to a saturated one',
        [0.5, 0.01, 180],
        [0.5, 0.2, 180],
      ],
      [
        'a slightly saturated color to a dull one',
        [0.5, 0.06, 180],
        [0.5, 0.04, 180],
      ],
      [
        'a dull color to a slightly saturated one',
        [0.5, 0.04, 180],
        [0.5, 0.06, 180],
      ],
    ] as [string, Vector, Vector][])(
      'should penalize matching %s',
      (_, color1, color2) => {
        expect(distance(color1, color2, noWeights)).toBeGreaterThan(0)
      },
    )

    it('should not penalize matching two saturated colors of the same hue', () => {
      let result = distance([0.5, 0.2, 180], [0.5, 0.4, 180], noWeights)

      expect(result).toBe(0)
    })

    it('should penalize saturated colors with very different hues', () => {
      let result = distance([0.5, 0.15, 0], [0.5, 0.15, 180], noWeights)

      expect(result).toBeGreaterThan(0)
    })

    it('should not penalize saturated colors with moderately different hues', () => {
      let result = distance([0.5, 0.15, 0], [0.5, 0.15, 40], noWeights)

      expect(result).toBe(0)
    })
  })
})
