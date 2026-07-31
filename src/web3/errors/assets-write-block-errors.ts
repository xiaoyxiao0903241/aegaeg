/** Soft-block sentinels for assets claim / redeem / xmine writes. Locale-free; map in `getErrorMessage`. */
export const ASSETS_BLOCKED = {
  zeroAmount: 'ASSETS_ZERO_AMOUNT',
  insufficientReward: 'ASSETS_INSUFFICIENT_REWARD',
  insufficientContribution: 'ASSETS_INSUFFICIENT_CONTRIBUTION',
  releasePlanUnresolved: 'ASSETS_RELEASE_PLAN_UNRESOLVED',
  restakePlanUnresolved: 'ASSETS_RESTAKE_PLAN_UNRESOLVED',
  nothingToRedeem: 'ASSETS_NOTHING_TO_REDEEM',
  warmupActive: 'ASSETS_WARMUP_ACTIVE',
  warmupNotEnded: 'ASSETS_WARMUP_NOT_ENDED',
  noWarmup: 'ASSETS_NO_WARMUP',
  unavailable: 'ASSETS_UNAVAILABLE',
} as const
