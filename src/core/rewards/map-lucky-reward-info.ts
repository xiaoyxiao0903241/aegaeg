import { isLuckyClaimable } from '~/core/rewards/rewards-block-reasons'

/** 幸运奖累计账本映射结果（待领走 pending，不再按轮次）。 */
export type LuckyRewardInfoView = {
  paused: boolean
  rewardAmount: bigint
  totalUnclaimedAmount: bigint
  won: boolean
  rewardClaimed: boolean
  claimable: boolean
}

const EMPTY: Omit<LuckyRewardInfoView, 'paused'> = {
  rewardAmount: 0n,
  totalUnclaimedAmount: 0n,
  won: false,
  rewardClaimed: false,
  claimable: false,
}

/**
 * 把 LuckyPool.getRewardInfo 三元组映射为领取快照。
 *
 * 链上返回 (accrued, claimed, pending)，pending = accrued - claimed。
 * 对不上则金额归零、不可领，避免把累计毛额当成待领。
 *
 * @param args.paused 池是否暂停
 * @param args.accrued 累计毛奖励
 * @param args.claimed 已领取
 * @param args.pending 待领取毛奖励
 * @returns 展示金额与是否可领
 * @see LuckyPool.getRewardInfo / claimRewardMixed(releasePlanIndex, restakePlanIndex, restakeBps)
 */
export function mapLuckyRewardInfo(args: {
  paused: boolean
  accrued: bigint
  claimed: bigint
  pending: bigint
}): LuckyRewardInfoView {
  const { paused, accrued, claimed, pending } = args
  const ledgerBroken = claimed > accrued || pending !== accrued - claimed
  if (ledgerBroken) {
    return { paused, ...EMPTY }
  }
  return {
    paused,
    rewardAmount: pending,
    totalUnclaimedAmount: pending,
    won: accrued > 0n,
    rewardClaimed: accrued > 0n && pending === 0n,
    claimable: isLuckyClaimable({ paused, rewardAmount: pending }),
  }
}
