/**
 * Icon type with additional properties for rendering.
 */
export interface FormattedIconValue {
  /**
   * Theme variant of the icon.
   */
  theme: 'light' | 'dark'

  /**
   * Icon type.
   */
  type: 'files' | 'base'

  /**
   * File extensions associated with this icon.
   */
  extensions?: string[]

  /**
   * Specific file names associated with this icon.
   */
  files?: string[]

  /**
   * Display name of the icon.
   */
  name: string

  /**
   * Icon identifier and file name (without extension).
   */
  id: string
}

/**
 * Base icon type with common properties.
 */
export interface BaseIcon {
  /**
   * Whether icon has a light theme variant.
   */
  light?: boolean

  /**
   * Display name of the icon.
   */
  name: string

  /**
   * Icon identifier and file name (without extension).
   */
  id: string
}

/**
 * File icon with additional file associations.
 */
export interface FileIcon extends BaseIcon {
  /**
   * File extensions associated with this icon.
   */
  extensions?: string[]

  /**
   * Specific file names associated with this icon.
   */
  files?: string[]
}
