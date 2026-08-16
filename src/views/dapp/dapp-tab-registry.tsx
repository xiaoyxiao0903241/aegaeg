import type { ComponentType } from 'react'

import type { DappTab } from '~/shared/config/dapp-tabs'
import { walletRemountKey } from '~/shared/lib/utils'
import { AssetsDetail } from '~/views/dapp/assets/detail'
import { AssetsDock } from '~/views/dapp/assets/dock'
import { CommunityDetail } from '~/views/dapp/community/detail'
import { CommunityDock } from '~/views/dapp/community/dock'
import type { DappTabSessions } from '~/views/dapp/dapp-tab-sessions'
import { ExchangeDetail } from '~/views/dapp/exchange/detail'
import { ExchangeDock } from '~/views/dapp/exchange/dock'
import { GenesisDetail } from '~/views/dapp/genesis/detail'
import { GenesisDock } from '~/views/dapp/genesis/dock'
import { ReleaseDetail } from '~/views/dapp/release/detail'
import { ReleaseDock } from '~/views/dapp/release/dock'
import { RewardsDetail } from '~/views/dapp/rewards/detail'
import { RewardsDock } from '~/views/dapp/rewards/dock'
import { StakingDetail } from '~/views/dapp/staking/detail'
import { StakingDock } from '~/views/dapp/staking/dock'
import { useActiveAccount } from '~/web3/thirdweb-react'

type TabDockProps = {
  onSelectTab: (tab: DappTab) => void
} & DappTabSessions

type TabDetailProps = DappTabSessions

export type DappTabEntry = {
  id: DappTab
  Dock: ComponentType<TabDockProps>
  Detail: ComponentType<TabDetailProps>
}

function ExchangeTabDock({ trade, flash, burn, turbine }: TabDockProps) {
  return <ExchangeDock burn={burn} flash={flash} trade={trade} turbine={turbine} />
}

function ExchangeTabDetail({ trade, flash, burn, turbine }: TabDetailProps) {
  return <ExchangeDetail burn={burn} flash={flash} trade={trade} turbine={turbine} />
}

function GenesisTabDock({ genesis }: TabDockProps) {
  if (!genesis) {
    throw new Error('GenesisDock requires a lifted genesis session')
  }
  return <GenesisDock genesis={genesis} />
}

function GenesisTabDetail({ genesis }: TabDetailProps) {
  if (!genesis) {
    throw new Error('GenesisDetail requires a lifted genesis session')
  }
  return <GenesisDetail genesis={genesis} />
}

function CommunityTabDock() {
  const account = useActiveAccount()
  const remountKey = walletRemountKey(account?.address)
  return <CommunityDock key={remountKey} />
}

function CommunityTabDetail() {
  return <CommunityDetail />
}

/** Tab 注册表：只挂域根 Dock / Detail。 */
export const dappTabEntries: readonly DappTabEntry[] = [
  { id: 'exchange', Dock: ExchangeTabDock, Detail: ExchangeTabDetail },
  { id: 'assets', Dock: AssetsDock, Detail: AssetsDetail },
  { id: 'staking', Dock: StakingDock, Detail: StakingDetail },
  { id: 'rewards', Dock: RewardsDock, Detail: RewardsDetail },
  { id: 'release', Dock: ReleaseDock, Detail: ReleaseDetail },
  { id: 'community', Dock: CommunityTabDock, Detail: CommunityTabDetail },
  { id: 'genesis', Dock: GenesisTabDock, Detail: GenesisTabDetail },
]

const dappTabEntryById = Object.fromEntries(
  dappTabEntries.map((entry) => [entry.id, entry]),
) as Record<DappTab, DappTabEntry>

export function getDappTabEntry(tab: DappTab): DappTabEntry {
  return dappTabEntryById[tab]
}
