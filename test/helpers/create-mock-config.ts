import type { Config } from '../../extension/types/config'

/**
 * Builds an extension config for tests.
 *
 * The paths follow the layout `getConfig` produces for an extension installed
 * at `/mock/extension`, so paths derived from them look like the real ones.
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
    iconDefinitionsPath: '/mock/extension/dist/output/definitions.json',
    logging: {
      level: 'info',
      toFile: false,
    },
    outputIconsPath: '/mock/extension/dist/output/icons',
    sourceIconsPath: '/mock/extension/dist/icons',
    outputPath: '/mock/extension/dist/output',
    extensionPath: '/mock/extension/dist',
    version: '1.0.0',
    ...overrides,
  }
}
