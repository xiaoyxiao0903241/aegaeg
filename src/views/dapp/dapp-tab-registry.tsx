import type { ComponentType } from 'react'

import type { DappTab } from '~/shared/config/dapp-tabs'
import { walletRemountKey } from '~/shared/lib/wallet-remount-key'
import { AssetsContent, AssetsWidget } from '~/views/dapp/assets'
import { CommunityContent } from '~/views/dapp/community/community-content'
import { CommunityWidget } from '~/views/dapp/community/community-widget'
import type { DappTabSessions } from '~/views/dapp/dapp-tab-sessions'
import { ExchangeContent, ExchangeWidget } from '~/views/dapp/exchange'
import { GenesisContent } from '~/views/dapp/genesis/genesis-content'
import { GenesisWidget } from '~/views/dapp/genesis/genesis-widget'
import { ReleaseContent, ReleaseWidget } from '~/views/dapp/release'
import { RewardsContent, RewardsWidget } from '~/views/dapp/rewards'
import { StakingContent, StakingWidget } from '~/views/dapp/staking'
import { useActiveAccount } from '~/web3/thirdweb-react'

type TabWidgetProps = {
  onSelectTab: (tab: DappTab) => void
} & DappTabSessions

type TabContentProps = DappTabSessions

export type DappTabEntry = {
  id: DappTab
  Widget: ComponentType<TabWidgetProps>
  Content: ComponentType<TabContentProps>
}

function ExchangeTabWidget({ trade, flash, burn, turbine }: TabWidgetProps) {
  return <ExchangeWidget burn={burn} flash={flash} trade={trade} turbine={turbine} />
}

function ExchangeTabContent({ trade, flash, burn, turbine }: TabContentProps) {
  return <ExchangeContent burn={burn} flash={flash} trade={trade} turbine={turbine} />
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

function CommunityTabWidget() {
  const account = useActiveAccount()
  const remountKey = walletRemountKey(account?.address)
  return <CommunityWidget key={remountKey} />
}

function CommunityTabContent() {
  return <CommunityContent />
}

/** Sync registry — loading UX is data-driven inside tabs, not code-split Suspense. */
export const dappTabEntries: readonly DappTabEntry[] = [
  { id: 'exchange', Widget: ExchangeTabWidget, Content: ExchangeTabContent },
  { id: 'assets', Widget: AssetsWidget, Content: AssetsContent },
  { id: 'staking', Widget: StakingWidget, Content: StakingContent },
  { id: 'rewards', Widget: RewardsWidget, Content: RewardsContent },
  { id: 'release', Widget: ReleaseWidget, Content: ReleaseContent },
  { id: 'community', Widget: CommunityTabWidget, Content: CommunityTabContent },
  { id: 'genesis', Widget: GenesisTabWidget, Content: GenesisTabContent },
]

const dappTabEntryById = Object.fromEntries(
  dappTabEntries.map((entry) => [entry.id, entry]),
) as Record<DappTab, DappTabEntry>

export function getDappTabEntry(tab: DappTab): DappTabEntry {
  return dappTabEntryById[tab]
}
