import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { AutoConnect, ThirdwebProvider } from 'thirdweb/react'
import { thirdwebClient, warnMissingWeb3EnvConfigOnce } from '~/web3/thirdweb'
import { AuthProvider } from '~/providers/auth-provider'
import { AccountBannedNotifier } from '~/components/account-banned-notifier'
import { QueryProvider } from '~/providers/query-provider'
import { TooltipProvider } from '~/components/tooltip'

/**
 * Shared provider stack for Home + DApp entry points.
 *
 * QueryProvider MUST sit INSIDE ThirdwebProvider. thirdweb's ThirdwebProvider
 * mounts its own QueryClientProvider; if ours were the outer one it would be
 * shadowed, and component `useQuery`s would land on thirdweb's client while our
 * module-level invalidation (invalidate.ts → queryClient singleton) targeted a
 * different, orphan client — making every post-action refresh silently no-op.
 * Nesting ours inside makes it the nearest provider, so reads and invalidations
 * share one client.
 */
export function WebRootProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    warnMissingWeb3EnvConfigOnce()
  }, [])

  return (
    <ThirdwebProvider>
      <QueryProvider>
        <TooltipProvider delayDuration={200} skipDelayDuration={0}>
          <AutoConnect client={thirdwebClient} timeout={15_000} />
          <AuthProvider>
            <AccountBannedNotifier />
            {children}
          </AuthProvider>
        </TooltipProvider>
      </QueryProvider>
    </ThirdwebProvider>
  )
}
