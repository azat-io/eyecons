import type { PlatformNetlify } from '@builder.io/qwik-city/middleware/netlify-edge'

import { createQwikCity } from '@builder.io/qwik-city/middleware/netlify-edge'
import { manifest } from '@qwik-client-manifest'
import qwikCityPlan from '@qwik-city-plan'

import render from './entry.ssr'

declare global {
  type QwikCityPlatform = PlatformNetlify
}

export default createQwikCity({
  qwikCityPlan,
  manifest,
  render,
})
