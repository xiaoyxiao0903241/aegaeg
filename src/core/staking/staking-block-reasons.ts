/**
 * Pure live-block helpers for staking / bond zap / xmine (approve → live → write).
 * Call sites must re-read chain state after approve; do not trust render snapshots.
 */

export type StakeLiveBlockReason =
  | 'accountMigrated'
  | 'notBound'
  | 'insufficientBalance'
  | 'insufficientAllowance'
  | 'insufficientQuota'
  | 'poolPaused'
  | 'zeroAmount'
  | 'unavailable'

export type BondZapLiveBlockReason =
  | 'accountMigrated'
  | 'notBound'
  | 'insufficientBalance'
  | 'insufficientAllowance'
  | 'depositoryNotAuth'
  | 'zeroAmount'
  | 'unavailable'

export type XmineLiveBlockReason =
  'insufficientBalance' | 'insufficientAllowance' | 'insufficientQuota' | 'zeroAmount'

/**
 * `isOldAccount`:
 * - `true` → migrated (block)
 * - `false` → ok
 * - `null` → status unknown (fail-closed)
 * - omit / `undefined` → migration check not in scope for this call site
 */
export function evaluateStakeLive(args: {
  amount: bigint
  isBound: boolean
  balance: bigint
  allowance: bigint
  remainingQuota: bigint
  /** Locked pools only — liquid always treated as open. */
  poolOpen?: boolean
  /** Handbook §17 — migrated old address must not keep writing. */
  isOldAccount?: boolean | null
}): StakeLiveBlockReason | null {
  if (args.isOldAccount === null) return 'unavailable'
  if (args.isOldAccount === true) return 'accountMigrated'
  if (args.amount <= 0n) return 'zeroAmount'
  if (!args.isBound) return 'notBound'
  if (args.poolOpen === false) return 'poolPaused'
  if (args.balance < args.amount) return 'insufficientBalance'
  if (args.allowance < args.amount) return 'insufficientAllowance'
  if (args.remainingQuota < args.amount) return 'insufficientQuota'
  return null
}

export function evaluateBondZapLive(args: {
  amount: bigint
  isBound: boolean
  balance: bigint
  allowance: bigint
  depositoryAuthorized: boolean
  isOldAccount?: boolean | null
}): BondZapLiveBlockReason | null {
  if (args.isOldAccount === null) return 'unavailable'
  if (args.isOldAccount === true) return 'accountMigrated'
  if (args.amount <= 0n) return 'zeroAmount'
  if (!args.isBound) return 'notBound'
  if (!args.depositoryAuthorized) return 'depositoryNotAuth'
  if (args.balance < args.amount) return 'insufficientBalance'
  if (args.allowance < args.amount) return 'insufficientAllowance'
  return null
}

export function evaluateXmineLive(args: {
  amount: bigint
  balance: bigint
  allowance: bigint
  miningQuota: bigint
}): XmineLiveBlockReason | null {
  if (args.amount <= 0n) return 'zeroAmount'
  if (args.balance < args.amount) return 'insufficientBalance'
  if (args.allowance < args.amount) return 'insufficientAllowance'
  if (args.miningQuota < args.amount) return 'insufficientQuota'
  return null
}

/**
 * 手册 §15：current + amount ≤ miningQuotaOf。
 * Max / 输入封顶 = min(gAGX 余额, max(0, quota − staked))。
 */
export function xmineSpendableCap(
  balance: bigint,
  miningQuota: bigint,
  miningStaked: bigint,
): bigint {
  const remaining = miningQuota > miningStaked ? miningQuota - miningStaked : 0n
  return balance < remaining ? balance : remaining
}

/** 活期 warmup 激活：live `isWarmupExpired` 未到期则禁写。 */
export function evaluateLiquidWarmupClaimLive(
  isWarmupExpired: boolean,
): Extract<StakeLiveBlockReason, 'unavailable'> | null {
  if (!isWarmupExpired) return 'unavailable'
  return null
}
