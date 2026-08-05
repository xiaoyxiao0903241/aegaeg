/**
 * 质押右栏 Detail：按子视图切换对应详情。
 */
import type { StakingView } from '~/shared/config/dapp-deep-links'
import { useStakingViewMotion } from '~/stores/staking-view-store'
import { useSubviewDisplayView } from '~/views/dapp/shared/subview-panel'
import { TabDetailShell } from '~/views/dapp/shared/tab-shell'
import { BondDetail } from '~/views/dapp/staking/bond/detail'
import { CalcDetail } from '~/views/dapp/staking/calc/detail'
import { HubDetail } from '~/views/dapp/staking/hub/detail'
import { StakeDetail } from '~/views/dapp/staking/stake/detail'
import { XmineDetail } from '~/views/dapp/staking/xmine/detail'

function StakingDetailBody() {
  const view = useSubviewDisplayView<StakingView>()
  if (view === 'stake') return <StakeDetail />
  if (view === 'lpbond') return <BondDetail kind="lp" />
  if (view === 'burnbond') return <BondDetail kind="burn" />
  if (view === 'xmine') return <XmineDetail />
  if (view === 'calc') return <CalcDetail />
  return <HubDetail />
}

export function StakingDetail() {
  const subview = useStakingViewMotion()
  return (
    <TabDetailShell subview={subview}>
      <StakingDetailBody />
    </TabDetailShell>
  )
}
