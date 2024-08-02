export interface BaseIcon {
  light?: boolean
  name: string
  id: string
}

export let baseIcons: BaseIcon[] = [
  {
    name: 'File',
    light: true,
    id: 'file',
  },
  {
    name: 'Folder',
    id: 'folder',
  },
  {
    name: 'Folder Open',
    id: 'folder-open',
  },
]
