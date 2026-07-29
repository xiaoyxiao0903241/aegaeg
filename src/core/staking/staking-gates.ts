/**
 * Pure live-gate helpers for staking / bond zap / xmine (approve → live → write).
 * Call sites must re-read chain state after approve; do not trust render snapshots.
 */

export type StakeLiveGateReason =
  | 'notBound'
  | 'insufficientBalance'
  | 'insufficientAllowance'
  | 'insufficientQuota'
  | 'poolPaused'
  | 'zeroAmount'

export type BondZapLiveGateReason =
  'notBound' | 'insufficientBalance' | 'insufficientAllowance' | 'depositoryNotAuth' | 'zeroAmount'

export type XmineLiveGateReason =
  'insufficientBalance' | 'insufficientAllowance' | 'insufficientQuota' | 'zeroAmount'

export function evaluateStakeLiveGate(args: {
  amount: bigint
  isBound: boolean
  balance: bigint
  allowance: bigint
  remainingQuota: bigint
  /** Locked pools only — liquid always treated as open. */
  poolOpen?: boolean
}): StakeLiveGateReason | null {
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
}): BondZapLiveGateReason | null {
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
