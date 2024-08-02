import type { FileIcon } from '../../data/file-icons'
import type { BaseIcon } from '../../data/base-icons'

import { fileIcons } from '../../data/file-icons'
import { baseIcons } from '../../data/base-icons'
import { makeIcon } from './make-icon'

interface IconDefinitions {
  [key: string]: {
    iconPath: string
  }
}

interface Config {
  tmpDir: string
}

interface FormattedIconValue {
  theme: 'light' | 'dark'
  type: 'files' | 'base'
  name: string
  id: string
}

export let generateIcons = async (config: Config): Promise<IconDefinitions> => {
  let iconDefinitions: IconDefinitions = {}
  let updateIconDefinitions = ({
    fileName,
    id,
  }: {
    fileName: string
    id: string
  }) => {
    iconDefinitions[id] = {
      iconPath: `./icons/${fileName}`,
    }
  }

  let formatIconsValues = (
    icons: (BaseIcon | FileIcon)[],
    type: 'files' | 'base',
  ): FormattedIconValue[] =>
    icons.reduce(
      (
        accumulator: FormattedIconValue[],
        { light = false, name, id, ...props },
      ) => [
        ...accumulator,
        {
          theme: 'dark' as const,
          type,
          name,
          id,
          ...props,
        },
        ...(light
          ? [
              {
                theme: 'light' as const,
                id: `${id}-light`,
                name,
                type,
                ...props,
              },
            ]
          : []),
      ],
      [],
    )

  await Promise.all([
    ...formatIconsValues(baseIcons, 'base').map(
      async value => await makeIcon(value, config, updateIconDefinitions),
    ),
    ...formatIconsValues(fileIcons, 'files').map(
      async value => await makeIcon(value, config, updateIconDefinitions),
    ),
  ])

  return iconDefinitions
}
