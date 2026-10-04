import type { Vector } from '@texel/color'

import { describe, expect, it } from 'vitest'

import type { Config } from '../../../extension/types/config'

import { adjustSaturation } from '../../../extension/core/color/adjust-saturation'
import { createMockConfig } from '../../helpers/create-mock-config'

describe('adjustSaturation', () => {
  /**
   * Builds a config whose saturation options are replaced by the given values,
   * leaving every other field at its shared default.
   *
   * @param options - Saturation options replacing the defaults.
   * @returns Config to hand to `adjustSaturation`.
   */
  function createConfig(options: Partial<Config['processing']>): Config {
    let { processing } = createMockConfig()

    return createMockConfig({ processing: { ...processing, ...options } })
  }

  let config = createConfig({
    lowSaturationThreshold: 0.05,
    saturationFactor: 1.5,
    adjustContrast: true,
  })

  it.each([
    ['a dull color', [0.5, 0.03, 180], 0.045],
    ['a color just above the gray limit', [0.5, 0.011, 180], 0.0165],
    [
      'a color just below the low-saturation threshold',
      [0.5, 0.049, 180],
      0.0735,
    ],
  ] as [string, Vector, number][])(
    'should boost the chroma of %s by the saturation factor',
    (_, color, expectedChroma) => {
      let result = adjustSaturation(color, config)

      expect(result).toEqual([
        color[0],
        expect.closeTo(expectedChroma, 6),
        color[2],
      ])
    },
  )

  it.each([
    ['a color on the gray limit', [0.5, 0.01, 180]],
    ['a color below the gray limit', [0.5, 0.009, 180]],
    ['a color on the low-saturation threshold', [0.5, 0.05, 180]],
    ['a saturated color', [0.5, 0.06, 180]],
  ] as [string, Vector][])('should leave %s unchanged', (_, color) => {
    let result = adjustSaturation(color, config)

    expect(result).toEqual(color)
  })

  it('should leave a dull color unchanged when contrast adjustment is off', () => {
    let dullColor: Vector = [0.5, 0.03, 180]

    let result = adjustSaturation(
      dullColor,
      createConfig({ adjustContrast: false }),
    )

    expect(result).toEqual(dullColor)
  })

  it('should cap the boosted chroma', () => {
    let dullColor: Vector = [0.5, 0.02, 180]
    let expectedMaxChroma = 0.4

    let result = adjustSaturation(
      dullColor,
      createConfig({ saturationFactor: 30 }),
    )

    expect(result).toEqual([0.5, expectedMaxChroma, 180])
  })

  it('should not modify the given color', () => {
    let dullColor: Vector = [0.5, 0.03, 180]

    adjustSaturation(dullColor, config)

    expect(dullColor).toEqual([0.5, 0.03, 180])
  })
})
