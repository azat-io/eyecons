import { parse } from 'svg-parser'

interface SvgInfo {
  background: string
  foreground: string
}

export let parseSvg = (svg: string): SvgInfo | null => {
  let ast = parse(svg)
  let [root] = ast.children
  let background: string | null = null
  let foreground: string | null = null
  if (
    root.type === 'element' &&
    root.tagName === 'svg' &&
    typeof root.properties?.viewBox === 'string' &&
    root.children.filter(
      child =>
        typeof child === 'object' &&
        child.type === 'element' &&
        child.tagName === 'path',
    ).length === 1
  ) {
    for (let child of root.children) {
      if (
        typeof child === 'object' &&
        child.type === 'element' &&
        typeof child.properties?.fill === 'string'
      ) {
        if (child.tagName === 'rect') {
          background = child.properties.fill
        } else if (child.tagName === 'path') {
          foreground = child.properties.fill
        }
      }
    }
  }

  if (background && foreground) {
    return {
      background,
      foreground,
    }
  }

  return null
}
