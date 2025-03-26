import { beforeEach, describe, expect, it, vi } from 'vitest'
import { serialize, OKLCH } from '@texel/color'

import type { Theme } from '../../../extension/types/theme'

import { getFolderColors } from '../../../extension/core/color/get-folder-colors'
import * as toOklchModule from '../../../extension/core/color/to-oklch'

const FOLDER_PRIMARY_COLOR = '#ffca28'
const FOLDER_SECONDARY_COLOR = '#ffa000'

vi.mock('@texel/color', () => ({
  serialize: vi.fn(),
  OKLCH: 'OKLCH',
}))

vi.mock('../../../extension/core/color/to-oklch', () => ({
  toOklch: vi.fn(),
}))

describe('getFolderColors', () => {
  let mockTheme: Theme

  beforeEach(() => {
    vi.clearAllMocks()

    mockTheme = {
      main: {
        orange: '#ff9800',
        yellow: '#ffeb3b',
        purple: '#9c27b0',
        green: '#4caf50',
        blue: '#2196f3',
        red: '#f44336',
      },
      folderColor: 'blue',
    } as Theme

    vi.mocked(toOklchModule.toOklch).mockImplementation((color: string) => {
      let colorMap: Record<string, [number, number, number]> = {
        '#2196f3': [0.6, 0.2, 240],
        '#ff9800': [0.7, 0.3, 30],
      }
      return colorMap[color] ?? [0, 0, 0]
    })

    vi.mocked(serialize).mockImplementation(
      (vector, _format) => `oklch(${vector.join(' ')})`,
    )
  })

  it('should use the specified folder color when it is a valid key', () => {
    mockTheme.folderColor = 'orange'

    getFolderColors(mockTheme)

    expect(toOklchModule.toOklch).toHaveBeenCalledWith('#ff9800')
  })

  it('should use blue as default when folderColor is not a valid key', () => {
    mockTheme.folderColor = 'invalid-color'

    getFolderColors(mockTheme)

    expect(toOklchModule.toOklch).toHaveBeenCalledWith('#2196f3')
  })

  it('should create a Map with primary and secondary folder colors', () => {
    mockTheme.folderColor = 'blue'

    vi.mocked(toOklchModule.toOklch).mockReturnValue([0.6, 0.2, 240])

    vi.mocked(serialize)
      .mockReturnValueOnce('oklch(0.6 0.2 240)')
      .mockReturnValueOnce('oklch(0.5 0.2 240)')

    let result = getFolderColors(mockTheme)

    expect(result.get(FOLDER_PRIMARY_COLOR)).toBe('oklch(0.6 0.2 240)')
    expect(result.get(FOLDER_SECONDARY_COLOR)).toBe('oklch(0.5 0.2 240)')
    expect(result.size).toBe(2)
  })

  it('should calculate secondary color by reducing lightness by 0.1', () => {
    mockTheme.folderColor = 'blue'

    vi.mocked(toOklchModule.toOklch).mockReturnValue([0.6, 0.2, 240])

    getFolderColors(mockTheme)

    expect(serialize).toHaveBeenCalledWith([0.6, 0.2, 240], OKLCH)
    expect(serialize).toHaveBeenCalledWith([0.5, 0.2, 240], OKLCH)
  })

  it('should handle different folder colors correctly', () => {
    let testCases = [
      { expectedColor: '#f44336', folderColor: 'red' },
      { expectedColor: '#4caf50', folderColor: 'green' },
      { expectedColor: '#9c27b0', folderColor: 'purple' },
      { expectedColor: '#ffeb3b', folderColor: 'yellow' },
    ]

    for (let { expectedColor, folderColor } of testCases) {
      vi.clearAllMocks()
      mockTheme.folderColor = folderColor

      getFolderColors(mockTheme)

      expect(toOklchModule.toOklch).toHaveBeenCalledWith(expectedColor)
    }
  })
})
