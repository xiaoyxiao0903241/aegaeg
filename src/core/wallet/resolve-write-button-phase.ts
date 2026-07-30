/**
 * Handbook §1.4 write-button phases → current codebase mapping (thin adapter).
 * Not a second state machine — composes wallet / writeReady / referral / money gates.
 */
export type WriteButtonPhase =
  | 'need_wallet'
  | 'wrong_network'
  | 'need_referral'
  | 'account_migrated'
  | 'need_balance'
  | 'need_allowance'
  | 'estimating'
  | 'ready'
  | 'submitting'
  | 'blocked'

export function resolveWriteButtonPhase(args: {
  walletReady: boolean
  /** Connected but not on expected chain (BSC). */
  writeReady: boolean
  needReferral: boolean
  accountMigrated?: boolean
  moneyGate:
    | 'notBound'
    | 'accountMigrated'
    | 'insufficientBalance'
    | 'insufficientAllowance'
    | 'insufficientQuota'
    | 'poolPaused'
    | 'depositoryNotAuth'
    | 'zeroAmount'
    | 'unavailable'
    | null
  isQuoting?: boolean
  isSubmitting?: boolean
}): WriteButtonPhase {
  if (!args.walletReady) return 'need_wallet'
  if (!args.writeReady) return 'wrong_network'
  if (args.accountMigrated || args.moneyGate === 'accountMigrated') return 'account_migrated'
  if (args.needReferral || args.moneyGate === 'notBound') return 'need_referral'
  if (args.isSubmitting) return 'submitting'
  if (args.isQuoting) return 'estimating'
  if (args.moneyGate === 'insufficientBalance') return 'need_balance'
  if (args.moneyGate === 'insufficientAllowance') return 'need_allowance'
  if (
    args.moneyGate === 'insufficientQuota' ||
    args.moneyGate === 'poolPaused' ||
    args.moneyGate === 'depositoryNotAuth' ||
    args.moneyGate === 'zeroAmount' ||
    args.moneyGate === 'unavailable'
  ) {
    return 'blocked'
  }
  return 'ready'
}
