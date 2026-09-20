import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import { moveProcessedIcons } from '../../../extension/io/file/move-processed-icons'
import { createMockLoggerContext } from '../../helpers/create-mock-logger-context'
import { createMockConfig } from '../../helpers/create-mock-config'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('node:fs/promises', () => ({
  default: {
    mkdir: vi.fn(),
    cp: vi.fn(),
    rm: vi.fn(),
  },
}))

vi.mock('node:path', () => ({
  default: {
    dirname: vi.fn((pathName: string) =>
      pathName.split('/').slice(0, -1).join('/'),
    ),
  },
}))

vi.mock('../../../extension/io/vscode/logger', () => ({
  logger: {
    withContext: vi.fn(),
  },
}))

let mockLoggerContext = createMockLoggerContext()
let temporaryDirectory = '/tmp/eyecons-12345'

/**
 * Asserts the file system calls that copy icons into the output directory and
 * drop the temporary directory afterwards.
 *
 * @param sourceDirectory - Directory the icons are copied from.
 */
function expectIconsCopiedToOutput(sourceDirectory: string): void {
  expect(fs.mkdir).toHaveBeenCalledWith('icons', { recursive: true })
  expect(fs.rm).toHaveBeenCalledWith('icons/theme', {
    recursive: true,
    force: true,
  })
  expect(fs.cp).toHaveBeenCalledWith(sourceDirectory, 'icons/theme', {
    recursive: true,
  })
  expect(fs.rm).toHaveBeenCalledWith(sourceDirectory, {
    recursive: true,
    force: true,
  })
}

/**
 * Makes every file system call used while moving icons resolve successfully.
 */
function mockFileSystemSuccess(): void {
  vi.mocked(fs.mkdir).mockResolvedValue('')
  vi.mocked(fs.rm).mockResolvedValue()
  vi.mocked(fs.cp).mockResolvedValue()
}

describe('moveProcessedIcons', () => {
  let mockConfig = createMockConfig()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(logger.withContext).mockReturnValue(mockLoggerContext)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should move temporary directory to output directory', async () => {
    mockFileSystemSuccess()

    await moveProcessedIcons(temporaryDirectory, mockConfig)

    expect(path.dirname).toHaveBeenCalledWith('icons/theme')
    expectIconsCopiedToOutput(temporaryDirectory)

    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      `Moving icons from ${temporaryDirectory} to icons/theme`,
    )
    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Removed existing output directory: icons/theme',
    )
    expect(mockLoggerContext.info).toHaveBeenCalledWith(
      'Successfully copied icons to icons/theme',
    )
  })

  it('should handle error when output directory cannot be removed', async () => {
    mockFileSystemSuccess()
    vi.mocked(fs.rm)
      .mockRejectedValueOnce(new Error('Cannot remove directory'))
      .mockResolvedValueOnce()

    await moveProcessedIcons(temporaryDirectory, mockConfig)

    expectIconsCopiedToOutput(temporaryDirectory)

    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Output directory did not exist or could not be removed: icons/theme',
    )
  })

  it('should handle error when output directory cannot be removed with string error', async () => {
    mockFileSystemSuccess()
    vi.mocked(fs.rm)
      .mockRejectedValueOnce('Cannot remove directory')
      .mockResolvedValueOnce()

    await moveProcessedIcons(temporaryDirectory, mockConfig)

    expectIconsCopiedToOutput(temporaryDirectory)

    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Output directory did not exist or could not be removed: icons/theme',
    )
  })

  it('should throw and log error when copy fails', async () => {
    let error = new Error('Copy failed')

    mockFileSystemSuccess()
    vi.mocked(fs.cp).mockRejectedValue(error)

    await expect(
      moveProcessedIcons(temporaryDirectory, mockConfig),
    ).rejects.toThrow(error)

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to move icons: Copy failed',
    )
  })

  it('should throw and log error when copy fails with string error', async () => {
    let error = 'Copy failed'

    mockFileSystemSuccess()
    vi.mocked(fs.cp).mockRejectedValue(error)

    await expect(
      moveProcessedIcons(temporaryDirectory, mockConfig),
    ).rejects.toThrow(error)

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to move icons: Copy failed',
    )
  })

  it('should throw and log error when mkdir fails', async () => {
    let error = new Error('Mkdir failed')

    vi.mocked(fs.mkdir).mockRejectedValue(error)

    await expect(
      moveProcessedIcons(temporaryDirectory, mockConfig),
    ).rejects.toThrow(error)

    expect(mockLoggerContext.error).toHaveBeenCalledWith(
      'Failed to move icons: Mkdir failed',
    )
    expect(fs.rm).not.toHaveBeenCalled()
    expect(fs.cp).not.toHaveBeenCalled()
  })
})
