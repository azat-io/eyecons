import type { MakeDirectoryOptions, CopyOptions, RmOptions } from 'node:fs'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import { moveProcessedIcons } from '../../../extension/io/file/move-processed-icons'
import { createMockConfig } from '../../helpers/create-mock-config'

vi.mock('node:fs/promises', () => ({
  default: {
    mkdir: vi.fn(),
    cp: vi.fn(),
    rm: vi.fn(),
  },
}))

/*
 * The fake file system follows Node.js: without `recursive`, `mkdir` fails on
 * an existing directory or a missing parent, while `cp` and `rm` refuse to
 * touch a directory; without `force`, `rm` fails on a missing path.
 */

/**
 * Files in the fake file system, by path.
 */
let files = new Map<string, string>()

/**
 * Directories in the fake file system.
 */
let directories = new Set<string>()

/**
 * Removes a whole directory from the fake file system.
 *
 * @param target - Path to remove.
 * @param options - Options of `fs.rm`.
 * @returns Promise that resolves when nothing is left at the path.
 */
function remove(target: unknown, options?: RmOptions): Promise<void> {
  let directory = String(target)
  if (!directories.has(directory)) {
    return options?.force ?
        Promise.resolve()
      : Promise.reject(new Error(`ENOENT: no such directory, '${directory}'`))
  }
  if (!options?.recursive) {
    return Promise.reject(new Error(`EISDIR: '${directory}' is a directory`))
  }
  let nestedFiles = listFiles(directory)
  for (let file of nestedFiles) {
    files.delete(`${directory}/${file}`)
  }
  let nestedDirectories = directories
    .values()
    .toArray()
    .filter(
      current => current === directory || current.startsWith(`${directory}/`),
    )
  for (let current of nestedDirectories) {
    directories.delete(current)
  }
  return Promise.resolve()
}

/**
 * Copies a whole directory within the fake file system.
 *
 * @param source - Directory to copy.
 * @param destination - Directory to copy into.
 * @param options - Options of `fs.cp`.
 * @returns Promise that resolves when every file is copied.
 */
function copy(
  source: unknown,
  destination: unknown,
  options?: CopyOptions,
): Promise<void> {
  let sourceDirectory = String(source)
  if (!directories.has(sourceDirectory)) {
    return Promise.reject(
      new Error(`ENOENT: no such directory, '${sourceDirectory}'`),
    )
  }
  if (!options?.recursive) {
    return Promise.reject(
      new Error(`EISDIR: '${sourceDirectory}' is a directory`),
    )
  }
  let sourceFiles = listFiles(sourceDirectory)
  for (let file of sourceFiles) {
    writeFile(
      `${String(destination)}/${file}`,
      files.get(`${sourceDirectory}/${file}`)!,
    )
  }
  return Promise.resolve()
}

/**
 * Creates a directory in the fake file system.
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
  addDirectory(target)
  return Promise.resolve(undefined)
}

/**
 * Lists the files inside a directory of the fake file system.
 *
 * @param directory - Directory to look into.
 * @returns Paths of the files relative to the directory, sorted.
 */
function listFiles(directory: string): string[] {
  return files
    .keys()
    .toArray()
    .filter(file => file.startsWith(`${directory}/`))
    .map(file => file.slice(directory.length + 1))
    .toSorted()
}

/**
 * Adds a directory and its missing parents to the fake file system.
 *
 * @param directory - Path of the directory.
 */
function addDirectory(directory: string): void {
  for (
    let current = directory;
    !directories.has(current);
    current = path.dirname(current)
  ) {
    directories.add(current)
  }
}

/**
 * Writes a file and its missing parent directories to the fake file system.
 *
 * @param file - Path of the file.
 * @param content - Text written into the file.
 */
function writeFile(file: string, content: string): void {
  addDirectory(path.dirname(file))
  files.set(file, content)
}

describe('moveProcessedIcons', () => {
  let config = createMockConfig()
  let outputIconsPath = '/mock/extension/dist/output/icons'
  let temporaryDirectory = '/tmp/eyecons-abc123'

  beforeEach(() => {
    vi.resetAllMocks()
    files = new Map()
    directories = new Set(['/'])
    writeFile(`${temporaryDirectory}/base/file--new.svg`, '<svg>new file</svg>')
    writeFile(`${temporaryDirectory}/files/js--new.svg`, '<svg>js</svg>')
    writeFile(`${outputIconsPath}/base/file--old.svg`, '<svg>old file</svg>')
    writeFile(`${outputIconsPath}/files/legacy--old.svg`, '<svg>legacy</svg>')
    vi.mocked(fs.mkdir).mockImplementation(makeDirectory)
    vi.mocked(fs.rm).mockImplementation(remove)
    vi.mocked(fs.cp).mockImplementation(copy)
  })

  it('should replace the previous icons with the processed ones', async () => {
    await moveProcessedIcons(temporaryDirectory, config)

    expect(listFiles(outputIconsPath)).toEqual([
      'base/file--new.svg',
      'files/js--new.svg',
    ])
    expect(files.get(`${outputIconsPath}/files/js--new.svg`)).toBe(
      '<svg>js</svg>',
    )
  })

  it('should move the processed icons when there are no previous icons yet', async () => {
    await remove(path.dirname(outputIconsPath), { recursive: true })

    await moveProcessedIcons(temporaryDirectory, config)

    expect(listFiles(outputIconsPath)).toEqual([
      'base/file--new.svg',
      'files/js--new.svg',
    ])
  })

  it('should remove the temporary directory', async () => {
    await moveProcessedIcons(temporaryDirectory, config)

    expect(listFiles(temporaryDirectory)).toEqual([])
    expect(directories.has(temporaryDirectory)).toBeFalsy()
  })

  it('should still move the processed icons when the previous ones cannot be removed', async () => {
    vi.mocked(fs.rm).mockRejectedValueOnce(new Error('Directory is busy'))

    await moveProcessedIcons(temporaryDirectory, config)

    expect(listFiles(outputIconsPath)).toEqual(
      expect.arrayContaining(['base/file--new.svg', 'files/js--new.svg']),
    )
    expect(listFiles(temporaryDirectory)).toEqual([])
  })

  it('should still move the processed icons when removing the previous ones fails with a non-Error value', async () => {
    vi.mocked(fs.rm).mockRejectedValueOnce('Directory is busy')

    await moveProcessedIcons(temporaryDirectory, config)

    expect(listFiles(outputIconsPath)).toEqual(
      expect.arrayContaining(['base/file--new.svg', 'files/js--new.svg']),
    )
  })

  it('should keep the previous icons when the output directory cannot be prepared', async () => {
    let error = new Error('Permission denied')
    vi.mocked(fs.mkdir).mockRejectedValue(error)

    await expect(moveProcessedIcons(temporaryDirectory, config)).rejects.toBe(
      error,
    )
    expect(listFiles(outputIconsPath)).toEqual([
      'base/file--old.svg',
      'files/legacy--old.svg',
    ])
  })

  it('should rethrow when the processed icons cannot be copied', async () => {
    let error = new Error('Disk is full')
    vi.mocked(fs.cp).mockRejectedValue(error)

    await expect(moveProcessedIcons(temporaryDirectory, config)).rejects.toBe(
      error,
    )
  })

  it('should rethrow a non-Error failure unchanged', async () => {
    let failure = 'Disk is full'
    vi.mocked(fs.cp).mockRejectedValue(failure)

    await expect(moveProcessedIcons(temporaryDirectory, config)).rejects.toBe(
      failure,
    )
  })
})
