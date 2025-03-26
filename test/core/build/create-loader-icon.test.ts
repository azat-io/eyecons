import { describe, expect, it } from 'vitest'

import { createLoaderIcon } from '../../../extension/core/build/create-loader-icon'

describe('createLoaderIcon', () => {
  it('should create an SVG loader icon as a string', () => {
    let result = createLoaderIcon()

    expect(result).toMatch(/^\s*<svg/u)
    expect(result).toMatch(/<\/svg>\s*$/u)

    expect(result).toContain('viewBox="0 0 100 100"')
    expect(result).toContain('preserveAspectRatio="xMidYMid"')
    expect(result).toContain('<circle')
    expect(result).toContain('animateTransform')
  })

  it('should use default color when not specified', () => {
    let result = createLoaderIcon()

    expect(result).toContain('fill="#636363"')
  })

  it('should use custom color when specified', () => {
    let result = createLoaderIcon({ color: '#ff0000' })

    expect(result).toContain('fill="#ff0000"')
    expect(result).not.toContain('fill="#636363"')
  })

  it('should use custom circle radius when specified', () => {
    let result = createLoaderIcon({ circleRadius: 8 })

    expect(result).toContain('r="8"')
    expect(result).not.toContain('r="6"')
  })

  it('should use custom animation duration when specified', () => {
    let result = createLoaderIcon({ duration: 2 })

    expect(result).toContain('dur="2s"')
    expect(result).not.toContain('dur="1s"')
  })
})
