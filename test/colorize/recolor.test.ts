import { describe, expect, it } from 'vitest'
import dedent from 'dedent'

import { recolor } from '../../extension/colorize/recolor'

describe('colorize', () => {
  let theme = {
    colors: ['#ff0000', '#00ff00', '#0000ff', '#66cc66', '#eeeeee'],
  }

  it('should colorize source code', () => {
    let source = dedent`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#dc143c" />
      </svg>`
    let result = recolor(theme, source)

    expect(result).toBe(dedent`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#ff0000" />
      </svg>`)
  })

  it('colorizes source code with light colors', () => {
    let source = dedent`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#fff" />
      </svg>`
    let result = recolor(theme, source)

    expect(result).toBe(dedent`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#eeeeee" />
      </svg>`)
  })

  it('colorizes source code with dark colors', () => {
    let source = dedent`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#000" />
      </svg>`
    let result = recolor(theme, source)

    expect(result).toBe(dedent`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#0000ff" />
      </svg>`)
  })
})
