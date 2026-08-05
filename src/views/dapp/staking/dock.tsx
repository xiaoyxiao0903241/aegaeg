/**
 * 质押左栏 Dock：按子视图切换 Hub / stake / bond / xmine / calc。
 */
import { useSubviewDisplayView } from '~/app/shell/subview-panel'
import { TabWidgetShell } from '~/app/shell/tab-panel-shell'
import type { StakingView } from '~/shared/config/dapp-deep-links'
import { useStakingViewMotion } from '~/stores/staking-view-store'
import { BondDock } from '~/views/dapp/staking/bond/dock'
import { CalcDock } from '~/views/dapp/staking/calc/dock'
import { HubDock } from '~/views/dapp/staking/hub/dock'
import { StakeDock } from '~/views/dapp/staking/stake/dock'
import { XmineDock } from '~/views/dapp/staking/xmine/dock'

function StakingDockBody() {
  const view = useSubviewDisplayView<StakingView>()
  if (view === 'stake') return <StakeDock />
  if (view === 'lpbond') return <BondDock kind="lp" />
  if (view === 'burnbond') return <BondDock kind="burn" />
  if (view === 'xmine') return <XmineDock />
  if (view === 'calc') return <CalcDock />
  return <HubDock />
}

export function StakingDock() {
  const subview = useStakingViewMotion()
  return (
    <TabWidgetShell subview={subview}>
      <StakingDockBody />
    </TabWidgetShell>
  )
}
