import type { MakeDirectoryOptions } from 'node:fs'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import type { FormattedIconValue } from '../../../extension/types/icon'

import { processSingleIcon } from '../../../extension/core/build/process-single-icon'
import { getIconSource } from '../../../extension/io/file/get-icon-source'
import { createMockConfig } from '../../helpers/create-mock-config'
import { createMockTheme } from '../../helpers/create-mock-theme'

vi.mock('node:fs/promises', () => ({
  default: {
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  },
}))

vi.mock('../../../extension/io/file/get-icon-source', () => ({
  getIconSource: vi.fn(),
}))

/**
 * Directories created in the fake file system.
 */
let directories = new Set<string>()

/**
 * Files written to the fake file system, by path.
 */
let files = new Map<string, string>()

/**
 * Creates a directory in the fake file system. Like Node.js, it fails without
 * `recursive` when the directory exists or its parent is missing.
 *
 * @param directory - Path of the directory.
 * @param options - Options of `fs.mkdir`.
 * @returns Promise that resolves when the directory exists.
 */
function makeDirectory(
  directory: unknown,
  options?: unknown,
): Promise<undefined> {
  let target = String(directory)
  let { recursive } = (options ?? {}) as MakeDirectoryOptions
  if (!recursive && directories.has(target)) {
    return Promise.reject(new Error(`EEXIST: '${target}' already exists`))
  }
  if (!recursive && !directories.has(path.dirname(target))) {
    return Promise.reject(new Error(`ENOENT: no such directory, '${target}'`))
  }
  for (
    let current = target;
    !directories.has(current);
    current = path.dirname(current)
  ) {
    directories.add(current)
  }
  return Promise.resolve(undefined)
}

/**
 * Writes a file to the fake file system. Like Node.js, it fails when the
 * directory of the file does not exist.
 *
 * @param file - Path of the file.
 * @param content - Text written into the file.
 * @returns Promise that resolves when the file is written.
 */
function writeFile(file: unknown, content: unknown): Promise<void> {
  let directory = path.dirname(String(file))
  if (!directories.has(directory)) {
    return Promise.reject(
      new Error(`ENOENT: no such directory, '${directory}'`),
    )
  }
  files.set(String(file), String(content))
  return Promise.resolve()
}

describe('processSingleIcon', () => {
  let config = createMockConfig()
  let theme = createMockTheme()
  let temporaryDirectory = '/tmp/eyecons-abc123'

  let html: FormattedIconValue = {
    extensions: ['html', 'htm'],
    theme: 'dark',
    type: 'files',
    name: 'HTML',
    id: 'html',
  }

  beforeEach(() => {
    vi.resetAllMocks()
    directories = new Set(['/'])
    files.clear()
    vi.mocked(fs.mkdir).mockImplementation(makeDirectory)
    vi.mocked(fs.writeFile).mockImplementation(writeFile)
    vi.mocked(getIconSource).mockResolvedValue(
      '<svg><path fill="#ff0000" d="M0 0h1"/></svg>',
    )
  })

  it('should write the icon in theme colors to the temporary directory', async () => {
    await processSingleIcon({ temporaryDirectory, icon: html }, theme, config)

    expect([...files]).toEqual([
      [
        expect.stringMatching(
          /^\/tmp\/eyecons-abc123\/files\/html--[\da-f]{8}\.svg$/u,
        ),
        `<svg><path fill="${theme.main.red}" d="M0 0h1"/></svg>`,
      ],
    ])
  })

  it('should point the theme at the written icon', async () => {
    let result = await processSingleIcon(
      { temporaryDirectory, icon: html },
      theme,
      config,
    )

    let [writtenFile] = files.keys()
    expect(result).toEqual({
      iconPath: `./icons/files/${path.basename(writtenFile!)}`,
      id: 'html',
    })
  })

  it('should rethrow when the icon source cannot be read and write nothing', async () => {
    let error = new Error('Failed to read source for icon html')
    vi.mocked(getIconSource).mockRejectedValue(error)

    await expect(
      processSingleIcon({ temporaryDirectory, icon: html }, theme, config),
    ).rejects.toBe(error)
    expect(files.size).toBe(0)
  })

  it('should rethrow a non-Error failure unchanged', async () => {
    let failure = 'Disk is full'
    vi.mocked(fs.mkdir).mockRejectedValue(failure)

    await expect(
      processSingleIcon({ temporaryDirectory, icon: html }, theme, config),
    ).rejects.toBe(failure)
  })
})
