import type { WorkspaceConfiguration } from 'vscode'

import { workspace } from 'vscode'
import { vi } from 'vitest'

/**
 * User settings grouped by configuration section, for example `{ eyecons: {
 * theme: 'nord' } }`.
 */
type Settings = Partial<Record<string, Record<string, unknown>>>

/**
 * Makes `workspace.getConfiguration(section).get(key)` read from the given
 * settings, so a test states what the user configured instead of asserting the
 * calls made to read it. A section or key that is not listed reads as
 * `undefined`, as it does in VS Code when nothing is configured.
 *
 * @param settings - User settings grouped by configuration section.
 */
export function mockSettings(settings: Settings): void {
  vi.mocked(workspace.getConfiguration).mockImplementation(
    section =>
      ({
        get: (key: string) => settings[section!]?.[key],
      }) as WorkspaceConfiguration,
  )
}
