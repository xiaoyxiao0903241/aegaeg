/**
 * 质押模块（Tab 容器）
 *
 * 子视图为质押 / LP 债券 / 燃烧债券 / XMine / 计算器，
 * 左侧表单与右侧详情随子视图联动，默认展示质押 Hub。
 */
import { useDappSubviewDisplayView } from '~/app/shell/dapp-subview-panel'
import { DappTabDetailShell, DappTabWidgetShell } from '~/app/shell/dapp-tab-panel-shell'
import type { StakingView } from '~/shared/config/dapp-deep-links'
import { useStakingViewMotion } from '~/stores/staking-view-store'
import { BondContent } from '~/views/dapp/staking/bond/bond-content'
import { BondWidget } from '~/views/dapp/staking/bond/bond-widget'
import { CalcContent } from '~/views/dapp/staking/calc/calc-content'
import { CalcWidget } from '~/views/dapp/staking/calc/calc-widget'
import { StakingHubContent } from '~/views/dapp/staking/hub/staking-hub-content'
import { StakingHubWidget } from '~/views/dapp/staking/hub/staking-hub-widget'
import { StakeContent } from '~/views/dapp/staking/stake/stake-content'
import { StakeWidget } from '~/views/dapp/staking/stake/stake-widget'
import { XmineContent } from '~/views/dapp/staking/xmine/xmine-content'
import { XmineWidget } from '~/views/dapp/staking/xmine/xmine-widget'

function StakingWidgetBody() {
  const view = useDappSubviewDisplayView<StakingView>()
  if (view === 'stake') return <StakeWidget />
  if (view === 'lpbond') return <BondWidget kind="lp" />
  if (view === 'burnbond') return <BondWidget kind="burn" />
  if (view === 'xmine') return <XmineWidget />
  if (view === 'calc') return <CalcWidget />
  return <StakingHubWidget />
}

function StakingContentBody() {
  const view = useDappSubviewDisplayView<StakingView>()
  if (view === 'stake') return <StakeContent />
  if (view === 'lpbond') return <BondContent kind="lp" />
  if (view === 'burnbond') return <BondContent kind="burn" />
  if (view === 'xmine') return <XmineContent />
  if (view === 'calc') return <CalcContent />
  return <StakingHubContent />
}

export function StakingWidget() {
  const subview = useStakingViewMotion()
  return (
    <DappTabWidgetShell subview={subview}>
      <StakingWidgetBody />
    </DappTabWidgetShell>
  )
}

export function StakingContent() {
  const subview = useStakingViewMotion()
  return (
    <DappTabDetailShell subview={subview}>
      <StakingContentBody />
    </DappTabDetailShell>
  )
}
