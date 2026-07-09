import type { ReactNode } from 'react'
import { GenesisWidgetProvider } from '~/app/genesis-widget-context'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { SwapSubviewProviders } from '~/views/dapp/swap/swap-subview-providers'

/** Shell-level providers co-located with swap tab (SwapSubviewProviders). */
export function DappTabShellProviders({
  activeTab,
  children,
}: {
  activeTab: DappTab
  children: ReactNode
}) {
  return (
    <GenesisWidgetProvider>
      <SwapSubviewProviders activeTab={activeTab}>{children}</SwapSubviewProviders>
    </GenesisWidgetProvider>
  )
}
