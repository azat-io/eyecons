import { netlifyEdgeAdapter } from '@builder.io/qwik-city/adapters/netlify-edge/vite'
import { extendConfig } from '@builder.io/qwik-city/vite'
import path from 'node:path'

import baseConfig from '../../../vite.config.docs'

export default extendConfig(baseConfig, () => ({
  build: {
    rollupOptions: {
      input: [
        path.join(__dirname, '../../entry.netlify-edge.tsx'),
        '@qwik-city-plan',
      ],
    },
    outDir: path.join(
      __dirname,
      '../../../.netlify/edge-functions/entry.netlify-edge',
    ),
    ssr: true,
  },
  plugins: [netlifyEdgeAdapter()],
}))
