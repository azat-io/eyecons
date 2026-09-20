import type { ThemeSchema } from '../../extension/types/theme'

/**
 * Builds an icon theme schema for tests.
 *
 * Overrides are merged shallowly, so a nested section like `light` has to be
 * passed in full whenever it is overridden. `iconDefinitions` is the field that
 * differs between test files, so it is usually the only one worth passing.
 *
 * @param overrides - Fields replacing the defaults.
 * @returns Theme schema to hand to the function under test.
 */
export function createMockThemeSchema(
  overrides: Partial<ThemeSchema> = {},
): ThemeSchema {
  return {
    iconDefinitions: {
      folder: { iconPath: './icons/folder.svg' },
      file: { iconPath: './icons/file.svg' },
    },
    light: {
      file: 'file-light',
      fileExtensions: {},
      fileNames: {},
    },
    buildTime: '2023-01-01T12:00:00.000Z',
    folderExpanded: 'folder-open',
    hidesExplorerArrows: true,
    folderNamesExpanded: {},
    folderColor: 'blue',
    fileExtensions: {},
    folder: 'folder',
    version: '1.0.0',
    folderNames: {},
    themeId: 'dark',
    fileNames: {},
    file: 'file',
    ...overrides,
  }
}
