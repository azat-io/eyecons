import type { Vector } from '@texel/color'

import { describe, expect, it } from 'vitest'

import { determineColorWeights } from '../../../extension/core/color/determine-color-weights'
import { COLOR_WEIGHTS } from '../../../extension/core/color/constants'

describe('determineColorWeights', () => {
  it('should use the achromatic weights for an achromatic color', () => {
    let gray: Vector = [0.5, 0.02, 180]

    expect(determineColorWeights(gray, true)).toEqual(COLOR_WEIGHTS.ACHROMATIC)
  })

  it.each([
    ['BRIGHT_CHROMATIC', 'a bright saturated blue', [0.85, 0.15, 240]],
    ['BRIGHT_CHROMATIC', 'a bright saturated red', [0.82, 0.2, 10]],
    ['BRIGHT_CHROMATIC', 'a bright saturated yellow', [0.85, 0.15, 85]],
    ['BRIGHT_CHROMATIC', 'a bright saturated purple', [0.85, 0.2, 290]],
    ['PURPLE_PINK_FAMILY', 'a purple', [0.6, 0.08, 290]],
    ['PURPLE_PINK_FAMILY', 'a magenta', [0.7, 0.1, 320]],
    [
      'PURPLE_PINK_FAMILY',
      'a pinkish red below the hue wrap',
      [0.65, 0.09, 355],
    ],
    [
      'PURPLE_PINK_FAMILY',
      'a pinkish red above the hue wrap',
      [0.65, 0.09, 10],
    ],
    [
      'PURPLE_PINK_FAMILY',
      'a saturated purple of medium lightness',
      [0.7, 0.2, 290],
    ],
    ['YELLOW_FAMILY', 'a yellow', [0.8, 0.09, 85]],
    ['YELLOW_FAMILY', 'a yellow-green', [0.7, 0.1, 105]],
    ['YELLOW_FAMILY', 'a yellow-orange', [0.75, 0.12, 45]],
    [
      'YELLOW_FAMILY',
      'a saturated yellow of medium lightness',
      [0.75, 0.15, 85],
    ],
    ['HIGH_SATURATION', 'a highly saturated cyan', [0.5, 0.15, 180]],
    [
      'HIGH_SATURATION',
      'a saturated blue of medium lightness',
      [0.7, 0.15, 240],
    ],
    ['LOW_SATURATION', 'a dull cyan', [0.5, 0.07, 180]],
    ['LOW_SATURATION', 'a dull yellow', [0.8, 0.07, 85]],
    ['LOW_SATURATION', 'a dull purple', [0.6, 0.06, 290]],
    ['CHROMATIC', 'a medium saturated cyan', [0.5, 0.11, 180]],
    ['CHROMATIC', 'a crimson between magenta and red', [0.6, 0.09, 340]],
    ['CHROMATIC', 'a green', [0.7, 0.1, 130]],
    ['CHROMATIC', 'an orange', [0.7, 0.1, 35]],
    [
      'CHROMATIC',
      'a bright but only moderately saturated blue',
      [0.85, 0.09, 240],
    ],
  ] as [keyof typeof COLOR_WEIGHTS, string, Vector][])(
    'should use the %s weights for %s',
    (expectedWeights, _, color) => {
      expect(determineColorWeights(color, false)).toEqual(
        COLOR_WEIGHTS[expectedWeights],
      )
    },
  )
})
