import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { AutoConnect, ThirdwebProvider } from 'thirdweb/react'
import '../styles/home.css'
import { I18nProvider } from '../i18n/i18n-provider'
import { AuthProvider } from '../providers/auth-provider'
import { thirdwebClient } from '../web3/thirdweb'
import { HomePage } from './home-page'

function HomeApp() {
  useEffect(() => {
    void import('../wallet-loader')
  }, [])

  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <I18nProvider>
    <ThirdwebProvider>
      <AutoConnect client={thirdwebClient} timeout={15_000} />
      <HomeApp />
    </ThirdwebProvider>
  </I18nProvider>,
)
