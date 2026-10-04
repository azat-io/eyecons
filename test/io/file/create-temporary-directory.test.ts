import { beforeEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'

import { createTemporaryDirectory } from '../../../extension/io/file/create-temporary-directory'

vi.mock('node:fs/promises', () => ({
  default: {
    mkdtemp: vi.fn(),
  },
}))

describe('createTemporaryDirectory', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(fs.mkdtemp).mockImplementation(prefix =>
      Promise.resolve(`${prefix}abc123`),
    )
  })

  it('should create a uniquely named eyecons directory in the system temporary directory', async () => {
    await expect(createTemporaryDirectory()).resolves.toBe(
      path.join(os.tmpdir(), 'eyecons-abc123'),
    )
  })

  it('should rethrow when the directory cannot be created', async () => {
    let error = new Error('Permission denied')
    vi.mocked(fs.mkdtemp).mockRejectedValue(error)

    await expect(createTemporaryDirectory()).rejects.toBe(error)
  })

  it('should rethrow a non-Error failure unchanged', async () => {
    let failure = 'Permission denied'
    vi.mocked(fs.mkdtemp).mockRejectedValue(failure)

    await expect(createTemporaryDirectory()).rejects.toBe(failure)
  })
})
