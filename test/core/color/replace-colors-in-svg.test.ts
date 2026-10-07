import { describe, expect, it } from 'vitest'

import type { ColorInfo } from '../../../extension/core/color/extract-colors-from-svg'

import { replaceColorsInSvg } from '../../../extension/core/color/replace-colors-in-svg'

describe('replaceColorsInSvg', () => {
  it('should replace colors in SVG string based on mapping', () => {
    let svgContent =
      '<svg><rect fill="#ff0000" /><circle stroke="#00ff00" /></svg>'
    let colorInfos: ColorInfo[] = [
      { source: 'attribute', value: '#ff0000', property: 'fill' },
      { source: 'attribute', property: 'stroke', value: '#00ff00' },
    ]
    let colorMapping = new Map([
      ['#ff0000', '#0000ff'],
      ['#00ff00', '#ffff00'],
    ])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(
      '<svg><rect fill="#0000ff" /><circle stroke="#ffff00" /></svg>',
    )
  })

  it('should only replace colors that exist in the mapping', () => {
    let svgContent =
      '<svg><rect fill="#ff0000" /><circle stroke="#00ff00" /></svg>'
    let colorInfos: ColorInfo[] = [
      { source: 'attribute', value: '#ff0000', property: 'fill' },
      { source: 'attribute', property: 'stroke', value: '#00ff00' },
    ]
    let colorMapping = new Map([['#ff0000', '#0000ff']])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(
      '<svg><rect fill="#0000ff" /><circle stroke="#00ff00" /></svg>',
    )
  })

  it('should replace colors in CSS style blocks', () => {
    let svgContent =
      '<svg><style>.red { fill: #ff0000; } .green { stroke: #00ff00; }</style></svg>'
    let colorInfos: ColorInfo[] = [
      { value: '#ff0000', property: 'fill', source: 'css' },
      { property: 'stroke', value: '#00ff00', source: 'css' },
    ]
    let colorMapping = new Map([
      ['#ff0000', '#0000ff'],
      ['#00ff00', '#ffff00'],
    ])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(
      '<svg><style>.red { fill: #0000ff; } .green { stroke: #ffff00; }</style></svg>',
    )
  })

  it('should replace named colors', () => {
    let svgContent = '<svg><rect fill="red" /><circle stroke="green" /></svg>'
    let colorInfos: ColorInfo[] = [
      { source: 'attribute', property: 'fill', value: 'red' },
      { source: 'attribute', property: 'stroke', value: 'green' },
    ]
    let colorMapping = new Map([
      ['green', 'yellow'],
      ['red', 'blue'],
    ])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(
      '<svg><rect fill="blue" /><circle stroke="yellow" /></svg>',
    )
  })

  it('should replace RGB and HSL colors', () => {
    let svgContent =
      '<svg><rect fill="rgb(255, 0, 0)" /><circle stroke="hsl(120, 100%, 50%)" /></svg>'
    let colorInfos: ColorInfo[] = [
      { value: 'rgb(255, 0, 0)', source: 'attribute', property: 'fill' },
      { value: 'hsl(120, 100%, 50%)', source: 'attribute', property: 'stroke' },
    ]
    let colorMapping = new Map([
      ['hsl(120, 100%, 50%)', '#ffff00'],
      ['rgb(255, 0, 0)', '#0000ff'],
    ])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(
      '<svg><rect fill="#0000ff" /><circle stroke="#ffff00" /></svg>',
    )
  })

  it('should handle multiple occurrences of the same color', () => {
    let svgContent =
      '<svg><rect fill="red" /><circle fill="red" /><path stroke="red" /></svg>'
    let colorInfos: ColorInfo[] = [
      { source: 'attribute', property: 'fill', value: 'red' },
    ]
    let colorMapping = new Map([['red', 'blue']])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(
      '<svg><rect fill="blue" /><circle fill="blue" /><path stroke="blue" /></svg>',
    )
  })

  it('should handle colors that appear in different contexts', () => {
    let svgContent =
      '<svg><rect fill="#ff0000" /><style>.a { color: #ff0000; }</style><text>#ff0000</text></svg>'
    let colorInfos: ColorInfo[] = [
      { source: 'attribute', value: '#ff0000', property: 'fill' },
      { property: 'color', value: '#ff0000', source: 'css' },
      { value: '#ff0000', source: 'inline' },
    ]
    let colorMapping = new Map([['#ff0000', '#0000ff']])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(
      '<svg><rect fill="#0000ff" /><style>.a { color: #0000ff; }</style><text>#0000ff</text></svg>',
    )
  })

  it('should return the original SVG if no colors match the mapping', () => {
    let svgContent = '<svg><rect fill="#ff0000" /></svg>'
    let colorInfos: ColorInfo[] = [
      { source: 'attribute', value: '#ff0000', property: 'fill' },
    ]
    let colorMapping = new Map([['#00ff00', '#0000ff']])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(svgContent)
  })

  it('should not rewrite a color it has just written', () => {
    let svgContent = '<svg><rect fill="#a7b2b5" /><path fill="#fff" /></svg>'
    let colorInfos: ColorInfo[] = [
      { source: 'attribute', value: '#a7b2b5', property: 'fill' },
      { source: 'attribute', property: 'fill', value: '#fff' },
    ]
    let colorMapping = new Map([
      ['#a7b2b5', '#ffffff'],
      ['#fff', '#ffffff'],
    ])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(
      '<svg><rect fill="#ffffff" /><path fill="#ffffff" /></svg>',
    )
  })

  it('should tell a short hex color from a longer one starting with it', () => {
    let svgContent = '<svg><rect fill="#ffffff" /><path fill="#fff" /></svg>'
    let colorInfos: ColorInfo[] = [
      { source: 'attribute', property: 'fill', value: '#fff' },
      { source: 'attribute', value: '#ffffff', property: 'fill' },
    ]
    let colorMapping = new Map([
      ['#ffffff', '#111111'],
      ['#fff', '#222222'],
    ])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(
      '<svg><rect fill="#111111" /><path fill="#222222" /></svg>',
    )
  })

  it('should properly escape special characters in color values', () => {
    let svgContent = '<svg><rect fill="rgb(255, 0, 0)" /></svg>'
    let colorInfos: ColorInfo[] = [
      { value: 'rgb(255, 0, 0)', source: 'attribute', property: 'fill' },
    ]
    let colorMapping = new Map([['rgb(255, 0, 0)', '#0000ff']])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe('<svg><rect fill="#0000ff" /></svg>')
  })

  it('should not replace a named color inside a longer word', () => {
    let svgContent =
      '<svg><g id="credits"><path fill="red" /><path fill="darkred" /><path class="red-ish" /></g></svg>'
    let colorInfos: ColorInfo[] = [
      { source: 'attribute', property: 'fill', value: 'red' },
    ]
    let colorMapping = new Map([['red', '#123456']])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(
      '<svg><g id="credits"><path fill="#123456" /><path fill="darkred" /><path class="red-ish" /></g></svg>',
    )
  })

  it('should not replace a short hex color inside a longer one', () => {
    let svgContent = '<svg><rect fill="#f00f" /><path fill="#f00" /></svg>'
    let colorInfos: ColorInfo[] = [
      { source: 'attribute', property: 'fill', value: '#f00' },
    ]
    let colorMapping = new Map([['#f00', '#0000ff']])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(
      '<svg><rect fill="#f00f" /><path fill="#0000ff" /></svg>',
    )
  })

  it('should replace a color next to punctuation', () => {
    let svgContent =
      '<svg><style>.a{fill:red;stroke:red}</style><rect fill="red"/></svg>'
    let colorInfos: ColorInfo[] = [
      { source: 'attribute', property: 'fill', value: 'red' },
    ]
    let colorMapping = new Map([['red', '#123456']])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe(
      '<svg><style>.a{fill:#123456;stroke:#123456}</style><rect fill="#123456"/></svg>',
    )
  })
})
