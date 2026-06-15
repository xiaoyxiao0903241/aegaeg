import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/home.css'
import { I18nProvider } from '../i18n/i18n-provider'
import { WebRootProviders } from '../providers/web-root-providers'
import { HomePage } from './home-page'

function HomeApp() {
  useEffect(() => {
    void import('../wallet-loader')
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
