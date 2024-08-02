import { qwikVite } from '@builder.io/qwik/optimizer'
import { qwikCity } from '@builder.io/qwik-city/vite'
import { browserslistToTargets } from 'lightningcss'
import tsconfigPaths from 'vite-tsconfig-paths'
import browserslist from 'browserslist'
import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  plugins: [
    qwikCity({
      routesDir: 'docs/routes',
    }),
    qwikVite({
      client: {
        devInput: 'docs/entry.dev.tsx',
        outDir: 'docs/dist',
      },
      ssr: {
        input: 'docs/entry.ssr.tsx',
        outDir: 'docs/server',
      },
      srcDir: 'docs',
    }),
    tsconfigPaths(),
  ],
  css: {
    lightningcss: {
      targets: browserslistToTargets(
        browserslist(null, {
          config: path.join(__dirname, './.browserslistrc'),
        }),
      ),
    },
    transformer: 'lightningcss',
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=600',
    },
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=0',
    },
  },
  build: {
    outDir: 'docs/dist',
  },
  publicDir: 'docs/public',
})
