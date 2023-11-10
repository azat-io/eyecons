type FileIcon = {
  name: string
  id: string
} & (
  | {
      extensions: string[]
    }
  | {
      files: string[]
    }
)

export let fileIcons: FileIcon[] = [
  {
    extensions: ['astro'],
    name: 'Astro',
    id: 'astro',
  },
  {
    extensions: ['css'],
    name: 'CSS',
    id: 'css',
  },
  {
    extensions: ['htm', 'html'],
    name: 'HTML',
    id: 'html',
  },
  {
    extensions: ['js', 'cjs', 'mjs', 'es'],
    name: 'JavaScript',
    id: 'javascript',
  },
  {
    extensions: ['svelte'],
    name: 'Svelte',
    id: 'svelte',
  },
  {
    extensions: ['ts', 'cts', 'mts'],
    name: 'TypeScript',
    id: 'typescript',
  },
  {
    files: [
      '.yarnrc',
      'yarn.lock',
      '.yarnclean',
      '.yarn-integrity',
      'yarn-error.log',
      '.yarnrc.yml',
      '.yarnrc.yaml',
    ],
    name: 'Yarn',
    id: 'yarn',
  },
]
