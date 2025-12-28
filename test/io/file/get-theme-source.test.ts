import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import { getThemeSource } from '../../../extension/io/file/get-theme-source'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('node:fs/promises', () => ({
  default: {
    readFile: vi.fn(),
  },
}))

vi.mock('node:path', () => ({
  default: {
    join: vi.fn(),
  },
}))

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

describe('getThemeSource', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(path.join).mockReturnValue('/mocked/path/to/themes/dark.json')
    vi.spyOn(logger, 'withContext').mockReturnValue(mockLoggerContext)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should load and parse theme source correctly', async () => {
    let mockThemeData = {
      overrides: {
        html: {
          '#f06529': '#ce9178',
        },
        less: {
          '#1d355d': '#569cd6',
        },
      },
      colors: ['#d16969', '#ce9178', '#dcdcaa', '#4ec9b0', '#569cd6'],
    }

    vi.mocked(fs.readFile).mockResolvedValue(
      Buffer.from(JSON.stringify(mockThemeData)),
    )

    let result = await getThemeSource('dark')

    expect(result).toEqual(mockThemeData)
    expect(path.join).toHaveBeenCalledWith(
      expect.any(String),
      '../../../themes',
      'dark.json',
    )
    expect(fs.readFile).toHaveBeenCalledWith('/mocked/path/to/themes/dark.json')
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Loading theme from: /mocked/path/to/themes/dark.json',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Successfully loaded theme: dark',
    )
  })

  it('should throw an error when the file cannot be read', async () => {
    let mockError = new Error('File not found')
    vi.mocked(fs.readFile).mockRejectedValue(mockError)

    await expect(getThemeSource('unknown')).rejects.toThrowError(
      'Failed to load theme unknown',
    )
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to load theme unknown: File not found',
    )
  })

  it('should throw an error when the file cannot be read and error is string', async () => {
    let mockError = 'File not found'
    vi.mocked(fs.readFile).mockRejectedValue(mockError)

    await expect(getThemeSource('unknown')).rejects.toThrowError(
      'Failed to load theme unknown',
    )
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to load theme unknown: File not found',
    )
  })

  it('should throw an error when JSON parsing fails', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(
      Buffer.from('invalid JSON content'),
    )

    await expect(getThemeSource('broken')).rejects.toThrowError(
      'Failed to load theme broken',
    )

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to load theme broken:'),
    )
  })
})
