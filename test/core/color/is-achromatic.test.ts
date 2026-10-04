import type { Vector } from '@texel/color'

import { describe, expect, it } from 'vitest'

import { isAchromatic } from '../../../extension/core/color/is-achromatic'
import { createMockConfig } from '../../helpers/create-mock-config'

describe('isAchromatic', () => {
  let config = createMockConfig()

  /**
   * Builds a config with the given processing thresholds and the shared
   * defaults for everything else.
   *
   * @param thresholds - Thresholds replacing the defaults.
   * @returns Config to hand to `isAchromatic`.
   */
  function createConfigWith(
    thresholds: Partial<typeof config.processing>,
  ): typeof config {
    return createMockConfig({
      processing: { ...config.processing, ...thresholds },
    })
  }

  it.each([
    ['a mid gray', [0.5, 0.04, 180], true],
    ['a color exactly on the low-saturation threshold', [0.5, 0.05, 180], true],
    ['pure white', [1, 0, 0], true],
    ['pure black', [0, 0, 0], true],
    ['a slightly tinted color of normal lightness', [0.5, 0.07, 180], false],
    ['a strongly saturated color', [0.5, 0.12, 180], false],
    ['a very dark strongly saturated color', [0.02, 0.11, 180], false],
  ] as [string, Vector, boolean][])(
    'should tell whether %s is achromatic',
    (_, color, expected) => {
      expect(isAchromatic(color, config)).toBe(expected)
    },
  )

  describe('with a strict low-saturation threshold', () => {
    let strictConfig = createConfigWith({ lowSaturationThreshold: 0.02 })

    it.each([
      ['a very dark color with a moderate tint', [0.03, 0.05, 180], true],
      ['a mid color with the same tint', [0.5, 0.05, 180], false],
      ['a very dark color with a strong tint', [0.03, 0.07, 180], false],
      ['a very light color with a moderate tint', [0.97, 0.03, 180], true],
      ['a very light color with a strong tint', [0.97, 0.05, 180], false],
    ] as [string, Vector, boolean][])(
      'should tell whether %s is achromatic',
      (_, color, expected) => {
        expect(isAchromatic(color, strictConfig)).toBe(expected)
      },
    )
  })

  it('should take the light threshold from the config', () => {
    let tintedNearWhite: Vector = [0.92, 0.08, 180]
    let looseLightConfig = createConfigWith({
      extremeLightnessThresholds: { light: 0.9, dark: 0.05 },
    })

    expect(isAchromatic(tintedNearWhite, config)).toBeFalsy()
    expect(isAchromatic(tintedNearWhite, looseLightConfig)).toBeTruthy()
  })

  it('should take the dark threshold from the config', () => {
    let tintedNearBlack: Vector = [0.08, 0.08, 180]
    let looseDarkConfig = createConfigWith({
      extremeLightnessThresholds: { light: 0.95, dark: 0.1 },
    })

    expect(isAchromatic(tintedNearBlack, config)).toBeFalsy()
    expect(isAchromatic(tintedNearBlack, looseDarkConfig)).toBeTruthy()
  })
})
