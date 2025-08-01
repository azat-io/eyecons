/** Interface for the current VS Code theme source. */
export interface ThemeSource {
  /**
   * Essential semantic colors for the theme These colors are used for syntax
   * highlighting and UI elements.
   */
  main: {
    /** Orange color, used for types and certain keywords. */
    orange: string

    /** Yellow color, used for warnings and certain syntax elements. */
    yellow: string

    /** Purple color, used for constants, numbers, and special tokens. */
    purple: string

    /** Green color, used for strings, additions, and success states. */
    green: string

    /** Blue color, used for functions, links, and information. */
    blue: string

    /** Red color, used for errors, deletions, and certain keywords. */
    red: string
  }

  /** A mapping for theme color overrides. */
  overrides: Record<string, Record<string, string>>

  /**
   * The secondary background color, slightly different from primary Used for
   * panels, sidebars, and other UI elements.
   */
  backgroundSecondary: string

  /** The tertiary background color used for hover states and highlights. */
  backgroundTertiary: string

  /** The primary background color used in code editor area. */
  backgroundPrimary: string

  /** Background color used for branded elements like buttons and badges. */
  backgroundBrand: string

  /** Primary text color used for code and UI content. */
  contentPrimary: string

  /** Text color used on branded elements like buttons. */
  contentBrand: string

  /**
   * Complete collection of unique colors used throughout the theme This
   * includes all the main semantic colors plus additional UI colors.
   */
  colors: string[]

  /** Color used for borders on inputs, panels, and other UI elements. */
  border: string
}

/** Complete schema for VS Code icon theme. */
export interface ThemeSchema {
  /** Expanded folder name to icon mapping. */
  folderNamesExpanded: FolderNameAssociations

  /** File extension to icon mapping. */
  fileExtensions?: FileExtensionAssociations

  /** Folder name to icon mapping. */
  folderNames: FolderNameAssociations

  /** Definitions of all icons used in the theme. */
  iconDefinitions: IconDefinitions

  /** File name to icon mapping. */
  fileNames?: FileNameAssociations

  /** Whether to hide explorer arrows. */
  hidesExplorerArrows: boolean

  /** Light theme specific overrides. */
  light: LightThemeSection

  /** Default expanded folder icon. */
  folderExpanded: string

  /** Selected folder color from settings. */
  folderColor: string

  /** Build timestamp in ISO format. */
  buildTime: string

  /** Extension version. */
  version: string

  /** ID of the current VS Code theme. */
  themeId: string

  /** Default folder icon. */
  folder: string

  /** Default file icon. */
  file: string
}

/** Interface for light-specific theme overrides. */
export interface LightThemeSection {
  /** File extension associations specific to light theme. */
  fileExtensions?: FileExtensionAssociations

  /** File name associations specific to light theme. */
  fileNames?: FileNameAssociations

  /** Default file icon for light theme. */
  file: string
}

/** Interface for the current VS Code theme. */
export interface Theme extends ThemeSource {
  /** Selected folder color from settings. */
  folderColor: string

  /** ID of the current VS Code theme. */
  id: string
}

/** Map of file/folder icons and their theme data. */
export type ThemeData = Record<
  ThemeType,
  {
    fileExtensions?: FileExtensionAssociations
    fileNames?: FileNameAssociations
  }
>

/** Interface for the VS Code icon theme's icon definition. */
export interface IconPathDefinition {
  /** Path to the icon file. */
  iconPath: string
}

/** Definitions for icons. */
export type IconDefinitions = Record<string, IconPathDefinition>

/** Interface representing file extension associations. */
export type FileExtensionAssociations = Record<string, string>

/** Interface representing folder name associations. */
export type FolderNameAssociations = Record<string, string>

/** Interface representing file name associations. */
export type FileNameAssociations = Record<string, string>

/** Type for the theme schema. */
export type ThemeType = 'light' | 'dark'
