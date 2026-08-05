/**
 * 奖励右栏 Detail：按子视图切换总览或各奖励详情。
 */
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { useRewardsViewMotion } from '~/stores/rewards-view-store'
import { CobuildDetail } from '~/views/dapp/rewards/cobuild/detail'
import { GenesisDetail } from '~/views/dapp/rewards/genesis/detail'
import { GrantDetail } from '~/views/dapp/rewards/grant/detail'
import { HubDetail } from '~/views/dapp/rewards/hub/detail'
import { LuckyDetail } from '~/views/dapp/rewards/lucky/detail'
import { ParticipateDetail } from '~/views/dapp/rewards/participate/detail'
import { ReferralDetail } from '~/views/dapp/rewards/referral/detail'
import { useSubviewDisplayView } from '~/views/dapp/shared/subview-panel'
import { TabDetailShell } from '~/views/dapp/shared/tab-shell'

function RewardsDetailBody() {
  const view = useSubviewDisplayView<RewardsView>()
  if (view === 'hub') return <HubDetail />
  if (view === 'lucky') return <LuckyDetail />
  if (view === 'referral') return <ReferralDetail />
  if (view === 'participate') return <ParticipateDetail />
  if (view === 'cobuild') return <CobuildDetail />
  if (view === 'grant') return <GrantDetail />
  return <GenesisDetail />
}

export function RewardsDetail() {
  const subview = useRewardsViewMotion()
  return (
    <TabDetailShell subview={subview}>
      <RewardsDetailBody />
    </TabDetailShell>
  )
}
