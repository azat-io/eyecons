import type { DocumentHead } from '@builder.io/qwik-city'

import { component$ } from '@builder.io/qwik'

import { Header } from '../blocks/header'
import { Footer } from '../blocks/footer'
import { Themes } from '../blocks/themes'
import { Icons } from '../blocks/icons'
import { Demo } from '../blocks/demo'

export default component$(() => (
  <>
    <Header />
    <Demo />
    <Icons />
    <Themes />
    <Footer />
  </>
))

export let head: DocumentHead = {
  meta: [
    {
      content: 'Qwik site description',
      name: 'description',
    },
  ],
  title: 'Eyecons',
}
