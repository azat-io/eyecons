import type { RenderToStreamOptions } from '@builder.io/qwik/server'

import { renderToStream } from '@builder.io/qwik/server'
import { manifest } from '@qwik-client-manifest'

import Root from './root'

export default (opts: RenderToStreamOptions) =>
  renderToStream(<Root />, {
    manifest,
    ...opts,
    containerAttributes: {
      lang: 'en-us',
      ...opts.containerAttributes,
    },
    serverData: {
      ...opts.serverData,
    },
  })
