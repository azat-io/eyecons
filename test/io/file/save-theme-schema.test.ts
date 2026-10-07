import type { MakeDirectoryOptions } from 'node:fs'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'

import { createMockThemeSchema } from '../../helpers/create-mock-theme-schema'
import { saveThemeSchema } from '../../../extension/io/file/save-theme-schema'
import { createMockConfig } from '../../helpers/create-mock-config'

vi.mock('node:fs/promises', () => ({
  default: {
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  },
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

describe('saveThemeSchema', () => {
  let config = createMockConfig()
  let schema = createMockThemeSchema()

  beforeEach(() => {
    vi.resetAllMocks()
    directories = new Set(['/'])
    files.clear()
    vi.mocked(fs.mkdir).mockImplementation(makeDirectory)
    vi.mocked(fs.writeFile).mockImplementation(writeFile)
  })

  it('should write the theme definition as JSON to its path', async () => {
    await saveThemeSchema(schema, config)

    let written = files.get('/mock/extension/dist/output/definitions.json')
    expect(JSON.parse(written!)).toEqual(schema)
  })

  it('should rethrow when the directory of the theme definition cannot be created', async () => {
    let error = new Error('Permission denied')
    vi.mocked(fs.mkdir).mockRejectedValue(error)

    await expect(saveThemeSchema(schema, config)).rejects.toBe(error)
  })

  it('should rethrow when the theme definition cannot be written', async () => {
    let error = new Error('Disk is full')
    vi.mocked(fs.writeFile).mockRejectedValue(error)

    await expect(saveThemeSchema(schema, config)).rejects.toBe(error)
  })

  it('should rethrow a non-Error failure unchanged', async () => {
    let failure = 'Disk is full'
    vi.mocked(fs.mkdir).mockRejectedValue(failure)

    await expect(saveThemeSchema(schema, config)).rejects.toBe(failure)
  })
})
