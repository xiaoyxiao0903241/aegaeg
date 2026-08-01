import { tv } from 'tailwind-variants'
import { DappSubviewShell, useDappSubviewDisplayView } from '~/app/shell/dapp-subview-panel'
import { useRewardsViewMotion } from '~/stores/rewards-view-store'
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { RewardsHubWidget } from '~/views/dapp/rewards/hub/rewards-hub-widget'
import { RewardsHubContent } from '~/views/dapp/rewards/hub/rewards-hub-content'
import { RewardsSimpleClaimWidget } from '~/views/dapp/rewards/detail/rewards-simple-claim-widget'
import { RewardsGenesisClaimWidget } from '~/views/dapp/rewards/detail/rewards-genesis-widget'
import { RewardsMixedClaimWidget } from '~/views/dapp/rewards/detail/rewards-mixed-claim-widget'
import { RewardsDetailContent } from '~/views/dapp/rewards/detail/rewards-detail-content'

const rewardsTransitionStack = tv({
  base: 'grid overflow-hidden *:col-start-1 *:row-start-1 *:min-w-0',
})

function RewardsWidgetBody() {
  const view = useDappSubviewDisplayView<RewardsView>()
  if (view === 'lucky') return <RewardsMixedClaimWidget view="lucky" />
  if (view === 'referral') return <RewardsMixedClaimWidget view="referral" />
  if (view === 'participate') return <RewardsMixedClaimWidget view="participate" />
  if (view === 'cobuild') return <RewardsMixedClaimWidget view="cobuild" />
  if (view === 'grant') return <RewardsSimpleClaimWidget view="grant" />
  if (view === 'genesis') return <RewardsGenesisClaimWidget />
  return <RewardsHubWidget />
}

function RewardsContentBody() {
  const view = useDappSubviewDisplayView<RewardsView>()
  if (view === 'hub') return <RewardsHubContent />
  return <RewardsDetailContent view={view} />
}

export function RewardsWidget() {
  const subview = useRewardsViewMotion()
  return (
    <DappSubviewShell
      className="flex min-h-full flex-col max-dapp:h-auto max-dapp:min-h-0"
      panel="widget"
      subview={subview}
      transitionClassName={rewardsTransitionStack()}
    >
      <RewardsWidgetBody />
    </DappSubviewShell>
  )
}

export function RewardsContent() {
  const subview = useRewardsViewMotion()
  return (
    <DappSubviewShell
      className="min-h-0"
      panel="detail"
      subview={subview}
      transitionClassName={rewardsTransitionStack()}
    >
      <RewardsContentBody />
    </DappSubviewShell>
  )
}
