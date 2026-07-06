import { suppressKnownConsoleNoise } from '~/lib/suppress-known-console-noise'

suppressKnownConsoleNoise()

if (typeof document !== 'undefined') {
  document.documentElement.classList.add('site-fluid', 'home-app')
}

import { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '~/shared/styles/home.css'
import { I18nProvider } from '~/i18n/i18n-provider'
import { HomeProviders } from '~/providers/home-providers'
import { HomePage } from '~/views/home/home-page'
import { bootHomeReveal } from '~/views/home/home-reveal-loader'
import {
  bindPageScrollPersistence,
  restorePersistedPageScroll,
} from '~/lib/page-scroll-restoration'

const HOME_SCROLL_KEY = 'aegis.home.scroll'

bindPageScrollPersistence(HOME_SCROLL_KEY)

function HomeApp() {
  useLayoutEffect(() => {
    restorePersistedPageScroll(HOME_SCROLL_KEY, { honorHashAnchor: true })
    bootHomeReveal()
  }, [])

  return <HomePage />
}

createRoot(document.getElementById('root')!).render(
  <I18nProvider>
    <HomeProviders>
      <HomeApp />
    </HomeProviders>
  </I18nProvider>,
)
