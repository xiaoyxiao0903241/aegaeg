/**
 * 质押模块（Tab 容器）
 *
 * 子视图为质押 / LP 债券 / 燃烧债券 / XMine / 计算器，
 * 左侧表单与右侧详情随子视图联动，默认展示质押 Hub。
 */
import { useSubviewDisplayView } from '~/app/shell/subview-panel'
import { TabDetailShell, TabWidgetShell } from '~/app/shell/tab-panel-shell'
import type { StakingView } from '~/shared/config/dapp-deep-links'
import { useStakingViewMotion } from '~/stores/staking-view-store'
import { BondDetail } from '~/views/dapp/staking/bond/bond-detail'
import { BondWidget } from '~/views/dapp/staking/bond/bond-widget'
import { CalcDetail } from '~/views/dapp/staking/calc/calc-detail'
import { CalcWidget } from '~/views/dapp/staking/calc/calc-widget'
import { StakingDetail } from '~/views/dapp/staking/hub/staking-detail'
import { StakingHubWidget } from '~/views/dapp/staking/hub/staking-hub-widget'
import { StakeDetail } from '~/views/dapp/staking/stake/stake-detail'
import { StakeWidget } from '~/views/dapp/staking/stake/stake-widget'
import { StakingXmineDetail } from '~/views/dapp/staking/xmine/staking-xmine-detail'
import { XmineWidget } from '~/views/dapp/staking/xmine/xmine-widget'

function StakingWidgetBody() {
  const view = useSubviewDisplayView<StakingView>()
  if (view === 'stake') return <StakeWidget />
  if (view === 'lpbond') return <BondWidget kind="lp" />
  if (view === 'burnbond') return <BondWidget kind="burn" />
  if (view === 'xmine') return <XmineWidget />
  if (view === 'calc') return <CalcWidget />
  return <StakingHubWidget />
}

function StakingContentBody() {
  const view = useSubviewDisplayView<StakingView>()
  if (view === 'stake') return <StakeDetail />
  if (view === 'lpbond') return <BondDetail kind="lp" />
  if (view === 'burnbond') return <BondDetail kind="burn" />
  if (view === 'xmine') return <StakingXmineDetail />
  if (view === 'calc') return <CalcDetail />
  return <StakingDetail />
}

export function StakingWidget() {
  const subview = useStakingViewMotion()
  return (
    <TabWidgetShell subview={subview}>
      <StakingWidgetBody />
    </TabWidgetShell>
  )
}

export function StakingContent() {
  const subview = useStakingViewMotion()
  return (
    <TabDetailShell subview={subview}>
      <StakingContentBody />
    </TabDetailShell>
  )
}
