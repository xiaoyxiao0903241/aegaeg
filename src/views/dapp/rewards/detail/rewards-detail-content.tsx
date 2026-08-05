import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { RewardsCobuildContent } from '~/views/dapp/rewards/detail/rewards-cobuild-content'
import { RewardsGenesisContent } from '~/views/dapp/rewards/detail/rewards-genesis-content'
import { RewardsGrantContent } from '~/views/dapp/rewards/detail/rewards-grant-content'
import { RewardsLuckyContent } from '~/views/dapp/rewards/detail/rewards-lucky-content'
import { RewardsParticipateContent } from '~/views/dapp/rewards/detail/rewards-participate-content'
import { RewardsReferralContent } from '~/views/dapp/rewards/detail/rewards-referral-content'

/**
 * 奖励详情正文分发
 *
 * 按子视图渲染对应详情页；未匹配的视图兜底为创世详情。
 *
 * @param view 当前子视图（hub 之外的类型）
 */
export function RewardsDetailContent({ view }: { view: Exclude<RewardsView, 'hub'> }) {
  if (view === 'lucky') return <RewardsLuckyContent />
  if (view === 'referral') return <RewardsReferralContent />
  if (view === 'participate') return <RewardsParticipateContent />
  if (view === 'cobuild') return <RewardsCobuildContent />
  if (view === 'grant') return <RewardsGrantContent />
  return <RewardsGenesisContent />
}
