import { beforeEach, describe, expect, it, vi } from 'vitest'
import path from 'node:path'

import { createTemporaryDirectory } from '../../../extension/io/file/create-temporary-directory'
import { processSingleIcon } from '../../../extension/core/build/process-single-icon'
import { processIcons } from '../../../extension/core/build/process-icons'
import { createMockConfig } from '../../helpers/create-mock-config'
import { createMockTheme } from '../../helpers/create-mock-theme'

vi.mock('../../../extension/io/file/create-temporary-directory', () => ({
  createTemporaryDirectory: vi.fn(),
}))

vi.mock('../../../extension/core/build/process-single-icon', () => ({
  processSingleIcon: vi.fn(),
}))

vi.mock('../../../data/base-icons', () => ({
  baseIcons: [
    { name: 'File', light: true, id: 'file' },
    { name: 'Folder', id: 'folder' },
  ],
}))

vi.mock('../../../data/file-icons', () => ({
  fileIcons: [
    { extensions: ['html', 'htm'], name: 'HTML', id: 'html' },
    {
      files: ['script.js'],
      extensions: ['js'],
      name: 'JavaScript',
      light: true,
      id: 'js',
    },
  ],
}))

describe('processIcons', () => {
  let config = createMockConfig()
  let theme = createMockTheme()
  let temporaryDirectory = '/tmp/eyecons-abc123'

  /**
   * Icons the faked `processSingleIcon` wrote, as `<directory>/<type>/<id>`.
   */
  let writtenIcons: string[] = []

  beforeEach(() => {
    vi.resetAllMocks()
    writtenIcons = []
    vi.mocked(createTemporaryDirectory).mockResolvedValue(temporaryDirectory)
    vi.mocked(processSingleIcon).mockImplementation(parameters => {
      let { icon } = parameters
      writtenIcons.push(
        path.join(parameters.temporaryDirectory, icon.type, icon.id),
      )
      return Promise.resolve({
        iconPath: `./icons/${icon.type}/${icon.id}--hash.svg`,
        id: icon.id,
      })
    })
  })

  it('should process every icon and its light variant into the temporary directory', async () => {
    let result = await processIcons(theme, config)

    expect(result.temporaryDirectory).toBe(temporaryDirectory)
    expect(writtenIcons).toHaveLength(6)
    expect(writtenIcons).toEqual(
      expect.arrayContaining([
        '/tmp/eyecons-abc123/base/file',
        '/tmp/eyecons-abc123/base/file-light',
        '/tmp/eyecons-abc123/base/folder',
        '/tmp/eyecons-abc123/files/html',
        '/tmp/eyecons-abc123/files/js',
        '/tmp/eyecons-abc123/files/js-light',
      ]),
    )
  })

  it('should define every icon with the path of its processed file', async () => {
    let { iconDefinitions } = await processIcons(theme, config)

    expect(iconDefinitions).toEqual({
      'file-light': { iconPath: './icons/base/file-light--hash.svg' },
      'js-light': { iconPath: './icons/files/js-light--hash.svg' },
      folder: { iconPath: './icons/base/folder--hash.svg' },
      html: { iconPath: './icons/files/html--hash.svg' },
      file: { iconPath: './icons/base/file--hash.svg' },
      js: { iconPath: './icons/files/js--hash.svg' },
    })
  })

  it('should associate file extensions and names with the icons of each theme', async () => {
    let { themeData } = await processIcons(theme, config)

    expect(themeData).toEqual({
      dark: {
        fileExtensions: { html: 'html', htm: 'html', js: 'js' },
        fileNames: { 'script.js': 'js' },
      },
      light: {
        fileNames: { 'script.js': 'js-light' },
        fileExtensions: { js: 'js-light' },
      },
    })
  })

  it('should rethrow when an icon cannot be processed', async () => {
    let error = new Error('Failed to process icon')
    vi.mocked(processSingleIcon).mockRejectedValue(error)

    await expect(processIcons(theme, config)).rejects.toBe(error)
  })

  it('should rethrow when the temporary directory cannot be created', async () => {
    let error = new Error('Failed to create temporary directory')
    vi.mocked(createTemporaryDirectory).mockRejectedValue(error)

    await expect(processIcons(theme, config)).rejects.toBe(error)
  })

  it('should rethrow a non-Error failure unchanged', async () => {
    let failure = 'Disk is full'
    vi.mocked(createTemporaryDirectory).mockRejectedValue(failure)

    await expect(processIcons(theme, config)).rejects.toBe(failure)
  })
})
