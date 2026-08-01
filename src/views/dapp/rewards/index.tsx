import { DappSubviewShell, useDappSubviewDisplayView } from '~/app/shell/dapp-subview-panel'
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { useRewardsViewMotion } from '~/stores/rewards-view-store'
import { RewardsDetailContent } from '~/views/dapp/rewards/detail/rewards-detail-content'
import { RewardsGenesisClaimWidget } from '~/views/dapp/rewards/detail/rewards-genesis-widget'
import { RewardsMixedClaimWidget } from '~/views/dapp/rewards/detail/rewards-mixed-claim-widget'
import { RewardsSimpleClaimWidget } from '~/views/dapp/rewards/detail/rewards-simple-claim-widget'
import { RewardsHubContent } from '~/views/dapp/rewards/hub/rewards-hub-content'
import { RewardsHubWidget } from '~/views/dapp/rewards/hub/rewards-hub-widget'

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
    >
      <RewardsWidgetBody />
    </DappSubviewShell>
  )
}

export function RewardsContent() {
  const subview = useRewardsViewMotion()
  return (
    <DappSubviewShell className="min-h-0" panel="detail" subview={subview}>
      <RewardsContentBody />
    </DappSubviewShell>
  )
}
