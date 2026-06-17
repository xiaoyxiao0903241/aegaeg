import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { AutoConnect, ThirdwebProvider } from 'thirdweb/react'
import { thirdwebClient, warnMissingWeb3EnvConfigOnce } from '~/web3/thirdweb'
import { AuthProvider } from '~/providers/auth-provider'
import { QueryProvider } from '~/providers/query-provider'

/**
 * Shared provider stack for Home + DApp entry points.
 * QueryProvider must wrap ThirdwebProvider — thirdweb hooks (e.g. useWalletBalance) use TanStack Query.
 */
export function WebRootProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    warnMissingWeb3EnvConfigOnce()
  }, [])

  return (
    <QueryProvider>
      <ThirdwebProvider>
        <AutoConnect client={thirdwebClient} timeout={15_000} />
        <AuthProvider>{children}</AuthProvider>
      </ThirdwebProvider>
    </QueryProvider>
  )
}
