import { describe, expect, it } from 'vitest'

import { getFolderColors } from '../../../extension/core/color/get-folder-colors'
import { createMockTheme } from '../../helpers/create-mock-theme'
import { toOklch } from '../../../extension/core/color/to-oklch'

/**
 * Front of the folder in the source icon, painted with the folder color.
 */
const FOLDER_FRONT_COLOR = '#ffca28'

/**
 * Back of the folder in the source icon, painted with a darker shade.
 */
const FOLDER_BACK_COLOR = '#ffa000'

describe('getFolderColors', () => {
  let theme = createMockTheme()

  it.each(['orange', 'yellow', 'purple', 'green', 'blue', 'red'] as const)(
    'should paint the folder front with the theme %s color',
    folderColor => {
      let result = getFolderColors(createMockTheme({ folderColor }))

      expect(result.get(FOLDER_FRONT_COLOR)).toBe(theme.main[folderColor])
    },
  )

  it('should paint the folder front blue when the folder color is unknown', () => {
    let result = getFolderColors(createMockTheme({ folderColor: 'pink' }))

    expect(result.get(FOLDER_FRONT_COLOR)).toBe(theme.main.blue)
  })

  it('should paint the folder back with a darker shade of the same hue', () => {
    let expectedLightnessDrop = 0.1

    let result = getFolderColors(theme)

    let [frontLightness, , frontHue] = toOklch(result.get(FOLDER_FRONT_COLOR)!)
    let [backLightness, , backHue] = toOklch(result.get(FOLDER_BACK_COLOR)!)
    expect(backLightness).toBeCloseTo(
      frontLightness! - expectedLightnessDrop,
      2,
    )
    expect(backHue).toBeCloseTo(frontHue!, 0)
  })

  it('should replace only the two folder colors', () => {
    let result = getFolderColors(theme)

    expect(new Set(result.keys())).toEqual(
      new Set([FOLDER_FRONT_COLOR, FOLDER_BACK_COLOR]),
    )
  })
})
