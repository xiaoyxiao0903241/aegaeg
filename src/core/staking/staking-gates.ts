/**
 * Pure live-gate helpers for staking / bond zap / xmine (approve → live → write).
 * Call sites must re-read chain state after approve; do not trust render snapshots.
 */

export type StakeLiveGateReason =
  | 'accountMigrated'
  | 'notBound'
  | 'insufficientBalance'
  | 'insufficientAllowance'
  | 'insufficientQuota'
  | 'poolPaused'
  | 'zeroAmount'
  | 'unavailable'

export type BondZapLiveGateReason =
  | 'accountMigrated'
  | 'notBound'
  | 'insufficientBalance'
  | 'insufficientAllowance'
  | 'depositoryNotAuth'
  | 'zeroAmount'
  | 'unavailable'

export type XmineLiveGateReason =
  'insufficientBalance' | 'insufficientAllowance' | 'insufficientQuota' | 'zeroAmount'

/**
 * `isOldAccount`:
 * - `true` → migrated (block)
 * - `false` → ok
 * - `null` → status unknown (fail-closed)
 * - omit / `undefined` → migration check not in scope for this call site
 */
export function evaluateStakeLiveGate(args: {
  amount: bigint
  isBound: boolean
  balance: bigint
  allowance: bigint
  remainingQuota: bigint
  /** Locked pools only — liquid always treated as open. */
  poolOpen?: boolean
  /** Handbook §17 — migrated old address must not keep writing. */
  isOldAccount?: boolean | null
}): StakeLiveGateReason | null {
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

export function evaluateBondZapLiveGate(args: {
  amount: bigint
  isBound: boolean
  balance: bigint
  allowance: bigint
  depositoryAuthorized: boolean
  isOldAccount?: boolean | null
}): BondZapLiveGateReason | null {
  if (args.isOldAccount === null) return 'unavailable'
  if (args.isOldAccount === true) return 'accountMigrated'
  if (args.amount <= 0n) return 'zeroAmount'
  if (!args.isBound) return 'notBound'
  if (!args.depositoryAuthorized) return 'depositoryNotAuth'
  if (args.balance < args.amount) return 'insufficientBalance'
  if (args.allowance < args.amount) return 'insufficientAllowance'
  return null
}

export function evaluateXmineLiveGate(args: {
  amount: bigint
  balance: bigint
  allowance: bigint
  miningQuota: bigint
}): XmineLiveGateReason | null {
  if (args.amount <= 0n) return 'zeroAmount'
  if (args.balance < args.amount) return 'insufficientBalance'
  if (args.allowance < args.amount) return 'insufficientAllowance'
  if (args.miningQuota < args.amount) return 'insufficientQuota'
  return null
}
