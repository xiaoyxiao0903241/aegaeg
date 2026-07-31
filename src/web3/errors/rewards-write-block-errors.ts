import { CLAIM_SIGNATURE_EXPIRED } from '~/web3/errors/sentinels'

/** Soft-block sentinels for rewards mixed/lucky/dao writes. Locale-free; map in `getErrorMessage`. */
export const REWARDS_BLOCKED = {
  zeroAmount: 'REWARDS_ZERO_AMOUNT',
  insufficientReward: 'REWARDS_INSUFFICIENT_REWARD',
  insufficientContribution: 'REWARDS_INSUFFICIENT_CONTRIBUTION',
  releasePlanUnresolved: 'REWARDS_RELEASE_PLAN_UNRESOLVED',
  restakePlanUnresolved: 'REWARDS_RESTAKE_PLAN_UNRESOLVED',
  luckyPaused: 'REWARDS_LUCKY_PAUSED',
  luckyNotClaimable: 'REWARDS_LUCKY_NOT_CLAIMABLE',
  unavailable: 'REWARDS_UNAVAILABLE',
  signatureExpired: CLAIM_SIGNATURE_EXPIRED,
} as const
