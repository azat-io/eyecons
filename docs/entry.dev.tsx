/* eslint-disable unicorn/prevent-abbreviations */

import type { RenderOptions, RenderResult } from '@builder.io/qwik'

import { render } from '@builder.io/qwik'

import Root from './root'

export default (options: RenderOptions): Promise<RenderResult> =>
  render(document, <Root />, options)

/* eslint-enable unicorn/prevent-abbreviations */
