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

let title = 'Eyecons'
let description =
  'Advanced VS Code icon theme with adaptive icon colors that match the editor’s color theme'
let image = '/cover.png'
let url = 'https://eyecons.dev'

export let head: DocumentHead = {
  meta: [
    {
      content: description,
      name: 'description',
    },
    {
      content: 'vscode, icon, theme, extension, eyecons, vscode-icons',
      name: 'keywords',
    },
    {
      name: 'theme-color',
      content: '#282c34',
    },
    {
      name: 'og:url',
      content: url,
    },
    {
      property: 'og:locale',
      content: 'en_US',
    },
    {
      name: 'og:title',
      content: title,
    },
    {
      name: 'og:description',
      content: description,
    },
    {
      name: 'og:image',
      content: image,
    },
    {
      name: 'og:image:width',
      content: '1200',
    },
    {
      name: 'og:image:height',
      content: '630',
    },
    {
      content: 'website',
      name: 'og:type',
    },
    {
      content: 'summary_large_image',
      name: 'twitter:card',
    },
    {
      name: 'twitter:url',
      content: url,
    },
    {
      name: 'twitter:creator',
      content: '@azat_io',
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:image',
      content: image,
    },
  ],
  title,
}
