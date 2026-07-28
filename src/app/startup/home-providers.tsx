import type { ReactNode } from 'react'
import { QueryProvider } from '~/app/startup/query-provider'

/** Home-only provider stack — no thirdweb / auth / wallet auto-connect. */
export function HomeProviders({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>
}
