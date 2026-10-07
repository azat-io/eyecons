import type { Mock } from 'vitest'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setTimeout } from 'node:timers/promises'
import { window } from 'vscode'

import { moveProcessedIcons } from '../../../extension/io/file/move-processed-icons'
import { setupLoaderIcon } from '../../../extension/core/build/setup-loader-icon'
import { saveThemeSchema } from '../../../extension/io/file/save-theme-schema'
import { processIcons } from '../../../extension/core/build/process-icons'
import { buildIcons } from '../../../extension/core/build/build-icons'
import { createMockConfig } from '../../helpers/create-mock-config'
import { createMockTheme } from '../../helpers/create-mock-theme'

vi.mock('node:timers/promises', () => ({
  setTimeout: vi.fn(),
}))

vi.mock('../../../extension/core/build/setup-loader-icon', () => ({
  setupLoaderIcon: vi.fn(),
}))

vi.mock('../../../extension/core/build/process-icons', () => ({
  processIcons: vi.fn(),
}))

vi.mock('../../../extension/io/file/move-processed-icons', () => ({
  moveProcessedIcons: vi.fn(),
}))

vi.mock('../../../extension/io/file/save-theme-schema', () => ({
  saveThemeSchema: vi.fn(),
}))

describe('buildIcons', () => {
  let config = createMockConfig({ version: '2.3.4' })
  let theme = createMockTheme({ folderColor: 'purple', id: 'nord' })

  let processedIcons: Awaited<ReturnType<typeof processIcons>> = {
    themeData: {
      dark: {
        fileNames: { 'package.json': 'npm' },
        fileExtensions: { js: 'js' },
      },
      light: { fileNames: { 'package.json': 'npm-light' }, fileExtensions: {} },
    },
    iconDefinitions: {
      'npm-light': { iconPath: './icons/files/npm-light--hash.svg' },
      npm: { iconPath: './icons/files/npm--hash.svg' },
      js: { iconPath: './icons/files/js--hash.svg' },
    },
    temporaryDirectory: '/tmp/eyecons-abc123',
  }

  /**
   * Visible steps of the build in the order they happened.
   */
  let steps: string[] = []

  beforeEach(() => {
    vi.resetAllMocks()
    steps = []
    vi.mocked(setupLoaderIcon).mockImplementation(() => {
      steps.push('show the loader')
      return Promise.resolve()
    })
    vi.mocked(processIcons).mockImplementation(() => {
      steps.push('process the icons')
      return Promise.resolve(processedIcons)
    })
    vi.mocked(moveProcessedIcons).mockImplementation(temporaryDirectory => {
      steps.push(`move the icons from ${temporaryDirectory}`)
      return Promise.resolve()
    })
    vi.mocked(setTimeout).mockImplementation(delay => {
      steps.push(`wait ${String(delay)} ms`)
      return Promise.resolve()
    })
    vi.mocked(saveThemeSchema).mockImplementation(() => {
      steps.push('save the theme')
      return Promise.resolve()
    })
  })

  it('should show the loader, then switch to the theme once the processed icons are in place', async () => {
    await buildIcons(theme, config)

    expect(steps).toEqual([
      'show the loader',
      'process the icons',
      'move the icons from /tmp/eyecons-abc123',
      'wait 1000 ms',
      'save the theme',
    ])
  })

  it('should save a theme built from the processed icons', async () => {
    await buildIcons(theme, config)

    expect(saveThemeSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        light: {
          fileNames: { 'package.json': 'npm-light' },
          fileExtensions: {},
          file: 'file-light',
        },
        iconDefinitions: processedIcons.iconDefinitions,
        fileNames: { 'package.json': 'npm' },
        fileExtensions: { js: 'js' },
        folderColor: 'purple',
        version: '2.3.4',
        themeId: 'nord',
      }),
      config,
    )
  })

  it.each([
    ['showing the loader', setupLoaderIcon, []],
    ['processing the icons', processIcons, ['show the loader']],
    [
      'moving the icons',
      moveProcessedIcons,
      ['show the loader', 'process the icons'],
    ],
    [
      'saving the theme',
      saveThemeSchema,
      [
        'show the loader',
        'process the icons',
        'move the icons from /tmp/eyecons-abc123',
        'wait 1000 ms',
      ],
    ],
  ] as [string, Mock, string[]][])(
    'should stop, notify the user and rethrow when %s fails',
    async (_, failingStep, completedSteps) => {
      let error = new Error('Disk is full')
      failingStep.mockRejectedValue(error)

      await expect(buildIcons(theme, config)).rejects.toBe(error)
      expect(steps).toEqual(completedSteps)
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        '[Build] Build process failed: Disk is full',
      )
    },
  )

  it('should notify the user about a non-Error failure and rethrow it', async () => {
    let failure = 'Disk is full'
    vi.mocked(saveThemeSchema).mockRejectedValue(failure)

    await expect(buildIcons(theme, config)).rejects.toBe(failure)
    expect(window.showErrorMessage).toHaveBeenCalledWith(
      '[Build] Build process failed: Disk is full',
    )
  })

  it('should not notify the user when the build succeeds', async () => {
    await buildIcons(theme, config)

    expect(window.showErrorMessage).not.toHaveBeenCalled()
  })
})
