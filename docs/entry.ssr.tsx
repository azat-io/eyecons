import type {
  RenderToStreamOptions,
  RenderToStreamResult,
} from '@builder.io/qwik/server'

import { renderToStream } from '@builder.io/qwik/server'
import { manifest } from '@qwik-client-manifest'

import Root from './root'

export default (
  options: RenderToStreamOptions,
): Promise<RenderToStreamResult> =>
  renderToStream(<Root />, {
    manifest,
    ...options,
    containerAttributes: {
      lang: 'en-us',
      ...options.containerAttributes,
    },
    serverData: {
      ...options.serverData,
    },
  })
