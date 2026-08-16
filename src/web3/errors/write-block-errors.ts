import { CLAIM_SIGNATURE_EXPIRED } from '~/web3/errors/sentinels'

/** 各业务写操作的软阻断哨兵；不含文案，统一在 `getErrorMessage` 映射。 */

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

export const STAKING_BLOCKED = {
  accountMigrated: 'STAKING_ACCOUNT_MIGRATED',
  notBound: 'STAKING_NOT_BOUND',
  insufficientBalance: 'STAKING_INSUFFICIENT_BALANCE',
  insufficientAllowance: 'STAKING_INSUFFICIENT_ALLOWANCE',
  insufficientQuota: 'STAKING_INSUFFICIENT_QUOTA',
  poolPaused: 'STAKING_POOL_PAUSED',
  zeroAmount: 'STAKING_ZERO_AMOUNT',
  unavailable: 'STAKING_UNAVAILABLE',
} as const

export const BOND_ZAP_BLOCKED = {
  accountMigrated: 'BOND_ZAP_ACCOUNT_MIGRATED',
  notBound: 'BOND_ZAP_NOT_BOUND',
  insufficientBalance: 'BOND_ZAP_INSUFFICIENT_BALANCE',
  insufficientAllowance: 'BOND_ZAP_INSUFFICIENT_ALLOWANCE',
  depositoryNotAuth: 'BOND_ZAP_DEPOSITORY_NOT_AUTH',
  insufficientDebtCapacity: 'BOND_ZAP_INSUFFICIENT_DEBT_CAPACITY',
  bondTooSmall: 'BOND_ZAP_BOND_TOO_SMALL',
  bondTooLarge: 'BOND_ZAP_BOND_TOO_LARGE',
  zeroAmount: 'BOND_ZAP_ZERO_AMOUNT',
  unavailable: 'BOND_ZAP_UNAVAILABLE',
} as const

export const XMINE_BLOCKED = {
  accountMigrated: 'XMINE_ACCOUNT_MIGRATED',
  insufficientBalance: 'XMINE_INSUFFICIENT_BALANCE',
  insufficientAllowance: 'XMINE_INSUFFICIENT_ALLOWANCE',
  insufficientQuota: 'XMINE_INSUFFICIENT_QUOTA',
  zeroAmount: 'XMINE_ZERO_AMOUNT',
  unavailable: 'XMINE_UNAVAILABLE',
} as const

export const BURN_BLOCKED = {
  paused: 'BURN_CONTRIBUTION_PAUSED',
  belowMin: 'BURN_CONTRIBUTION_BELOW_MIN',
  aboveMax: 'BURN_CONTRIBUTION_ABOVE_MAX',
  zeroRate: 'BURN_CONTRIBUTION_ZERO_RATE',
  zeroAmount: 'BURN_CONTRIBUTION_ZERO_AMOUNT',
} as const

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

export const RELEASE_BLOCKED = {
  accountMigrated: 'RELEASE_ACCOUNT_MIGRATED',
  zeroAmount: 'RELEASE_ZERO_AMOUNT',
  lockedUnknown: 'RELEASE_LOCKED_UNKNOWN',
  planUnresolved: 'RELEASE_PLAN_UNRESOLVED',
  unavailable: 'RELEASE_UNAVAILABLE',
} as const
