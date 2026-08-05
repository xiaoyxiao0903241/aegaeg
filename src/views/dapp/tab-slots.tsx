import type { DappTab } from '~/shared/config/dapp-tabs'
import { getDappTabEntry } from '~/views/dapp/dapp-tab-registry'
import type { DappTabSessions } from '~/views/dapp/dapp-tab-sessions'

export function TabDock({
  activeTab,
  onSelectTab,
  trade,
  flash,
  burn,
  turbine,
  genesis,
}: {
  activeTab: DappTab
  onSelectTab: (tab: DappTab) => void
} & DappTabSessions) {
  const { Dock } = getDappTabEntry(activeTab)
  return (
    <Dock
      burn={burn}
      flash={flash}
      genesis={genesis}
      onSelectTab={onSelectTab}
      trade={trade}
      turbine={turbine}
    />
  )
}

export function TabDetail({
  activeTab,
  trade,
  flash,
  burn,
  turbine,
  genesis,
}: {
  activeTab: DappTab
} & DappTabSessions) {
  const { Detail } = getDappTabEntry(activeTab)
  return <Detail burn={burn} flash={flash} genesis={genesis} trade={trade} turbine={turbine} />
}
