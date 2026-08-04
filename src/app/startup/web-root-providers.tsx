import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { AuthProvider } from '~/app/startup/auth-provider'
import { QueryProvider } from '~/app/startup/query-provider'
import { AccountBannedNotifier } from '~/shared/components/account-banned-notifier'
import { TooltipProvider } from '~/shared/components/tooltip'
import { assertWeb3EnvConfigured, thirdwebClient } from '~/web3/thirdweb'
import { AutoConnect, ThirdwebProvider } from '~/web3/thirdweb-react'

/**
 * DApp-only provider stack (`app.html` / `src/app/main.tsx`).
 * Home uses `HomeProviders` (Query only — no thirdweb).
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
    assertWeb3EnvConfigured()
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
