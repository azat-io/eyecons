import type { Vector } from '@texel/color'

import { describe, expect, it } from 'vitest'

import type { ColorComponents } from '../../../extension/types/color'
import type { Config } from '../../../extension/types/config'

import { calculateWeightedDistance } from '../../../extension/core/color/calculate-weighted-distance'

describe('calculateWeightedDistance', () => {
  let mockConfig: Config = {
    processing: {
      extremeLightnessThresholds: { light: 0.95, dark: 0.05 },
      lowSaturationThreshold: 0.05,
      saturationFactor: 1.2,
      adjustContrast: true,
    },
  } as Config

  let weights: ColorComponents = {
    lightness: 1,
    chroma: 1,
    hue: 1,
  }

  describe('basic distance calculations', () => {
    it('should calculate lightness difference correctly', () => {
      let color1: Vector = [0.5, 0, 0]
      let color2: Vector = [0.7, 0, 0]

      let distance = calculateWeightedDistance({
        weights: { ...weights, chroma: 0, hue: 0 },
        config: mockConfig,
        color1,
        color2,
      })

      expect(distance).toBeCloseTo(0.2, 2)
    })

    it('should calculate chroma difference correctly', () => {
      let color1: Vector = [0.5, 0.2, 180]
      let color2: Vector = [0.5, 0.4, 180]

      let distance = calculateWeightedDistance({
        weights: { ...weights, lightness: 0, hue: 0 },
        config: mockConfig,
        color1,
        color2,
      })

      expect(distance).toBeCloseTo(0.2, 2)
    })

    it('should ignore hue when chroma is too low', () => {
      let color1: Vector = [0.5, 0.01, 180]
      let color2: Vector = [0.5, 0.01, 270]

      let distance = calculateWeightedDistance({
        config: mockConfig,
        weights,
        color1,
        color2,
      })

      expect(distance).toBeCloseTo(0, 2)
    })
  })

  describe('hue difference handling', () => {
    it('should handle yellow hues (90-105) specially', () => {
      let color1: Vector = [0.5, 0.2, 95]
      let color2: Vector = [0.5, 0.2, 120]

      let distance1 = calculateWeightedDistance({
        config: mockConfig,
        weights,
        color1,
        color2,
      })

      let color3: Vector = [0.5, 0.2, 30]
      let distance2 = calculateWeightedDistance({
        config: mockConfig,
        color2: color3,
        weights,
        color1,
      })

      expect(distance1).toBeGreaterThan(0)
      expect(distance2).toBeGreaterThan(distance1)
    })

    it('should handle yellow-green hues (40-110) with special weight', () => {
      let color1: Vector = [0.5, 0.2, 75]
      let color2: Vector = [0.5, 0.2, 150]

      let distance = calculateWeightedDistance({
        config: mockConfig,
        weights,
        color1,
        color2,
      })

      expect(distance).toBeGreaterThan(0)
    })

    it('should handle red-purple hues specially', () => {
      let color1: Vector = [0.5, 0.2, 300]
      let color2: Vector = [0.5, 0.2, 355]

      let distance = calculateWeightedDistance({
        config: mockConfig,
        weights,
        color1,
        color2,
      })

      expect(distance).toBeGreaterThan(0.5)
    })
  })

  describe('chroma penalty handling', () => {
    it('should apply penalty when comparing chromatic to achromatic colors', () => {
      let color1: Vector = [0.5, 0.2, 180]
      let color2: Vector = [0.5, 0.01, 180]

      let distance = calculateWeightedDistance({
        config: mockConfig,
        weights,
        color1,
        color2,
      })

      expect(distance).toBeGreaterThan(0.19)
    })

    it('should apply extra penalty for low saturation differences', () => {
      let color1: Vector = [0.5, 0.06, 180]
      let color2: Vector = [0.5, 0.04, 180]

      let distance = calculateWeightedDistance({
        config: mockConfig,
        weights,
        color1,
        color2,
      })

      expect(distance).toBeGreaterThan(0.02)
    })

    it('should apply hue-based penalty for saturated colors with large hue difference', () => {
      let color1: Vector = [0.5, 0.15, 0]
      let color2: Vector = [0.5, 0.15, 180]

      let distance = calculateWeightedDistance({
        config: mockConfig,
        weights,
        color1,
        color2,
      })

      expect(distance).toBeGreaterThan(1)
    })
  })

  describe('edge cases', () => {
    it('should handle identical colors', () => {
      let color: Vector = [0.5, 0.2, 180]

      let distance = calculateWeightedDistance({
        config: mockConfig,
        color1: color,
        color2: color,
        weights,
      })

      expect(distance).toBe(0)
    })

    it('should handle extreme hue differences', () => {
      let color1: Vector = [0.5, 0.2, 0]
      let color2: Vector = [0.5, 0.2, 359]

      let distance = calculateWeightedDistance({
        config: mockConfig,
        weights,
        color1,
        color2,
      })

      expect(distance).toBeLessThan(0.1)
    })

    it('should handle zero weights', () => {
      let color1: Vector = [0.5, 0.2, 180]
      let color2: Vector = [0.7, 0.4, 270]

      let distance = calculateWeightedDistance({
        weights: { lightness: 0, chroma: 0, hue: 0 },
        config: mockConfig,
        color1,
        color2,
      })

      expect(distance).toBeGreaterThan(0)
      expect(distance).toBeLessThan(2)
    })
  })

  describe('special color combinations', () => {
    it('should handle warm colors specially', () => {
      let color1: Vector = [0.5, 0.2, 30]
      let color2: Vector = [0.5, 0.2, 210]

      let distance = calculateWeightedDistance({
        config: mockConfig,
        weights,
        color1,
        color2,
      })

      expect(distance).toBeGreaterThan(0.5)
    })

    it('should handle analogous colors', () => {
      let color1: Vector = [0.5, 0.2, 180]
      let color2: Vector = [0.5, 0.2, 200]

      let distance = calculateWeightedDistance({
        config: mockConfig,
        weights,
        color1,
        color2,
      })

      expect(distance).toBeLessThan(0.3)
    })
  })

  describe('getHueMultiplier', () => {
    it('should return normal multiplier for non-special hues', () => {
      let hue1 = 200
      let hue2 = 220

      let distance = calculateWeightedDistance({
        color1: [0.5, 0.2, hue1] as Vector,
        color2: [0.5, 0.2, hue2] as Vector,
        config: mockConfig,
        weights,
      })

      expect(distance).toBeLessThan(
        calculateWeightedDistance({
          color2: [0.5, 0.2, 120] as Vector,
          color1: [0.5, 0.2, 95] as Vector,
          config: mockConfig,
          weights,
        }),
      )
    })
  })

  describe('calculateChromaPenalty', () => {
    it('should apply base chroma penalty when second color is more saturated', () => {
      let color1: Vector = [0.5, 0.01, 180]
      let color2: Vector = [0.5, 0.06, 180]

      let distance = calculateWeightedDistance({
        weights: { lightness: 0, chroma: 0, hue: 0 },
        config: mockConfig,
        color1,
        color2,
      })

      let expectedPenalty = Math.sqrt((0.06 - 0.01) * 3.5)
      expect(distance).toBeCloseTo(expectedPenalty, 2)
    })

    it('should apply enhanced chroma penalty when second color is more saturated', () => {
      let color1: Vector = [0.5, 0.04, 180]
      let color2: Vector = [0.5, 0.06, 180]

      let distance = calculateWeightedDistance({
        config: {
          ...mockConfig,
          processing: {
            ...mockConfig.processing,
            lowSaturationThreshold: 0.05,
          },
        },
        weights: { lightness: 0, chroma: 0, hue: 0 },
        color1,
        color2,
      })

      let expectedPenalty = Math.sqrt((0.06 - 0.04) * 5)
      expect(distance).toBeCloseTo(expectedPenalty, 2)
    })
  })

  it('should return normal multiplier for yellow hue with close second hue', () => {
    let yellowHue = 95
    let closeHue = 93

    let distance = calculateWeightedDistance({
      color1: [0.5, 0.2, yellowHue] as Vector,
      color2: [0.5, 0.2, closeHue] as Vector,
      config: mockConfig,
      weights,
    })

    let distanceWithFarHue = calculateWeightedDistance({
      color1: [0.5, 0.2, yellowHue] as Vector,
      color2: [0.5, 0.2, 106] as Vector,
      config: mockConfig,
      weights,
    })

    let distanceWithNearHue = calculateWeightedDistance({
      color1: [0.5, 0.2, yellowHue] as Vector,
      color2: [0.5, 0.2, 39] as Vector,
      config: mockConfig,
      weights,
    })

    expect(distance).toBeLessThan(distanceWithFarHue)
    expect(distance).toBeLessThan(distanceWithNearHue)
  })
})
