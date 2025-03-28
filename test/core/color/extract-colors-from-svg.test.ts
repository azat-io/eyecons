import { describe, expect, it } from 'vitest'

import { extractColorsFromSvg } from '../../../extension/core/color/extract-colors-from-svg'

describe('extractColorsFromSvg', () => {
  it('should extract hex colors', () => {
    let svg = '<svg><rect fill="#ff0000" /><circle stroke="#00ff00" /></svg>'
    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('#ff0000')
    expect(values).toContain('#00ff00')

    let redColor = colorInfos.find(info => info.value === '#ff0000')
    expect(redColor?.source).toBe('attribute')
    expect(redColor?.property).toBe('fill')

    let greenColor = colorInfos.find(info => info.value === '#00ff00')
    expect(greenColor?.source).toBe('attribute')
    expect(greenColor?.property).toBe('stroke')
  })

  it('should extract RGB colors', () => {
    let svg =
      '<svg><rect fill="rgb(255, 0, 0)" /><circle stroke="rgb(0, 255, 0)" /></svg>'
    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('rgb(255, 0, 0)')
    expect(values).toContain('rgb(0, 255, 0)')

    let redColor = colorInfos.find(info => info.value === 'rgb(255, 0, 0)')
    expect(redColor?.source).toBe('attribute')
    expect(redColor?.property).toBe('fill')
  })

  it('should extract RGBA colors', () => {
    let svg = '<svg><rect fill="rgba(255, 0, 0, 0.5)" /></svg>'
    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('rgba(255, 0, 0, 0.5)')

    let redColor = colorInfos.find(
      info => info.value === 'rgba(255, 0, 0, 0.5)',
    )
    expect(redColor?.source).toBe('attribute')
    expect(redColor?.property).toBe('fill')
  })

  it('should extract HSL colors', () => {
    let svg = '<svg><rect fill="hsl(0, 100%, 50%)" /></svg>'
    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('hsl(0, 100%, 50%)')

    let redColor = colorInfos.find(info => info.value === 'hsl(0, 100%, 50%)')
    expect(redColor?.source).toBe('attribute')
    expect(redColor?.property).toBe('fill')
  })

  it('should extract named colors', () => {
    let svg = '<svg><rect fill="red" /><circle stroke="blue" /></svg>'
    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('red')
    expect(values).toContain('blue')

    let redColor = colorInfos.find(info => info.value === 'red')
    expect(redColor?.source).toBe('attribute')
    expect(redColor?.property).toBe('fill')

    let blueColor = colorInfos.find(info => info.value === 'blue')
    expect(blueColor?.source).toBe('attribute')
    expect(blueColor?.property).toBe('stroke')
  })

  it('should extract colors from style blocks', () => {
    let svg = `<svg>
      <style>
        .red { fill: #ff0000; }
        .blue { stroke: rgb(0, 0, 255); }
      </style>
      <rect class="red" />
      <circle class="blue" />
    </svg>`
    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('#ff0000')
    expect(values).toContain('rgb(0, 0, 255)')

    let redColor = colorInfos.find(info => info.value === '#ff0000')
    expect(redColor?.source).toBe('css')
    expect(redColor?.property).toBe('fill')

    let blueColor = colorInfos.find(info => info.value === 'rgb(0, 0, 255)')
    expect(blueColor?.source).toBe('css')
    expect(blueColor?.property).toBe('stroke')
  })

  it('should ignore none and transparent values', () => {
    let svg = '<svg><rect fill="none" /><circle stroke="transparent" /></svg>'
    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).not.toContain('none')
    expect(values).not.toContain('transparent')
  })

  it('should handle multiple occurrences of the same color', () => {
    let svg = '<svg><rect fill="red" /><circle fill="red" /></svg>'
    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toHaveLength(1)
    expect(values).toContain('red')
  })

  it('should extract colors from various attributes', () => {
    let svg = `<svg>
      <rect fill="#ff0000" />
      <circle stroke="blue" />
      <linearGradient>
        <stop stop-color="green" />
      </linearGradient>
      <text fill="orange" stroke="black" />
    </svg>`
    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('#ff0000')
    expect(values).toContain('blue')
    expect(values).toContain('green')
    expect(values).toContain('orange')
    expect(values).toContain('black')

    let greenColor = colorInfos.find(info => info.value === 'green')
    expect(greenColor?.source).toBe('attribute')
    expect(greenColor?.property).toBe('stop-color')
  })

  it('should handle shorthand hex colors', () => {
    let svg = '<svg><rect fill="#f00" /><circle stroke="#0f0" /></svg>'
    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('#f00')
    expect(values).toContain('#0f0')
  })

  it('should handle empty SVG', () => {
    let svg = '<svg></svg>'
    let colorInfos = extractColorsFromSvg(svg)

    expect(colorInfos).toHaveLength(0)
  })

  it('should extract colors from style tags with various CSS properties', () => {
    let svg = `<svg>
      <style>
        .class1 { fill: #ff0000; stroke: blue; }
        #id1 { color: rgb(0, 255, 0); }
        path { stop-color: hsl(240, 100%, 50%); }
        /* Test comments and non-color properties */
        rect { width: 100px; height: 100px; fill: yellow; }
        /* Test none and transparent */
        circle { fill: none; stroke: transparent; }
      </style>
      <rect class="class1" />
    </svg>`

    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('#ff0000')
    expect(values).toContain('blue')
    expect(values).toContain('rgb(0, 255, 0)')
    expect(values).toContain('hsl(240, 100%, 50%)')
    expect(values).toContain('yellow')
    expect(values).not.toContain('none')
    expect(values).not.toContain('transparent')

    let yellowColor = colorInfos.find(info => info.value === 'yellow')
    expect(yellowColor?.source).toBe('css')
    expect(yellowColor?.property).toBe('fill')

    let greenColor = colorInfos.find(info => info.value === 'rgb(0, 255, 0)')
    expect(greenColor?.source).toBe('css')
    expect(greenColor?.property).toBe('color')
  })

  it('should handle multiple style tags and nested style blocks', () => {
    let svg = `<svg>
      <style>
        .outer { fill: red; }
        @media screen {
          .media { fill: green; }
        }
      </style>
      <g>
        <style>
          .inner { stroke: purple; }
        </style>
      </g>
      <rect class="outer" />
    </svg>`

    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('red')
    expect(values).toContain('green')
    expect(values).toContain('purple')

    let purpleColor = colorInfos.find(info => info.value === 'purple')
    expect(purpleColor?.source).toBe('css')
    expect(purpleColor?.property).toBe('stroke')
  })

  it('should handle style tags without content', () => {
    let svg = `<svg>
      <style></style>
      <rect fill="red" />
    </svg>`

    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('red')
    expect(colorInfos).toHaveLength(1)
  })

  it('should handle CSS properties with invalid format', () => {
    let svg = `<svg>
      <style>
        .invalid { color; }
        .valid { color: blue; }
      </style>
    </svg>`

    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('blue')
    expect(colorInfos).toHaveLength(1)

    let blueColor = colorInfos.find(info => info.value === 'blue')
    expect(blueColor?.source).toBe('css')
    expect(blueColor?.property).toBe('color')
  })

  it('should handle colors that appear both in attributes and inline', () => {
    let svg = `<svg>
      <rect fill="red" />
      #ff0000
      rgb(255, 0, 0)
      red
    </svg>`

    let colorInfos = extractColorsFromSvg(svg)

    let values = colorInfos.map(info => info.value)
    expect(values).toContain('red')
    expect(values).toContain('#ff0000')
    expect(values).toContain('rgb(255, 0, 0)')

    let redColor = colorInfos.find(info => info.value === 'red')
    expect(redColor?.source).toBe('attribute')
    expect(redColor?.property).toBe('fill')

    let hexColor = colorInfos.find(info => info.value === '#ff0000')
    expect(hexColor?.source).toBe('inline')

    let rgbColor = colorInfos.find(info => info.value === 'rgb(255, 0, 0)')
    expect(rgbColor?.source).toBe('inline')
  })
})
