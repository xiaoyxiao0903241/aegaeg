import type { RewardsView } from '~/shared/config/rewards-deep-link'
import { RewardsCobuildContent } from '~/views/dapp/rewards/detail/rewards-cobuild-content'
import { RewardsGenesisContent } from '~/views/dapp/rewards/detail/rewards-genesis-content'
import { RewardsGrantContent } from '~/views/dapp/rewards/detail/rewards-grant-content'
import { RewardsLuckyContent } from '~/views/dapp/rewards/detail/rewards-lucky-content'
import { RewardsParticipateContent } from '~/views/dapp/rewards/detail/rewards-participate-content'
import { RewardsReferralContent } from '~/views/dapp/rewards/detail/rewards-referral-content'

export function RewardsDetailContent({ view }: { view: Exclude<RewardsView, 'hub'> }) {
  if (view === 'lucky') return <RewardsLuckyContent />
  if (view === 'referral') return <RewardsReferralContent />
  if (view === 'participate') return <RewardsParticipateContent />
  if (view === 'cobuild') return <RewardsCobuildContent />
  if (view === 'grant') return <RewardsGrantContent />
  return <RewardsGenesisContent />
}
