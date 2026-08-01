import { DappSubviewShell, useDappSubviewDisplayView } from '~/app/shell/dapp-subview-panel'
import { useStakingViewMotion } from '~/stores/staking-view-store'
import type { StakingView } from '~/shared/config/dapp-deep-links'
import { StakingHubWidget } from '~/views/dapp/staking/hub/staking-hub-widget'
import { StakingHubContent } from '~/views/dapp/staking/hub/staking-hub-content'
import { StakeWidget } from '~/views/dapp/staking/stake/stake-widget'
import { StakeContent } from '~/views/dapp/staking/stake/stake-content'
import { BondWidget } from '~/views/dapp/staking/bond/bond-widget'
import { BondContent } from '~/views/dapp/staking/bond/bond-content'
import { XmineWidget } from '~/views/dapp/staking/xmine/xmine-widget'
import { XmineContent } from '~/views/dapp/staking/xmine/xmine-content'
import { CalcWidget } from '~/views/dapp/staking/calc/calc-widget'
import { CalcContent } from '~/views/dapp/staking/calc/calc-content'

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
    <DappSubviewShell
      className="flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0"
      panel="widget"
      subview={subview}
    >
      <StakingWidgetBody />
    </DappSubviewShell>
  )
}

export function StakingContent() {
  const subview = useStakingViewMotion()
  return (
    <DappSubviewShell className="min-h-0" panel="detail" subview={subview}>
      <StakingContentBody />
    </DappSubviewShell>
  )
}
