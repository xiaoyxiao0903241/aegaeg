import { DappShell } from './app/dapp-shell'
import { AuthProvider } from './providers/auth-provider'
import { QueryProvider } from './providers/query-provider'

export function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <DappShell />
      </AuthProvider>
    </QueryProvider>
  )
}
