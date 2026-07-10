import type { ReactNode } from 'react'
import { GenesisPromoSync } from '~/app/genesis-promo-sync'
import { GenesisWidgetProvider } from '~/app/genesis-widget-context'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { SwapSubviewProviders } from '~/views/dapp/swap/swap-subview-providers'

/**
 * Shell providers: promo sync is always on; purchase widget only on Genesis tab
 * so paused/totalPurchased intervals and draft state do not run on other tabs.
 */
export function DappTabShellProviders({
  activeTab,
  children,
}: {
  activeTab: DappTab
  children: ReactNode
}) {
  const swapTree = <SwapSubviewProviders activeTab={activeTab}>{children}</SwapSubviewProviders>

  return (
    <>
      <GenesisPromoSync />
      {activeTab === 'genesis' ? (
        <GenesisWidgetProvider>{swapTree}</GenesisWidgetProvider>
      ) : (
        swapTree
      )}
    </>
  )
}
