import { describe, expect, it } from 'vitest'

import { override } from '../../extension/colorize/override'

describe('override', () => {
  it('should replace color with override', () => {
    let source = `<svg><path fill="#000" /></svg>`
    let overrides = {
      icon: {
        '#000': '#fff',
      },
    }
    let result = override('icon', overrides, source)
    expect(result).toBe(`<svg><path fill="#fff" /></svg>`)
  })

  it('should replace multiple colors with override', () => {
    let source = `<svg><path fill="#ccc" /><path fill="#eee" /></svg>`
    let overrides = {
      icon: {
        '#ccc': '#fff',
        '#eee': '#000',
      },
    }
    let result = override('icon', overrides, source)
    expect(result).toBe(`<svg><path fill="#fff" /><path fill="#000" /></svg>`)
  })

  it('should not replace color without override', () => {
    let source = `<svg><path fill="#000" /></svg>`
    let overrides = {
      icon: {
        '#fff': '#000',
      },
    }
    let result = override('icon', overrides, source)
    expect(result).toBe(`<svg><path fill="#000" /></svg>`)
  })

  it('should not replace color without overrides', () => {
    let source = `<svg><path fill="#000" /></svg>`
    let overrides = {
      button: {
        '#000': '#fff',
      },
    }
    let result = override('icon', overrides, source)
    expect(result).toBe(`<svg><path fill="#000" /></svg>`)
  })
})
