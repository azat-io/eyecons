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
    let svgContent = `<svg>
      <style>
        .red { fill: #ff0000; }
        .green { stroke: #00ff00; }
      </style>
      <rect class="red" />
      <circle class="green" />
    </svg>`
    let colorInfos: ColorInfo[] = [
      { value: '#ff0000', property: 'fill', source: 'css' },
      { property: 'stroke', value: '#00ff00', source: 'css' },
    ]
    let colorMapping = new Map([
      ['#ff0000', '#0000ff'],
      ['#00ff00', '#ffff00'],
    ])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toContain('fill: #0000ff;')
    expect(result).toContain('stroke: #ffff00;')
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
    let svgContent = `<svg>
      <rect fill="rgb(255, 0, 0)" />
      <circle stroke="hsl(120, 100%, 50%)" />
    </svg>`
    let colorInfos: ColorInfo[] = [
      { value: 'rgb(255, 0, 0)', source: 'attribute', property: 'fill' },
      { value: 'hsl(120, 100%, 50%)', source: 'attribute', property: 'stroke' },
    ]
    let colorMapping = new Map([
      ['hsl(120, 100%, 50%)', '#ffff00'],
      ['rgb(255, 0, 0)', '#0000ff'],
    ])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toContain('fill="#0000ff"')
    expect(result).toContain('stroke="#ffff00"')
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
    let svgContent = `<svg>
      <rect fill="#ff0000" />
      <style>.red { color: #ff0000; }</style>
      <text>The color #ff0000 is red</text>
    </svg>`
    let colorInfos: ColorInfo[] = [
      { source: 'attribute', value: '#ff0000', property: 'fill' },
      { property: 'color', value: '#ff0000', source: 'css' },
      { value: '#ff0000', source: 'inline' },
    ]
    let colorMapping = new Map([['#ff0000', '#0000ff']])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toContain('fill="#0000ff"')
    expect(result).toContain('color: #0000ff;')
    expect(result).toContain('The color #0000ff is red')
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

  it('should properly escape special characters in color values', () => {
    let svgContent = '<svg><rect fill="rgb(255, 0, 0)" /></svg>'
    let colorInfos: ColorInfo[] = [
      { value: 'rgb(255, 0, 0)', source: 'attribute', property: 'fill' },
    ]
    let colorMapping = new Map([['rgb(255, 0, 0)', '#0000ff']])

    let result = replaceColorsInSvg(svgContent, colorMapping, colorInfos)

    expect(result).toBe('<svg><rect fill="#0000ff" /></svg>')
  })
})
