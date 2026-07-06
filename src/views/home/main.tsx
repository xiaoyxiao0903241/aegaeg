import { bootHomeApp, restoreHomeScroll } from '~/app/bootstrap/home-boot'

bootHomeApp()

import { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '~/shared/styles/home.css'
import { I18nProvider } from '~/i18n/i18n-provider'
import { HomeProviders } from '~/providers/home-providers'
import { HomePage } from '~/views/home/home-page'
import { bootHomeReveal } from '~/views/home/home-reveal-loader'

function HomeApp() {
  useLayoutEffect(() => {
    restoreHomeScroll()
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
