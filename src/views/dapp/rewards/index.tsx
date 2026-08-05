/**
 * 奖励模块入口
 *
 * 左侧面板与右侧正文共用同一子视图状态，
 * 按子视图分别渲染 hub 聚合页或幸运 / 推荐 / 参与 / 共建 / 发展 / 创世详情页。
 * 未连接钱包时各领取控件显示引导卡。
 */
import { useDappSubviewDisplayView } from '~/app/shell/dapp-subview-panel'
import { DappTabDetailShell, DappTabWidgetShell } from '~/app/shell/dapp-tab-panel-shell'
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
  if (view === 'referral') return <RewardsSimpleClaimWidget view="referral" />
  if (view === 'participate') return <RewardsSimpleClaimWidget view="participate" />
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

/** 奖励左栏面板：按当前子视图切换对应的领取控件 */
export function RewardsWidget() {
  const subview = useRewardsViewMotion()
  return (
    <DappTabWidgetShell subview={subview}>
      <RewardsWidgetBody />
    </DappTabWidgetShell>
  )
}

/** 奖励正文区：按当前子视图切换 hub 聚合页或对应详情页 */
export function RewardsContent() {
  const subview = useRewardsViewMotion()
  return (
    <DappTabDetailShell subview={subview}>
      <RewardsContentBody />
    </DappTabDetailShell>
  )
}
