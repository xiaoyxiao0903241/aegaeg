import type { ComponentType } from 'react'
import type { DappTab } from '~/shared/config/dapp-tabs'
import type { DappTabSessions } from '~/views/dapp/dapp-tab-sessions'
import { CommunityContent } from '~/views/dapp/community/community-content'
import { CommunityWidget } from '~/views/dapp/community/community-widget'
import { GenesisContent } from '~/views/dapp/genesis/genesis-content'
import { GenesisWidget } from '~/views/dapp/genesis/genesis-widget'
import { RewardsContent } from '~/views/dapp/rewards/rewards-content'
import { RewardsWidget } from '~/views/dapp/rewards/rewards-widget'
import { SwapContent, SwapWidget } from '~/views/dapp/swap'
import { scrollDappPanelsToTop } from '~/app/utils'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { resolveWalletRemountKey } from '~/shared/lib/resolve-wallet-remount-key'

export type { DappTab } from '~/shared/config/dapp-tabs'
export { tabOrder } from '~/shared/config/dapp-tabs'

type TabWidgetProps = {
  onSelectTab: (tab: DappTab) => void
} & DappTabSessions

type TabContentProps = DappTabSessions

export type DappTabEntry = {
  id: DappTab
  Widget: ComponentType<TabWidgetProps>
  Content: ComponentType<TabContentProps>
}

function SwapTabWidget({ onSelectTab, trade, flash }: TabWidgetProps) {
  return (
    <SwapWidget
      flash={flash}
      onSelectGenesis={() => {
        onSelectTab('genesis')
        scrollDappPanelsToTop()
      }}
      trade={trade}
    />
  )
}

function SwapTabContent({ trade, flash }: TabContentProps) {
  return <SwapContent flash={flash} trade={trade} />
}

function GenesisTabWidget({ genesis }: TabWidgetProps) {
  if (!genesis) {
    throw new Error('GenesisWidget requires a lifted genesis session')
  }
  return <GenesisWidget genesis={genesis} />
}

function GenesisTabContent({ genesis }: TabContentProps) {
  if (!genesis) {
    throw new Error('GenesisContent requires a lifted genesis session')
  }
  return <GenesisContent genesis={genesis} />
}

function RewardsTabWidget() {
  return <RewardsWidget />
}

function RewardsTabContent() {
  return <RewardsContent />
}

function CommunityTabWidget({ onSelectTab }: TabWidgetProps) {
  const account = useActiveAccount()
  const remountKey = resolveWalletRemountKey(account?.address)
  return <CommunityWidget key={remountKey} onSelectTab={onSelectTab} />
}

function CommunityTabContent() {
  return <CommunityContent />
}

/** Sync registry — loading UX is data-driven inside tabs, not code-split Suspense. */
export const dappTabEntries: readonly DappTabEntry[] = [
  { id: 'swap', Widget: SwapTabWidget, Content: SwapTabContent },
  { id: 'genesis', Widget: GenesisTabWidget, Content: GenesisTabContent },
  { id: 'rewards', Widget: RewardsTabWidget, Content: RewardsTabContent },
  { id: 'community', Widget: CommunityTabWidget, Content: CommunityTabContent },
]

const dappTabEntryById = Object.fromEntries(
  dappTabEntries.map((entry) => [entry.id, entry]),
) as Record<DappTab, DappTabEntry>

export function getDappTabEntry(tab: DappTab): DappTabEntry {
  return dappTabEntryById[tab]
}
