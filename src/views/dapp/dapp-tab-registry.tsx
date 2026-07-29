import type { ComponentType } from 'react'
import type { DappTab } from '~/shared/config/dapp-tabs'
import type { DappTabSessions } from '~/views/dapp/dapp-tab-sessions'
import { AssetsContent, AssetsWidget } from '~/views/dapp/assets'
import { CommunityContent } from '~/views/dapp/community/community-content'
import { CommunityWidget } from '~/views/dapp/community/community-widget'
import { GenesisContent } from '~/views/dapp/genesis/genesis-content'
import { GenesisWidget } from '~/views/dapp/genesis/genesis-widget'
import { ReleaseContent } from '~/views/dapp/release/release-content'
import { ReleaseWidget } from '~/views/dapp/release/release-widget'
import { RewardsContent } from '~/views/dapp/rewards/rewards-content'
import { RewardsWidget } from '~/views/dapp/rewards/rewards-widget'
import { StakingContent, StakingWidget } from '~/views/dapp/staking'
import { ExchangeContent, ExchangeWidget } from '~/views/dapp/exchange'
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

function ExchangeTabWidget({ trade, flash, burn, turbine }: TabWidgetProps) {
  return <ExchangeWidget burn={burn} flash={flash} trade={trade} turbine={turbine} />
}

function ExchangeTabContent({ trade, flash, burn, turbine }: TabContentProps) {
  return <ExchangeContent burn={burn} flash={flash} trade={trade} turbine={turbine} />
}

function AssetsTabWidget() {
  return <AssetsWidget />
}

function AssetsTabContent() {
  return <AssetsContent />
}

function StakingTabWidget() {
  return <StakingWidget />
}

function StakingTabContent() {
  return <StakingContent />
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

function ReleaseTabWidget() {
  return <ReleaseWidget />
}

function ReleaseTabContent() {
  return <ReleaseContent />
}

function CommunityTabWidget() {
  const account = useActiveAccount()
  const remountKey = resolveWalletRemountKey(account?.address)
  return <CommunityWidget key={remountKey} />
}

function CommunityTabContent() {
  return <CommunityContent />
}

/** Sync registry — loading UX is data-driven inside tabs, not code-split Suspense. */
export const dappTabEntries: readonly DappTabEntry[] = [
  { id: 'exchange', Widget: ExchangeTabWidget, Content: ExchangeTabContent },
  { id: 'assets', Widget: AssetsTabWidget, Content: AssetsTabContent },
  { id: 'staking', Widget: StakingTabWidget, Content: StakingTabContent },
  { id: 'rewards', Widget: RewardsTabWidget, Content: RewardsTabContent },
  { id: 'release', Widget: ReleaseTabWidget, Content: ReleaseTabContent },
  { id: 'community', Widget: CommunityTabWidget, Content: CommunityTabContent },
  { id: 'genesis', Widget: GenesisTabWidget, Content: GenesisTabContent },
]

const dappTabEntryById = Object.fromEntries(
  dappTabEntries.map((entry) => [entry.id, entry]),
) as Record<DappTab, DappTabEntry>

export function getDappTabEntry(tab: DappTab): DappTabEntry {
  return dappTabEntryById[tab]
}
