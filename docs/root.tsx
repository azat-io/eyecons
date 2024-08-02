import {
  ServiceWorkerRegister,
  QwikCityProvider,
  RouterOutlet,
} from '@builder.io/qwik-city'
import { isDev } from '@builder.io/qwik/build'
import { component$ } from '@builder.io/qwik'

import { Head } from './blocks/head'
import './styles/spaces.css'
import './styles/colors.css'
import './styles/fonts.css'
import './styles/base.css'

export default component$(() => (
  <QwikCityProvider>
    <Head />
    <body lang="en-us">
      <RouterOutlet />
      {!isDev && <ServiceWorkerRegister />}
    </body>
  </QwikCityProvider>
))
