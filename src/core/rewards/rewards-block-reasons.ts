/**
 * Pure live-block helpers for rewards simple sign + Mixed (Lucky / DaoPool).
 * sessionReady ≠ empty/zero amount — separate reasons for honest UI copy.
 */

export type RewardsSimpleClaimBlockReason = 'notSessionReady' | 'zeroAmount' | 'lockedUnknown'

export type RewardsMixedBlockReason =
  | 'zeroAmount'
  | 'insufficientReward'
  | 'insufficientContribution'
  | 'releasePlanUnresolved'
  | 'restakePlanUnresolved'
  | 'luckyPaused'
  | 'notClaimable'

export function evaluateRewardsSimpleClaim(args: {
  sessionReady: boolean
  amount: bigint
  unknownLocked: boolean
}): RewardsSimpleClaimBlockReason | null {
  if (!args.sessionReady) return 'notSessionReady'
  if (args.unknownLocked) return 'lockedUnknown'
  if (args.amount <= 0n) return 'zeroAmount'
  return null
}

export function evaluateRewardsMixedClaim(args: {
  amount: bigint
  rewardAvailable: bigint
  contribution: bigint
  requiredContribution: bigint
  releasePlanIndex: number | null
  restakePlanIndex: number | null
  luckyPaused?: boolean
  luckyClaimable?: boolean
}): RewardsMixedBlockReason | null {
  if (args.luckyPaused) return 'luckyPaused'
  if (args.luckyClaimable === false) return 'notClaimable'
  if (args.amount <= 0n) return 'zeroAmount'
  if (args.rewardAvailable < args.amount) return 'insufficientReward'
  if (args.releasePlanIndex == null) return 'releasePlanUnresolved'
  if (args.restakePlanIndex == null) return 'restakePlanUnresolved'
  if (args.contribution < args.requiredContribution) return 'insufficientContribution'
  return null
}

/** Lucky money-path open only when won, unclaimed, amount > 0, and pool not paused. */
export function isLuckyClaimable(args: {
  paused: boolean
  won: boolean
  rewardClaimed: boolean
  rewardAmount: bigint
}): boolean {
  return !args.paused && args.won && !args.rewardClaimed && args.rewardAmount > 0n
}
