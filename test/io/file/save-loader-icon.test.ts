import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import { createMockLoggerContext } from '../../helpers/create-mock-logger-context'
import { toRelativePath } from '../../../extension/core/build/to-relative-path'
import { saveLoaderIcon } from '../../../extension/io/file/save-loader-icon'
import { createMockConfig } from '../../helpers/create-mock-config'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('../../../extension/core/build/to-relative-path', () => ({
  toRelativePath: vi.fn(),
}))

let mockMkdir = vi.fn().mockResolvedValue(null)
let mockWriteFile = vi.fn().mockResolvedValue(null)
let mockJoin = vi.fn((...arguments_) => arguments_.join('/'))

let mockLoggerContext = createMockLoggerContext()

describe('saveLoaderIcon', () => {
  let mockLoaderSvg = '<svg>Test Loader</svg>'

  let mockConfig = createMockConfig({
    iconDefinitionsPath: 'theme/index.json',
  })

  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(fs, 'mkdir').mockImplementation(mockMkdir)
    vi.spyOn(fs, 'writeFile').mockImplementation(mockWriteFile)
    vi.spyOn(path, 'join').mockImplementation(mockJoin)
    vi.mocked(toRelativePath).mockReturnValue('./icons/loader.svg')

    vi.spyOn(logger, 'withContext').mockReturnValue(mockLoggerContext)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should create directory for output icons if it does not exist', async () => {
    await saveLoaderIcon(mockLoaderSvg, mockConfig)

    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Creating directory for output icons: icons/theme',
    )
    expect(fs.mkdir).toHaveBeenCalledWith('icons/theme', {
      recursive: true,
    })
  })

  it('should save loader icon to the output directory', async () => {
    await saveLoaderIcon(mockLoaderSvg, mockConfig)

    expect(path.join).toHaveBeenCalledWith('icons/theme', 'loader.svg')
    expect(fs.writeFile).toHaveBeenCalledWith(
      'icons/theme/loader.svg',
      mockLoaderSvg,
      'utf8',
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Loader icon saved to: icons/theme/loader.svg',
    )
  })

  it('should call toRelativePath with correct parameters', async () => {
    await saveLoaderIcon(mockLoaderSvg, mockConfig)

    expect(toRelativePath).toHaveBeenCalledWith(
      'icons/theme/loader.svg',
      mockConfig,
    )
  })

  it('should return the path from toRelativePath function', async () => {
    let result = await saveLoaderIcon(mockLoaderSvg, mockConfig)

    expect(result).toBe('./icons/loader.svg')
  })

  it('should log and rethrow errors from mkdir', async () => {
    let error = new Error('Test error')
    mockMkdir.mockRejectedValueOnce(error)

    await expect(saveLoaderIcon(mockLoaderSvg, mockConfig)).rejects.toThrow(
      error,
    )
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to save loader icon: Test error',
    )
  })

  it('should log and rethrow errors from writeFile', async () => {
    let error = new Error('Test error')
    mockWriteFile.mockRejectedValueOnce(error)

    await expect(saveLoaderIcon(mockLoaderSvg, mockConfig)).rejects.toThrow(
      error,
    )
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to save loader icon: Test error',
    )
  })

  it('should handle non-Error objects in error handling', async () => {
    let errorObject = 'String error'
    mockMkdir.mockRejectedValueOnce(errorObject)

    await expect(saveLoaderIcon(mockLoaderSvg, mockConfig)).rejects.toBe(
      errorObject,
    )
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to save loader icon: String error',
    )
  })
})
