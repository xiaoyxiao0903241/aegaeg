import type { ComponentType } from 'react'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { CommunityContent } from '~/views/dapp/community/community-content'
import { CommunityWidget } from '~/views/dapp/community/community-widget'
import { GenesisContent } from '~/views/dapp/genesis/genesis-content'
import { GenesisWidget } from '~/views/dapp/genesis/genesis-widget'
import { RewardsContent } from '~/views/dapp/rewards/rewards-content'
import { RewardsWidget } from '~/views/dapp/rewards/rewards-widget'
import { SwapContent, SwapWidget } from '~/views/dapp/swap'
import { scrollDappPanelsToTop } from '~/app/utils'

export type { DappTab } from '~/shared/config/dapp-tabs'
export { tabOrder } from '~/shared/config/dapp-tabs'

type TabWidgetProps = {
  onSelectTab: (tab: DappTab) => void
}

export type DappTabEntry = {
  id: DappTab
  Widget: ComponentType<TabWidgetProps>
  Content: ComponentType
}

function SwapTabWidget({ onSelectTab }: TabWidgetProps) {
  return (
    <SwapWidget
      onSelectGenesis={() => {
        onSelectTab('genesis')
        scrollDappPanelsToTop()
      }}
    />
  )
}

function GenesisTabWidget() {
  return <GenesisWidget />
}

function RewardsTabWidget() {
  return <RewardsWidget />
}

function CommunityTabWidget({ onSelectTab }: TabWidgetProps) {
  return <CommunityWidget onSelectTab={onSelectTab} />
}

/** Sync registry — loading UX is data-driven inside tabs, not code-split Suspense. */
export const dappTabEntries: readonly DappTabEntry[] = [
  { id: 'swap', Widget: SwapTabWidget, Content: SwapContent },
  { id: 'genesis', Widget: GenesisTabWidget, Content: GenesisContent },
  { id: 'rewards', Widget: RewardsTabWidget, Content: RewardsContent },
  { id: 'community', Widget: CommunityTabWidget, Content: CommunityContent },
]

const dappTabEntryById = Object.fromEntries(
  dappTabEntries.map((entry) => [entry.id, entry]),
) as Record<DappTab, DappTabEntry>

export function getDappTabEntry(tab: DappTab): DappTabEntry {
  return dappTabEntryById[tab]
}
