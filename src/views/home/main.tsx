import { bootHomeApp, restoreHomeScroll } from '~/app/startup/home-boot'

bootHomeApp()

import '~/shared/styles/home.css'

import { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'

import { HomeProviders } from '~/app/startup/home-providers'
import { I18nProvider } from '~/i18n/i18n-provider'
import { LocalizedErrorBoundary } from '~/shared/ui/localized-error-boundary'
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
      <LocalizedErrorBoundary name="home">
        <HomeApp />
      </LocalizedErrorBoundary>
    </HomeProviders>
  </I18nProvider>,
)
