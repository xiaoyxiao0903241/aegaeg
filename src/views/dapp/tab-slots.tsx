import type { DappTab } from '~/shared/config/dapp-tabs'
import { getDappTabEntry } from '~/views/dapp/dapp-tab-registry'
import type { DappTabSessions } from '~/views/dapp/dapp-tab-sessions'

export function TabWidget({
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
  const { Widget } = getDappTabEntry(activeTab)
  return (
    <Widget
      burn={burn}
      flash={flash}
      genesis={genesis}
      onSelectTab={onSelectTab}
      trade={trade}
      turbine={turbine}
    />
  )
}

export function TabContent({
  activeTab,
  trade,
  flash,
  burn,
  turbine,
  genesis,
}: {
  activeTab: DappTab
} & DappTabSessions) {
  const { Content } = getDappTabEntry(activeTab)
  return <Content burn={burn} flash={flash} genesis={genesis} trade={trade} turbine={turbine} />
}
