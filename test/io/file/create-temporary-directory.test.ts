import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'

import { createTemporaryDirectory } from '../../../extension/io/file/create-temporary-directory'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('node:fs/promises', () => ({
  default: {
    mkdtemp: vi.fn(),
  },
}))

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

describe('createTemporaryDirectory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(logger, 'withContext').mockReturnValue(mockLoggerContext)

    vi.mocked(fs.mkdtemp).mockResolvedValue('/tmp/eyecons-abc123')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should create a temporary directory with the correct prefix', async () => {
    vi.spyOn(os, 'tmpdir').mockReturnValue('/tmp')

    let result = await createTemporaryDirectory()

    expect(fs.mkdtemp).toHaveBeenCalledWith(path.join('/tmp', 'eyecons-'))
    expect(result).toBe('/tmp/eyecons-abc123')
  })
  it('should log debug message when directory is created', async () => {
    await createTemporaryDirectory()

    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Created temporary directory: /tmp/eyecons-abc123',
    )
  })

  it('should log and throw error when directory creation fails', async () => {
    let mockError = new Error('Permission denied')
    vi.mocked(fs.mkdtemp).mockRejectedValueOnce(mockError)

    await expect(createTemporaryDirectory()).rejects.toThrowError(mockError)
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to create temporary directory: Permission denied',
    )
  })

  it('should handle non-Error objects in error handling', async () => {
    let errorObject = 'String error'
    vi.mocked(fs.mkdtemp).mockRejectedValueOnce(errorObject)

    await expect(createTemporaryDirectory()).rejects.toBe(errorObject)
    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to create temporary directory: String error',
    )
  })
})
