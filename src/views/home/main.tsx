import { bootHomeApp, restoreHomeScroll } from '~/app/bootstrap/home-boot'

bootHomeApp()

import { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '~/shared/styles/home.css'
import { I18nProvider } from '~/i18n/i18n-provider'
import { HomeProviders } from '~/app/bootstrap/home-providers'
import { HomePage } from '~/views/home/home-page'
import { bootHomeReveal } from '~/views/home/home-reveal-loader'
import { ErrorBoundary } from '~/shared/ui/error-boundary'

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
      <ErrorBoundary name="home">
        <HomeApp />
      </ErrorBoundary>
    </HomeProviders>
  </I18nProvider>,
)
