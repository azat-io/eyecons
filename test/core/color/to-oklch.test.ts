import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { hexToRGB as hexToRgb, convert } from '@texel/color'

import {
  NAMED_COLORS,
  RGB_REGEX,
  HSL_REGEX,
} from '../../../extension/core/color/constants'
import { toOklch } from '../../../extension/core/color/to-oklch'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('@texel/color', () => ({
  hexToRGB: vi.fn(),
  convert: vi.fn(),
  OKLCH: 'OKLCH',
  OKHSL: 'OKHSL',
  sRGB: 'sRGB',
}))

vi.mock('../../../extension/io/vscode/logger', () => ({
  logger: {
    withContext: vi.fn(() => ({
      error: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
    })),
  },
}))

vi.mock('../../../extension/core/color/constants', () => ({
  RGB_REGEX: {
    exec: vi.fn(),
    lastIndex: 0,
  },
  HSL_REGEX: {
    exec: vi.fn(),
    lastIndex: 0,
  },
  NAMED_COLORS: {
    get: vi.fn(),
  },
}))

describe('toOklch', () => {
  let mockLoggerContext = {
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(hexToRgb).mockReturnValue([1, 0, 0])
    vi.mocked(convert).mockReturnValue([0.5, 0.3, 0.2])

    vi.mocked(RGB_REGEX.exec).mockReturnValue({
      groups: { r: '255', g: '0', b: '0' },
    } as unknown as RegExpExecArray)

    vi.mocked(HSL_REGEX.exec).mockReturnValue({
      groups: { s: '100', l: '50', h: '0' },
    } as unknown as RegExpExecArray)

    vi.mocked(NAMED_COLORS.get).mockReturnValue([255, 0, 0])

    vi.mocked(logger.withContext).mockReturnValue(mockLoggerContext)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should convert hex color to OKLCH', () => {
    let result = toOklch('#ff0000')

    expect(hexToRgb).toHaveBeenCalledWith('#ff0000')
    expect(convert).toHaveBeenCalledWith([1, 0, 0], 'sRGB', 'OKLCH')
    expect(result).toEqual([0.5, 0.3, 0.2])
  })

  it('should convert RGB color to OKLCH', () => {
    let result = toOklch('rgb(255, 0, 0)')

    expect(RGB_REGEX.exec).toHaveBeenCalledWith('rgb(255, 0, 0)')
    expect(convert).toHaveBeenCalledWith([1, 0, 0], 'sRGB', 'OKLCH')
    expect(result).toEqual([0.5, 0.3, 0.2])
  })

  it('should convert HSL color to OKLCH', () => {
    let result = toOklch('hsl(0, 100%, 50%)')

    expect(HSL_REGEX.exec).toHaveBeenCalledWith('hsl(0, 100%, 50%)')
    expect(convert).toHaveBeenCalledWith([0, 100, 50], 'OKHSL', 'sRGB')
    expect(result).toEqual([0.5, 0.3, 0.2])
  })

  it('should convert named color to OKLCH', () => {
    let result = toOklch('red')

    expect(NAMED_COLORS.get).toHaveBeenCalledWith('red')
    expect(convert).toHaveBeenCalledWith([1, 0, 0], 'sRGB', 'OKLCH')
    expect(result).toEqual([0.5, 0.3, 0.2])
  })

  it('should handle errors for invalid hex color', () => {
    vi.mocked(hexToRgb).mockImplementationOnce(() => {
      throw new Error('Invalid hex color')
    })

    expect(() => toOklch('#invalid')).toThrowError('Invalid hex color')
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to convert color: Invalid hex color',
    )
  })

  it('should handle errors for invalid hex color with string error', () => {
    let error = 'Invalid hex color' as unknown as Error
    vi.mocked(hexToRgb).mockImplementationOnce(() => {
      throw error
    })

    expect(() => toOklch('#invalid')).toThrowError('Invalid hex color')
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to convert color: Invalid hex color',
    )
  })

  it('should handle errors for invalid RGB format', () => {
    vi.mocked(RGB_REGEX.exec).mockReturnValueOnce(null)

    expect(() => toOklch('rgb(invalid)')).toThrowError(
      'Failed to parse RGB string: "rgb(invalid)"',
    )
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to convert color: Failed to parse RGB string: "rgb(invalid)"',
    )
  })

  it('should handle errors for invalid HSL format', () => {
    vi.mocked(HSL_REGEX.exec).mockReturnValueOnce(null)

    expect(() => toOklch('hsl(invalid)')).toThrowError(
      'Failed to parse HSL string: "hsl(invalid)"',
    )
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to convert color: Failed to parse HSL string: "hsl(invalid)"',
    )
  })

  it('should handle errors for unrecognized named color', () => {
    vi.mocked(NAMED_COLORS.get).mockReturnValueOnce(undefined)

    expect(() => toOklch('nonexistentcolor')).toThrowError()
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to convert color: Color "nonexistentcolor" is not recognized.',
    )
  })
})
