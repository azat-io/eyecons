import type { RequestHandler } from '@builder.io/qwik-city'

import { component$, Slot } from '@builder.io/qwik'

export let onGet: RequestHandler = ({ cacheControl }): void => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  })
}

export default component$(() => <Slot />)
