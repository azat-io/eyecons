/**
 * Configuration for the icon theme extension.
 */
export interface Config {
  /**
   * Icon processing settings.
   */
  processing: {
    /**
     * Threshold values for determining extreme lightness.
     */
    extremeLightnessThresholds: {
      /**
       * Lightness value above which the color is considered close to white.
       */
      light: number

      /**
       * Lightness value below which the color is considered close to black.
       */
      dark: number
    }

    /**
     * Minimum saturation value below which the color is considered achromatic.
     */
    lowSaturationThreshold: number

    /**
     * Saturation increase factor.
     */
    saturationFactor: number

    /**
     * Whether to adjust saturation to improve contrast.
     */
    adjustContrast: boolean
  }

  /**
   * Logging settings.
   */
  logging: {
    /**
     * Minimum logging level. Possible values: 'debug', 'info', 'warn', 'error'.
     */
    level: 'debug' | 'error' | 'info' | 'warn'

    /**
     * Path to the log file, if toFile = true.
     */
    filePath?: string

    /**
     * Whether to log to a file in addition to console output.
     */
    toFile: boolean
  }

  /**
   * Behavior when processing errors occur.
   */
  errorHandling: {
    /**
     * Whether to show notifications to the user about errors.
     */
    showNotifications: boolean

    /**
     * Whether to continue processing other icons when an error occurs with one
     * icon.
     */
    continueOnError: boolean
  }

  /**
   * Path to the icon definitions file.
   */
  iconDefinitionsPath: string

  /**
   * Path to the directory with source icons.
   */
  sourceIconsPath: string

  /**
   * Path to the directory for processed icons.
   */
  outputIconsPath: string

  /**
   * Path to the extension directory.
   */
  extensionPath: string

  /**
   * Path to the output directory.
   */
  outputPath: string

  /**
   * Extension version for cache compatibility checking.
   */
  version: string
}
