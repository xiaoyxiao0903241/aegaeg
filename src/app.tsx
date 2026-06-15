import { DappShell } from './app/dapp-shell'
import { AuthProvider } from './providers/auth-provider'

export function App() {
  return (
    <AuthProvider>
      <DappShell />
    </AuthProvider>
  )
}
