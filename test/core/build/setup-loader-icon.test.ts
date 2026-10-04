import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setupLoaderIcon } from '../../../extension/core/build/setup-loader-icon'
import { saveThemeSchema } from '../../../extension/io/file/save-theme-schema'
import { saveLoaderIcon } from '../../../extension/io/file/save-loader-icon'
import { createMockConfig } from '../../helpers/create-mock-config'
import { createMockTheme } from '../../helpers/create-mock-theme'

vi.mock('../../../extension/io/file/save-loader-icon', () => ({
  saveLoaderIcon: vi.fn(),
}))

vi.mock('../../../extension/io/file/save-theme-schema', () => ({
  saveThemeSchema: vi.fn(),
}))

describe('setupLoaderIcon', () => {
  let config = createMockConfig()
  let theme = createMockTheme()
  let loaderIconPath = './icons/loader.svg'

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(saveLoaderIcon).mockResolvedValue(loaderIconPath)
    vi.mocked(saveThemeSchema).mockResolvedValue()
  })

  it('should save an animated loader icon', async () => {
    await setupLoaderIcon(theme, config)

    expect(saveLoaderIcon).toHaveBeenCalledWith(
      expect.stringContaining('<animateTransform'),
      config,
    )
  })

  it('should save a temporary theme that shows the loader for every file and folder', async () => {
    await setupLoaderIcon(theme, config)

    expect(saveThemeSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        iconDefinitions: {
          'folder-open': { iconPath: loaderIconPath },
          'file-light': { iconPath: loaderIconPath },
          folder: { iconPath: loaderIconPath },
          file: { iconPath: loaderIconPath },
        },
        light: { fileExtensions: {}, file: 'file-light', fileNames: {} },
        folderExpanded: 'folder-open',
        fileExtensions: {},
        folder: 'folder',
        fileNames: {},
        file: 'file',
      }),
      config,
    )
  })

  it('should rethrow when the loader icon cannot be saved and save no theme', async () => {
    let error = new Error('Failed to save loader icon')
    vi.mocked(saveLoaderIcon).mockRejectedValue(error)

    await expect(setupLoaderIcon(theme, config)).rejects.toBe(error)
    expect(saveThemeSchema).not.toHaveBeenCalled()
  })

  it('should rethrow when the temporary theme cannot be saved', async () => {
    let error = new Error('Failed to save theme definition')
    vi.mocked(saveThemeSchema).mockRejectedValue(error)

    await expect(setupLoaderIcon(theme, config)).rejects.toBe(error)
  })

  it('should rethrow a non-Error failure unchanged', async () => {
    let failure = 'Disk is full'
    vi.mocked(saveLoaderIcon).mockRejectedValue(failure)

    await expect(setupLoaderIcon(theme, config)).rejects.toBe(failure)
  })
})
