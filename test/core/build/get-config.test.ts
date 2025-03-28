import type { ExtensionContext } from 'vscode'

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import path from 'node:path'

import { getConfig } from '../../../extension/core/build/get-config'
import { logger } from '../../../extension/io/vscode/logger'

vi.mock('../../../package.json', () => ({
  version: '1.2.3',
}))

vi.mock('../../../extension/io/vscode/logger', () => ({
  logger: {
    withContext: vi.fn(),
  },
}))

vi.mock('node:path', () => ({
  default: {
    join: vi.fn((...arguments_) => arguments_.join('/')),
  },
}))

let mockLoggerContext = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
}

let mockContext = {
  extensionPath: '/mock/extension/path',
} as ExtensionContext

describe('getConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(logger.withContext).mockReturnValue(mockLoggerContext)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return the correct extension configuration with absolute paths', () => {
    let config = getConfig(mockContext)

    let expectedExtensionPath = '/mock/extension/path/dist'
    let expectedOutputPath = '/mock/extension/path/dist/output'

    expect(config).toEqual({
      processing: {
        extremeLightnessThresholds: {
          light: 0.95,
          dark: 0.05,
        },
        lowSaturationThreshold: 0.05,
        saturationFactor: 1.2,
        adjustContrast: true,
      },
      errorHandling: {
        showNotifications: true,
        continueOnError: true,
      },
      logging: {
        level: 'info',
        toFile: false,
      },
      iconDefinitionsPath: `${expectedOutputPath}/definitions.json`,
      sourceIconsPath: `${expectedExtensionPath}/icons`,
      outputIconsPath: `${expectedOutputPath}/icons`,
      extensionPath: expectedExtensionPath,
      outputPath: expectedOutputPath,
      version: '1.2.3',
    })

    expect(path.join).toHaveBeenCalledWith('/mock/extension/path', 'dist')
    expect(path.join).toHaveBeenCalledWith(expectedExtensionPath, 'output')
    expect(path.join).toHaveBeenCalledWith(
      expectedOutputPath,
      'definitions.json',
    )
    expect(path.join).toHaveBeenCalledWith(expectedExtensionPath, 'icons')
    expect(path.join).toHaveBeenCalledWith(expectedOutputPath, 'icons')

    expect(mockLoggerContext.debug).toHaveBeenCalledWith(
      'Extension configuration loaded',
    )
  })
})
