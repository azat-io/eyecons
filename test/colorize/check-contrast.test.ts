import { describe, expect, it } from 'vitest'

import { checkContrast } from '../../extension/colorize/check-contrast'

describe('checkContrast', () => {
  it('should check contrast', () => {
    expect(
      checkContrast({ background: '#b8bb25', foreground: '#eadbb2' }),
    ).toBeTruthy()

    expect(
      checkContrast({ background: '#a3be8c', foreground: '#ebcb8b' }),
    ).toBeTruthy()

    expect(
      checkContrast({ background: '#4ffa7a', foreground: '#feb86c' }),
    ).toBeFalsy()
  })
})
