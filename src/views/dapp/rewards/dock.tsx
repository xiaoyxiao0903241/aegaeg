/**
 * 奖励左栏 Dock：按子视图切换领取面板。
 */
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { useRewardsViewMotion } from '~/stores/rewards-view-store'
import { CobuildDock } from '~/views/dapp/rewards/cobuild/dock'
import { GenesisDock } from '~/views/dapp/rewards/genesis/dock'
import { GrantDock } from '~/views/dapp/rewards/grant/dock'
import { HubDock } from '~/views/dapp/rewards/hub/dock'
import { LuckyDock } from '~/views/dapp/rewards/lucky/dock'
import { ParticipateDock } from '~/views/dapp/rewards/participate/dock'
import { ReferralDock } from '~/views/dapp/rewards/referral/dock'
import { useSubviewDisplayView } from '~/views/dapp/shared/subview-panel'
import { TabDockShell } from '~/views/dapp/shared/tab-shell'

function RewardsDockBody() {
  const view = useSubviewDisplayView<RewardsView>()
  if (view === 'lucky') return <LuckyDock />
  if (view === 'referral') return <ReferralDock />
  if (view === 'participate') return <ParticipateDock />
  if (view === 'cobuild') return <CobuildDock />
  if (view === 'grant') return <GrantDock />
  if (view === 'genesis') return <GenesisDock />
  return <HubDock />
}

export function RewardsDock() {
  const subview = useRewardsViewMotion()
  return (
    <TabDockShell subview={subview}>
      <RewardsDockBody />
    </TabDockShell>
  )
}
