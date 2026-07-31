/** Soft-block sentinels for staking / bond-zap / xmine writes. Locale-free; map in `getErrorMessage`. */
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
  zeroAmount: 'BOND_ZAP_ZERO_AMOUNT',
  unavailable: 'BOND_ZAP_UNAVAILABLE',
} as const

export const XMINE_BLOCKED = {
  insufficientBalance: 'XMINE_INSUFFICIENT_BALANCE',
  insufficientAllowance: 'XMINE_INSUFFICIENT_ALLOWANCE',
  insufficientQuota: 'XMINE_INSUFFICIENT_QUOTA',
  zeroAmount: 'XMINE_ZERO_AMOUNT',
  unavailable: 'XMINE_UNAVAILABLE',
} as const
