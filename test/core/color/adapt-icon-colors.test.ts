import { beforeEach, describe, expect, it, vi } from 'vitest'
import { serialize } from '@texel/color'

import type { Config } from '../../../extension/types/config'
import type { Theme } from '../../../extension/types/theme'

import * as extractColorsModule from '../../../extension/core/color/extract-colors-from-svg'
import * as findClosestColorModule from '../../../extension/core/color/find-closest-color'
import * as replaceColorsModule from '../../../extension/core/color/replace-colors-in-svg'
import * as getFolderColorsModule from '../../../extension/core/color/get-folder-colors'
import { adaptIconColors } from '../../../extension/core/color/adapt-icon-colors'
import * as toOklchModule from '../../../extension/core/color/to-oklch'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('@texel/color', () => ({
  serialize: vi.fn(),
  OKLCH: 'OKLCH',
}))

vi.mock('../../../extension/io/vscode/logger', () => ({
  logger: {
    withContext: vi.fn(),
  },
}))

let mockTheme = {
  colors: ['#ff0000', '#00ff00'],
  overrides: {},
} as Theme

let mockConfig: Config = {
  processing: {
    extremeLightnessThresholds: {
      light: 0.9,
      dark: 0.1,
    },
    lowSaturationThreshold: 0.05,
    saturationFactor: 1.5,
    adjustContrast: true,
  },
} as Config

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

describe('adaptIconColors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(
      logger.withContext as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue(mockLoggerContext)

    vi.spyOn(extractColorsModule, 'extractColorsFromSvg').mockReturnValue([
      { source: 'attribute', value: '#ff0000', property: 'fill' },
      { source: 'attribute', property: 'stroke', value: '#00ff00' },
    ])

    vi.spyOn(getFolderColorsModule, 'getFolderColors').mockReturnValue(
      new Map([
        ['#ffca28', 'oklch(0.8 0.2 80)'],
        ['#ffa000', 'oklch(0.7 0.2 80)'],
      ]),
    )

    vi.spyOn(toOklchModule, 'toOklch').mockImplementation(color => {
      let colorMap = {
        '#00ff00': [0.8, 0.4, 120],
        '#ff0000': [0.5, 0.3, 0],
      }
      return colorMap[color as keyof typeof colorMap]
    })

    vi.spyOn(findClosestColorModule, 'findClosestColor').mockImplementation(
      color => color,
    )

    vi.mocked(serialize).mockImplementation(
      (vector, _format) => `oklch(${vector.join(' ')})`,
    )

    vi.spyOn(replaceColorsModule, 'replaceColorsInSvg').mockReturnValue(
      '<svg>modified</svg>',
    )
  })

  it('should return original SVG if no colors are found', () => {
    vi.spyOn(extractColorsModule, 'extractColorsFromSvg').mockReturnValue([])

    let svgContent = '<svg><rect fill="#ff0000" /></svg>'
    let result = adaptIconColors(
      { svgContent, id: 'test' },
      mockTheme,
      mockConfig,
    )

    expect(result).toBe(svgContent)
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Found 0 colors in icon',
    )
  })

  it('should apply theme overrides when available', () => {
    let svgContent = '<svg><rect fill="#ff0000" /></svg>'
    let themeWithOverrides: Theme = {
      ...mockTheme,
      overrides: {
        test: {
          '#ff0000': '#override-red',
        },
      },
    }

    adaptIconColors({ svgContent, id: 'test' }, themeWithOverrides, mockConfig)

    expect(replaceColorsModule.replaceColorsInSvg).toHaveBeenCalledWith(
      svgContent,
      expect.any(Map),
      expect.any(Array),
    )

    let [, callArguments] = vi.mocked(replaceColorsModule.replaceColorsInSvg)
      .mock.calls[0]!
    expect(callArguments.get('#ff0000')).toBe('#override-red')
  })

  it('should convert colors to OKLCH when no override exists', () => {
    let svgContent = '<svg><rect fill="#ff0000" /></svg>'
    let result = adaptIconColors(
      { svgContent, id: 'test' },
      mockTheme,
      mockConfig,
    )

    expect(toOklchModule.toOklch).toHaveBeenCalledWith('#ff0000')
    expect(findClosestColorModule.findClosestColor).toHaveBeenCalledWith(
      [0.5, 0.3, 0],
      expect.any(Array),
      mockConfig,
    )
    expect(result).toBe('<svg>modified</svg>')
  })

  it('should handle errors in color conversion', () => {
    let svgContent = '<svg><rect fill="#ff0000" /></svg>'
    vi.spyOn(toOklchModule, 'toOklch').mockImplementation(() => {
      throw new Error('Color conversion error')
    })

    let result = adaptIconColors(
      { svgContent, id: 'test' },
      mockTheme,
      mockConfig,
    )

    expect(result).toBe(svgContent)
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to adapt icon colors: Color conversion error',
    )
  })

  it('should handle non-Error exceptions', () => {
    let svgContent = '<svg><rect fill="#ff0000" /></svg>'
    let errorMessage = 'Some string error' as unknown as Error
    vi.spyOn(toOklchModule, 'toOklch').mockImplementation(() => {
      throw errorMessage
    })

    let result = adaptIconColors(
      { svgContent, id: 'test' },
      mockTheme,
      mockConfig,
    )

    expect(result).toBe(svgContent)
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to adapt icon colors: Some string error',
    )
  })

  it('should process multiple colors correctly', () => {
    let svgContent =
      '<svg><rect fill="#ff0000" /><circle stroke="#00ff00" /></svg>'

    adaptIconColors({ svgContent, id: 'test' }, mockTheme, mockConfig)

    expect(findClosestColorModule.findClosestColor).toHaveBeenCalledTimes(2)
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Found 2 colors in icon',
    )
  })

  it('should use getFolderColors for folder icons', () => {
    let svgContent =
      '<svg><rect fill="#ffca28" /><path stroke="#ffa000" /></svg>'

    adaptIconColors({ id: 'folder', svgContent }, mockTheme, mockConfig)

    expect(getFolderColorsModule.getFolderColors).toHaveBeenCalledWith(
      mockTheme,
    )

    expect(replaceColorsModule.replaceColorsInSvg).toHaveBeenCalledWith(
      svgContent,
      expect.any(Map),
      expect.any(Array),
    )

    expect(findClosestColorModule.findClosestColor).not.toHaveBeenCalled()
  })

  it('should use getFolderColors for folder-open icons', () => {
    let svgContent =
      '<svg><rect fill="#ffca28" /><path stroke="#ffa000" /></svg>'

    adaptIconColors({ id: 'folder-open', svgContent }, mockTheme, mockConfig)

    expect(getFolderColorsModule.getFolderColors).toHaveBeenCalledWith(
      mockTheme,
    )

    expect(replaceColorsModule.replaceColorsInSvg).toHaveBeenCalledWith(
      svgContent,
      expect.any(Map),
      expect.any(Array),
    )

    expect(findClosestColorModule.findClosestColor).not.toHaveBeenCalled()
  })
})
