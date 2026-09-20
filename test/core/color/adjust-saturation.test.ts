import { describe, expect, it } from 'vitest'

import type { Config } from '../../../extension/types/config'

import { adjustSaturation } from '../../../extension/core/color/adjust-saturation'
import { createMockConfig } from '../../helpers/create-mock-config'

describe('adjustSaturation', () => {
  /**
   * Builds a config whose saturation-related processing options are set to the
   * given values, leaving every other field at its shared default.
   *
   * @param adjustContrast - Whether saturation adjustment runs at all.
   * @param lowSaturationThreshold - Chroma below which a color is boosted.
   * @param saturationFactor - Multiplier applied to a boosted chroma.
   * @returns Config to hand to `adjustSaturation`.
   */
  function createConfig(
    adjustContrast = true,
    lowSaturationThreshold = 0.05,
    saturationFactor = 1.2,
  ): Config {
    let { processing } = createMockConfig()

    return createMockConfig({
      processing: {
        ...processing,
        lowSaturationThreshold,
        saturationFactor,
        adjustContrast,
      },
    })
  }

  it('should return the same color when adjustContrast is false', () => {
    let color: [number, number, number] = [0.5, 0.03, 180]
    let config = createConfig(false)

    let result = adjustSaturation(color, config)

    expect(result).toBe(color)
  })

  it('should adjust chroma for colors with chroma below threshold', () => {
    let color: [number, number, number] = [0.5, 0.03, 180]
    let config = createConfig(true, 0.05, 1.5)

    let result = adjustSaturation(color, config)

    expect(result).toEqual([0.5, 0.045, 180])
  })

  it('should not adjust chroma for colors with chroma at or above threshold', () => {
    let color: [number, number, number] = [0.5, 0.05, 180]
    let config = createConfig(true, 0.05, 1.5)

    let result = adjustSaturation(color, config)

    expect(result).toBe(color)
  })

  it('should not adjust chroma for colors with very low chroma (≤ 0.01)', () => {
    let color: [number, number, number] = [0.5, 0.01, 180]
    let config = createConfig(true, 0.05, 1.5)

    let result = adjustSaturation(color, config)

    expect(result).toBe(color)
  })

  it('should cap adjusted chroma at 0.4', () => {
    let color: [number, number, number] = [0.5, 0.3, 180]
    let config = createConfig(true, 0.4, 2)

    let result = adjustSaturation(color, config)

    expect(result).toEqual([0.5, 0.4, 180])
  })

  it('should handle edge case with very high saturation factor', () => {
    let color: [number, number, number] = [0.5, 0.02, 180]
    let config = createConfig(true, 0.05, 30)
    let result = adjustSaturation(color, config)

    expect(result).toEqual([0.5, 0.4, 180])
  })

  it('should preserve lightness and hue values', () => {
    let color: [number, number, number] = [0.7, 0.03, 240]
    let config = createConfig(true, 0.05, 1.5)

    let result = adjustSaturation(color, config)

    expect(result[0]).toBe(0.7)
    expect(result[2]).toBe(240)
  })

  it('should handle boundary condition at lowSaturationThreshold', () => {
    let thresholdValue = 0.05
    let belowThreshold: [number, number, number] = [
      0.5,
      thresholdValue - 0.001,
      180,
    ]
    let atThreshold: [number, number, number] = [0.5, thresholdValue, 180]
    let config = createConfig(true, thresholdValue, 1.5)

    let resultBelow = adjustSaturation(belowThreshold, config)
    let resultAt = adjustSaturation(atThreshold, config)

    expect(resultBelow).not.toBe(belowThreshold)

    expect(resultAt).toBe(atThreshold)
  })

  it('should handle boundary condition at chroma = 0.01', () => {
    let belowBoundary: [number, number, number] = [0.5, 0.009, 180]
    let atBoundary: [number, number, number] = [0.5, 0.01, 180]
    let aboveBoundary: [number, number, number] = [0.5, 0.011, 180]
    let config = createConfig(true, 0.05, 1.5)

    let resultBelow = adjustSaturation(belowBoundary, config)
    let resultAt = adjustSaturation(atBoundary, config)
    let resultAbove = adjustSaturation(aboveBoundary, config)

    expect(resultBelow).toBe(belowBoundary)
    expect(resultAt).toBe(atBoundary)
    expect(resultAbove).not.toBe(aboveBoundary)
    expect(resultAbove[1]).toBeCloseTo(0.011 * 1.5, 5)
  })

  it('should create a new array for adjusted colors', () => {
    let color: [number, number, number] = [0.5, 0.03, 180]
    let config = createConfig(true, 0.05, 1.5)

    let result = adjustSaturation(color, config)

    expect(result).not.toBe(color)

    let noChangeColor: [number, number, number] = [0.5, 0.06, 180]
    let noChangeResult = adjustSaturation(noChangeColor, config)
    expect(noChangeResult).toBe(noChangeColor)
  })
})
