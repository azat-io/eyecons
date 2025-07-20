import type { Plugin } from 'vite'

import { builtinModules } from 'node:module'
import { defineConfig } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'

interface MakeFilePluginOptions {
  content: string
  dest: string
}

interface CopyFoldersPluginOptions {
  dest: string
  src: string
}

function copyFoldersPlugin(options: CopyFoldersPluginOptions[] = []): Plugin {
  return {
    closeBundle: async () => {
      if (!Array.isArray(options) || options.length === 0) {
        console.error(
          'vite-plugin-copy-folders: "options" should be a non-empty array',
        )
        return
      }

      await Promise.all(
        options.map(async ({ dest, src }) => {
          if (!src || !dest) {
            console.error(
              'vite-plugin-copy-folders: "src" and "dest" options are required',
            )
            return
          }
          try {
            await copyRecursive(src, dest)
          } catch (error) {
            console.error(`vite-plugin-copy-folders: ${error as string}`)
          }
        }),
      )
    },
    name: 'vite-plugin-copy-folders',
    apply: 'build',
  }
}

async function copyRecursive(
  source: string,
  destination: string,
): Promise<void> {
  async function checkIfExists(file: string): Promise<boolean> {
    try {
      await fs.stat(file)
      return true
    } catch {
      return false
    }
  }

  let exists = await checkIfExists(source)
  let stats = await fs.stat(source)
  let isDirectory = exists && stats.isDirectory()
  if (isDirectory) {
    await fs.mkdir(destination, { recursive: true })
    let children = await fs.readdir(source)
    await Promise.all(
      children.map(async childItemName => {
        await copyRecursive(
          path.join(source, childItemName),
          path.join(destination, childItemName),
        )
      }),
    )
  } else {
    await fs.copyFile(source, destination)
  }
}

function makeFile(options: MakeFilePluginOptions): Plugin {
  return {
    closeBundle: async () => {
      try {
        await fs.writeFile(options.dest, options.content)
      } catch (error) {
        console.error(`vite-plugin-make-file: ${error as string}`)
      }
    },
    name: 'vite-plugin-make-file',
    apply: 'build',
  }
}

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
      external: (id: string) =>
        id === 'vscode' || builtinModules.includes(id.replace('node:', '')),
      output: {
        preserveModules: true,
        exports: 'auto',
      },
    },
    lib: {
      entry: path.resolve(__dirname, 'extension', 'index.ts'),
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ['cjs'],
    },
    minify: false,
  },
})
