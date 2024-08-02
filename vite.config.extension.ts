import type { Plugin } from 'vite'

import { defineConfig } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'

interface CopyFoldersPluginOptions {
  dest: string
  src: string
}

interface MakeFilePluginOptions {
  content: string
  dest: string
}

let copyRecursiveSync = async (src: string, dest: string) => {
  let checkIfExists = async (file: string) => {
    try {
      await fs.stat(file)
      return true
    } catch {
      return false
    }
  }

  let exists = await checkIfExists(src)
  let stats = await fs.stat(src)
  let isDirectory = exists && stats.isDirectory()
  if (isDirectory) {
    fs.mkdir(dest, { recursive: true })
    let children = await fs.readdir(src)
    children.forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
      )
    })
  } else {
    await fs.copyFile(src, dest)
  }
}

let copyFoldersPlugin = (options: CopyFoldersPluginOptions[] = []): Plugin => ({
  closeBundle: () => {
    if (!Array.isArray(options) || options.length === 0) {
      console.error(
        'vite-plugin-copy-folders: "options" should be a non-empty array',
      )
      return
    }

    options.forEach(({ dest, src }) => {
      if (!src || !dest) {
        console.error(
          'vite-plugin-copy-folders: "src" and "dest" options are required',
        )
        return
      }
      try {
        copyRecursiveSync(src, dest)
      } catch (error) {
        console.error(`vite-plugin-copy-folders: ${error}`)
      }
    })
  },
  name: 'vite-plugin-copy-folders',
  apply: 'build',
})

let makeFile = (options: MakeFilePluginOptions): Plugin => ({
  closeBundle: async () => {
    try {
      await fs.writeFile(options.dest, options.content)
    } catch (error) {
      console.error(`vite-plugin-make-file: ${error}`)
    }
  },
  name: 'vite-plugin-make-file',
  apply: 'build',
})

export default defineConfig({
  plugins: [
    copyFoldersPlugin([
      {
        dest: 'dist/icons',
        src: 'icons',
      },
      {
        dest: 'dist/themes',
        src: 'themes',
      },
    ]),
    makeFile({
      content: JSON.stringify(
        {
          iconDefinitions: {
            loader: {
              iconPath: './icons/loader.svg',
            },
          },
          hidesExplorerArrows: true,
          folderExpanded: 'loader',
          folder: 'loader',
          file: 'loader',
        },
        null,
        2,
      ),
      dest: 'dist/extension/index.json',
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        preserveModules: true,
        exports: 'auto',
      },
      external: (id: string) => !id.startsWith('.') && !path.isAbsolute(id),
    },
    lib: {
      entry: path.resolve(__dirname, 'extension', 'index.ts'),
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ['cjs'],
    },
    minify: false,
  },
})
