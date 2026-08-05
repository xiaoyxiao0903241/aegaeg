/**
 * 奖励模块入口
 *
 * 左侧面板与右侧正文共用同一子视图状态，
 * 按子视图分别渲染总览详情或幸运 / 推荐 / 参与 / 共建 / 发展 / 创世详情页。
 * 未连接钱包时各领取控件显示引导卡。
 */
import { useSubviewDisplayView } from '~/app/shell/subview-panel'
import { TabDetailShell, TabWidgetShell } from '~/app/shell/tab-panel-shell'
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { useRewardsViewMotion } from '~/stores/rewards-view-store'
import { RewardsCobuildDetail } from '~/views/dapp/rewards/detail/rewards-cobuild-detail'
import { RewardsGenesisDetail } from '~/views/dapp/rewards/detail/rewards-genesis-detail'
import { RewardsGenesisClaimWidget } from '~/views/dapp/rewards/detail/rewards-genesis-widget'
import { RewardsGrantDetail } from '~/views/dapp/rewards/detail/rewards-grant-detail'
import { RewardsLuckyDetail } from '~/views/dapp/rewards/detail/rewards-lucky-detail'
import { RewardsMixedClaimWidget } from '~/views/dapp/rewards/detail/rewards-mixed-claim-widget'
import { RewardsParticipateDetail } from '~/views/dapp/rewards/detail/rewards-participate-detail'
import { RewardsReferralDetail } from '~/views/dapp/rewards/detail/rewards-referral-detail'
import { RewardsSimpleClaimWidget } from '~/views/dapp/rewards/detail/rewards-simple-claim-widget'
import { RewardsDetail } from '~/views/dapp/rewards/hub/rewards-detail'
import { RewardsHubWidget } from '~/views/dapp/rewards/hub/rewards-hub-widget'

function RewardsWidgetBody() {
  const view = useSubviewDisplayView<RewardsView>()
  if (view === 'lucky') return <RewardsMixedClaimWidget view="lucky" />
  if (view === 'referral') return <RewardsSimpleClaimWidget view="referral" />
  if (view === 'participate') return <RewardsSimpleClaimWidget view="participate" />
  if (view === 'cobuild') return <RewardsMixedClaimWidget view="cobuild" />
  if (view === 'grant') return <RewardsSimpleClaimWidget view="grant" />
  if (view === 'genesis') return <RewardsGenesisClaimWidget />
  return <RewardsHubWidget />
}

function RewardsContentBody() {
  const view = useSubviewDisplayView<RewardsView>()
  if (view === 'hub') return <RewardsDetail />
  if (view === 'lucky') return <RewardsLuckyDetail />
  if (view === 'referral') return <RewardsReferralDetail />
  if (view === 'participate') return <RewardsParticipateDetail />
  if (view === 'cobuild') return <RewardsCobuildDetail />
  if (view === 'grant') return <RewardsGrantDetail />
  return <RewardsGenesisDetail />
}

/** 奖励左栏面板：按当前子视图切换对应的领取控件 */
export function RewardsWidget() {
  const subview = useRewardsViewMotion()
  return (
    <TabWidgetShell subview={subview}>
      <RewardsWidgetBody />
    </TabWidgetShell>
  )
}

/** 奖励右栏：按当前子视图切换总览或对应详情页 */
export function RewardsContent() {
  const subview = useRewardsViewMotion()
  return (
    <TabDetailShell subview={subview}>
      <RewardsContentBody />
    </TabDetailShell>
  )
}
