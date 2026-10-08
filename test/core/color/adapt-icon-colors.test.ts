import { afterEach, describe, expect, it, vi } from 'vitest'

import { adaptIconColors } from '../../../extension/core/color/adapt-icon-colors'
import { NAMED_COLORS } from '../../../extension/core/color/constants'
import { createMockConfig } from '../../helpers/create-mock-config'
import { createMockTheme } from '../../helpers/create-mock-theme'

describe('adaptIconColors', () => {
  let config = createMockConfig()
  let theme = createMockTheme()

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([
    ['#ff0000', theme.main.red],
    ['#0000ff', theme.main.blue],
    ['#000000', '#1e1e1e'],
    ['#ffffff', '#d4d4d4'],
  ])('should replace %s with the closest theme color %s', (color, expected) => {
    let svgContent = `<svg><path fill="${color}" d="M0 0h1"/></svg>`

    let result = adaptIconColors({ id: 'html', svgContent }, theme, config)

    expect(result).toBe(`<svg><path fill="${expected}" d="M0 0h1"/></svg>`)
  })

  it('should replace every color of an icon at once', () => {
    let svgContent =
      '<svg><path fill="#ff0000" d="M0 0h1"/><path stroke="#0000ff" d="M1 1h1"/></svg>'

    let result = adaptIconColors({ id: 'html', svgContent }, theme, config)

    expect(result).toBe(
      `<svg><path fill="${theme.main.red}" d="M0 0h1"/><path stroke="${theme.main.blue}" d="M1 1h1"/></svg>`,
    )
  })

  it('should use the theme override for a color of the overridden icon', () => {
    let themeWithOverride = createMockTheme({
      overrides: { html: { '#e34f26': '#ce9178' } },
    })
    let svgContent = '<svg><path fill="#e34f26" d="M0 0h1"/></svg>'

    let result = adaptIconColors(
      { id: 'html', svgContent },
      themeWithOverride,
      config,
    )

    expect(result).toBe('<svg><path fill="#ce9178" d="M0 0h1"/></svg>')
  })

  it('should paint folder icons with the selected folder color', () => {
    let svgContent =
      '<svg><path fill="#ffa000" d="M0 0h1"/><path fill="#ffca28" d="M1 1h1"/></svg>'

    let result = adaptIconColors({ id: 'folder', svgContent }, theme, config)

    expect(result).toContain(`fill="${theme.main.blue}"`)
    expect(result).not.toContain('#ffa000')
    expect(result).not.toContain('#ffca28')
  })

  it('should paint opened folder icons with the selected folder color', () => {
    let svgContent = '<svg><path fill="#ffca28" d="M0 0h1"/></svg>'

    let result = adaptIconColors(
      { id: 'folder-open', svgContent },
      theme,
      config,
    )

    expect(result).toBe(
      `<svg><path fill="${theme.main.blue}" d="M0 0h1"/></svg>`,
    )
  })

  it('should return an icon without colors unchanged', () => {
    let svgContent = '<svg><path d="M0 0h1"/></svg>'

    let result = adaptIconColors({ id: 'html', svgContent }, theme, config)

    expect(result).toBe(svgContent)
  })

  it('should leave the whole icon unchanged when one of its colors cannot be converted', () => {
    let svgContent =
      '<svg><path fill="#ff0000" d="M0 0h1"/><path fill="url(#gradient)" d="M1 1h1"/></svg>'

    let result = adaptIconColors({ id: 'html', svgContent }, theme, config)

    expect(result).toBe(svgContent)
  })

  it('should leave the icon unchanged when the conversion fails with a non-Error value', () => {
    let failure: unknown = 'Broken color table'
    vi.spyOn(NAMED_COLORS, 'get').mockImplementation(() => {
      throw failure
    })
    let svgContent = '<svg><path fill="red" d="M0 0h1"/></svg>'

    let result = adaptIconColors({ id: 'html', svgContent }, theme, config)

    expect(result).toBe(svgContent)
  })
})
