import type { FormattedIconValue, BaseIcon, FileIcon } from '../../types/icon'

/**
 * Formats icon values from base and file icons collections.
 *
 * @param {(BaseIcon | FileIcon)[]} icons - Icons to format.
 * @param {'files' | 'base'} type - Type of icons to format.
 * @returns {FormattedIconValue[]} Formatted icon values.
 */
export function formatIconsValues(
  icons: (BaseIcon | FileIcon)[],
  type: 'files' | 'base',
): FormattedIconValue[] {
  return icons.reduce(
    (
      accumulator: FormattedIconValue[],
      { light = false, name, id, ...properties },
    ) => [
      ...accumulator,
      {
        theme: 'dark' as const,
        type,
        name,
        id,
        ...properties,
      },
      ...(light
        ? [
            {
              theme: 'light' as const,
              id: `${id}-light`,
              name,
              type,
              ...properties,
            },
          ]
        : []),
    ],
    [],
  )
}
