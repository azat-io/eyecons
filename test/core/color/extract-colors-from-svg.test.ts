import { afterEach, describe, expect, it, vi } from 'vitest'

import type { ColorInfo } from '../../../extension/core/color/extract-colors-from-svg'

import { extractColorsFromSvg } from '../../../extension/core/color/extract-colors-from-svg'
import { NAMED_COLOR_REGEX } from '../../../extension/core/color/constants'

/**
 * Asserts that the extracted colors are exactly the expected ones, in any
 * order.
 *
 * @param colorInfos - Colors returned by the function under test.
 * @param expected - Colors the SVG is expected to contain.
 */
function expectColors(colorInfos: ColorInfo[], expected: ColorInfo[]): void {
  expect(colorInfos).toHaveLength(expected.length)
  expect(colorInfos).toEqual(expect.arrayContaining(expected))
}

describe('extractColorsFromSvg', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should report every color attribute with its name', () => {
    let svg = `<svg>
      <rect fill="#ff0000" />
      <circle stroke="#00ff00" />
      <text color="#0000ff" />
      <feFlood flood-color="#ffff00" />
      <feDiffuseLighting lighting-color="#00ffff" />
      <stop stop-color="#ff00ff" />
    </svg>`

    let result = extractColorsFromSvg(svg)

    expectColors(result, [
      { source: 'attribute', property: 'fill', value: '#ff0000' },
      { source: 'attribute', property: 'stroke', value: '#00ff00' },
      { source: 'attribute', property: 'color', value: '#0000ff' },
      { property: 'flood-color', source: 'attribute', value: '#ffff00' },
      { property: 'lighting-color', source: 'attribute', value: '#00ffff' },
      { property: 'stop-color', source: 'attribute', value: '#ff00ff' },
    ])
  })

  it.each(['#f00', '#ff0000', 'rgb(255, 0, 0)', 'rgba(255, 0, 0, 0.5)', 'red'])(
    'should report the %s attribute color as written',
    value => {
      let result = extractColorsFromSvg(`<svg><rect fill="${value}" /></svg>`)

      expectColors(result, [{ source: 'attribute', property: 'fill', value }])
    },
  )

  it('should report an hsl() attribute color once', () => {
    let value = 'hsl(0, 100%, 50%)'

    let result = extractColorsFromSvg(`<svg><rect fill="${value}" /></svg>`)

    expectColors(result, [{ source: 'attribute', property: 'fill', value }])
  })

  it('should report colors of style blocks with their CSS property', () => {
    let svg = `<svg>
      <style>
        .a { fill: #ff0000; stroke: rgb(0, 0, 255); }
        .b { color: blue; stop-color: green; }
      </style>
      <style></style>
      <g><style>.c { fill: purple; }</style></g>
    </svg>`

    let result = extractColorsFromSvg(svg)

    expectColors(result, [
      { property: 'fill', value: '#ff0000', source: 'css' },
      { value: 'rgb(0, 0, 255)', property: 'stroke', source: 'css' },
      { property: 'color', source: 'css', value: 'blue' },
      { property: 'stop-color', value: 'green', source: 'css' },
      { property: 'fill', value: 'purple', source: 'css' },
    ])
  })

  it('should trim the spaces around a CSS color', () => {
    let svg = '<svg><style>.a { fill:   #ff0000  ; }</style></svg>'

    let result = extractColorsFromSvg(svg)

    expectColors(result, [
      { property: 'fill', value: '#ff0000', source: 'css' },
    ])
  })

  it('should skip CSS declarations without a color value', () => {
    let svg = `<svg>
      <style>
        .a { color; width: 100px; }
        .b { color: blue; }
      </style>
    </svg>`

    let result = extractColorsFromSvg(svg)

    expectColors(result, [{ property: 'color', source: 'css', value: 'blue' }])
  })

  it('should skip none and transparent values', () => {
    let svg = `<svg>
      <rect fill="none" stroke="transparent" />
      <style>.a { fill: none; stroke: transparent; }</style>
    </svg>`

    let result = extractColorsFromSvg(svg)

    expect(result).toEqual([])
  })

  it('should report a color used several times once', () => {
    let svg = '<svg><rect fill="red" /><circle fill="red" /></svg>'

    let result = extractColorsFromSvg(svg)

    expectColors(result, [
      { source: 'attribute', property: 'fill', value: 'red' },
    ])
  })

  it('should report colors written outside attributes and style blocks as inline', () => {
    let svg = '<svg><text>#ff0000, rgb(0, 0, 255) and green</text></svg>'

    let result = extractColorsFromSvg(svg)

    expectColors(result, [
      { source: 'inline', value: '#ff0000' },
      { value: 'rgb(0, 0, 255)', source: 'inline' },
      { source: 'inline', value: 'green' },
    ])
  })

  it('should report a named color written inline in lower case', () => {
    let svg = '<svg><text>Navy</text></svg>'

    let result = extractColorsFromSvg(svg)

    expectColors(result, [{ source: 'inline', value: 'navy' }])
  })

  it('should keep the attribute source of a color that also appears inline', () => {
    let svg = '<svg><rect fill="red" /><text>red</text></svg>'

    let result = extractColorsFromSvg(svg)

    expectColors(result, [
      { source: 'attribute', property: 'fill', value: 'red' },
    ])
  })

  it('should skip an inline named color match that captured no color name', () => {
    let emptyMatch = Object.assign(['red'], {
      input: '<svg><text>red</text></svg>',
      index: 0,
    }) as RegExpExecArray
    vi.spyOn(NAMED_COLOR_REGEX, 'exec').mockReturnValueOnce(emptyMatch)

    let result = extractColorsFromSvg('<svg><text>blue</text></svg>')

    expectColors(result, [{ source: 'inline', value: 'blue' }])
  })

  it('should return no colors for an SVG without colors', () => {
    expect(extractColorsFromSvg('<svg></svg>')).toEqual([])
  })
})
