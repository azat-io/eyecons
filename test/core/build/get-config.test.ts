import type { ExtensionContext } from 'vscode'

import { describe, expect, it } from 'vitest'

import { getConfig } from '../../../extension/core/build/get-config'
import { version } from '../../../package.json'

describe('getConfig', () => {
  let context = { extensionPath: '/mock/extension' } as ExtensionContext

  it('should place the icons and the theme definition inside the dist directory of the extension', () => {
    let config = getConfig(context)

    expect(config).toEqual(
      expect.objectContaining({
        iconDefinitionsPath: '/mock/extension/dist/output/definitions.json',
        outputIconsPath: '/mock/extension/dist/output/icons',
        sourceIconsPath: '/mock/extension/dist/icons',
        outputPath: '/mock/extension/dist/output',
        extensionPath: '/mock/extension/dist',
      }),
    )
  })

  it('should stamp the config with the extension version', () => {
    expect(getConfig(context).version).toBe(version)
  })

  it('should use the default error handling and logging settings', () => {
    let config = getConfig(context)

    expect(config).toEqual(
      expect.objectContaining({
        errorHandling: { showNotifications: true, continueOnError: true },
        logging: { level: 'info', toFile: false },
      }),
    )
  })

  it('should use the default color processing settings', () => {
    let config = getConfig(context)

    expect(config.processing).toEqual({
      extremeLightnessThresholds: {
        light: 0.95,
        dark: 0.05,
      },
      lowSaturationThreshold: 0.05,
      saturationFactor: 1.2,
      adjustContrast: true,
    })
  })
})
