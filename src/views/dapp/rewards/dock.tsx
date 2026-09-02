/**
 * 奖励左栏 Dock：按子视图切换领取面板。
 */
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { useRewardsViewMotion } from '~/stores/rewards-view-store'
import { CobuildDock } from '~/views/dapp/rewards/cobuild/dock'
import { GenesisDock } from '~/views/dapp/rewards/genesis/dock'
import { GrantDock } from '~/views/dapp/rewards/grant/dock'
import { RewardsHubDock } from '~/views/dapp/rewards/hub/dock'
import { LuckyDock } from '~/views/dapp/rewards/lucky/dock'
import { ParticipateDock } from '~/views/dapp/rewards/participate/dock'
import { ReferralDock } from '~/views/dapp/rewards/referral/dock'
import { useSubviewView } from '~/views/dapp/shared/subview-panel'
import { TabDockHost } from '~/views/dapp/shared/tab-host'

function RewardsDockBody() {
  const view = useSubviewView<RewardsView>()
  if (view === 'lucky') return <LuckyDock />
  if (view === 'referral') return <ReferralDock />
  if (view === 'participate') return <ParticipateDock />
  if (view === 'cobuild') return <CobuildDock />
  if (view === 'grant') return <GrantDock />
  if (view === 'genesis') return <GenesisDock />
  return <RewardsHubDock />
}

export function RewardsDock() {
  const subview = useRewardsViewMotion()
  return (
    <TabDockHost subview={subview}>
      <RewardsDockBody />
    </TabDockHost>
  )
}
