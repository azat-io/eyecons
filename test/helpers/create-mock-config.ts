import type { Config } from '../../extension/types/config'

/**
 * Builds an extension config for tests.
 *
 * Overrides are merged shallowly, so a nested section like `processing` has to
 * be passed in full whenever it is overridden.
 *
 * @param overrides - Fields replacing the defaults.
 * @returns Config to hand to the function under test.
 */
export function createMockConfig(overrides: Partial<Config> = {}): Config {
  return {
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
    iconDefinitionsPath: 'icons/definitions.json',
    outputPath: '/mock/extension/path/output',
    extensionPath: '/mock/extension/path',
    sourceIconsPath: 'icons/source',
    outputIconsPath: 'icons/theme',
    version: '1.0.0',
    ...overrides,
  }
}
