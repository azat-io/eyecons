import { beforeEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'

import { getIconSource } from '../../../extension/io/file/get-icon-source'
import { createMockConfig } from '../../helpers/create-mock-config'

vi.mock('node:fs/promises', () => ({
  default: {
    readFile: vi.fn(),
  },
}))

/**
 * Files in the fake file system, by path.
 */
let files = new Map<string, string>()

/**
 * Reads a file from the fake file system. Like Node.js, it returns text only
 * when an encoding is given and a buffer otherwise.
 *
 * @param file - Path of the file.
 * @param encoding - Encoding of the text to return.
 * @returns Promise with the content, rejected when the file is missing.
 */
function readFile(
  file: unknown,
  encoding?: unknown,
): Promise<Buffer<ArrayBuffer> | string> {
  let content = files.get(String(file))
  if (content === undefined) {
    return Promise.reject(new Error(`ENOENT: no such file, '${String(file)}'`))
  }
  return Promise.resolve(encoding ? content : Buffer.from(content))
}

describe('getIconSource', () => {
  let config = createMockConfig()

  beforeEach(() => {
    vi.resetAllMocks()
    files = new Map([
      ['/mock/extension/dist/icons/base/folder.svg', '<svg>folder</svg>'],
      ['/mock/extension/dist/icons/files/js.svg', '<svg>js</svg>'],
      ['/custom/icons/files/js.svg', '<svg>custom js</svg>'],
    ])
    vi.mocked(fs.readFile).mockImplementation(readFile)
  })

  it.each([
    ['folder', 'base', '<svg>folder</svg>'],
    ['js', 'files', '<svg>js</svg>'],
  ])(
    'should read the %s icon from the %s source directory as text',
    async (iconId, iconType, expected) => {
      await expect(getIconSource(iconId, iconType, config)).resolves.toBe(
        expected,
      )
    },
  )

  it('should read icons from the configured source directory', async () => {
    let customConfig = createMockConfig({ sourceIconsPath: '/custom/icons' })

    await expect(getIconSource('js', 'files', customConfig)).resolves.toBe(
      '<svg>custom js</svg>',
    )
  })

  it('should reject when the icon has no source file', async () => {
    await expect(getIconSource('unknown', 'files', config)).rejects.toThrow(
      "ENOENT: no such file, '/mock/extension/dist/icons/files/unknown.svg'",
    )
  })

  it('should rethrow a non-Error failure unchanged', async () => {
    let failure = 'Permission denied'
    vi.mocked(fs.readFile).mockRejectedValue(failure)

    await expect(getIconSource('js', 'files', config)).rejects.toBe(failure)
  })
})
