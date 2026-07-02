import { suppressKnownConsoleNoise } from '~/lib/suppress-known-console-noise'

suppressKnownConsoleNoise()

if (typeof document !== 'undefined') {
  document.documentElement.classList.add('site-fluid', 'home-app')
}

import { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '~/styles/home.css'
import { I18nProvider } from '~/i18n/i18n-provider'
import { WebRootProviders } from '~/providers/web-root-providers'
import { HomePage } from '~/home/home-page'
import { bootWalletLoader } from '~/wallet-loader'
import {
  bindPageScrollPersistence,
  restorePersistedPageScroll,
} from '~/lib/page-scroll-restoration'

const HOME_SCROLL_KEY = 'aegis.home.scroll'

bindPageScrollPersistence(HOME_SCROLL_KEY)

function HomeApp() {
  useLayoutEffect(() => {
    restorePersistedPageScroll(HOME_SCROLL_KEY, { honorHashAnchor: true })
    bootWalletLoader()
  }, [])

  return <HomePage />
}

createRoot(document.getElementById('root')!).render(
  <I18nProvider>
    <WebRootProviders>
      <HomeApp />
    </WebRootProviders>
  </I18nProvider>,
)
