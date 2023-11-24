import { viteStaticCopy as staticCopy } from 'vite-plugin-static-copy'
import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'

export default defineConfig({
  vite: {
    plugins: [
      // @ts-ignore
      staticCopy({
        targets: [
          {
            src: 'themes',
            dest: '',
          },
        ],
      }),
    ],
    css: {
      transformer: 'lightningcss',
    },
  },
  server: {
    open: true,
    port: 3000,
  },
  publicDir: './docs/public',
  integrations: [svelte()],
  compressHTML: true,
  srcDir: './docs',
})
