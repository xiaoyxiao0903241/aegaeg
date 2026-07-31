/**
 * Handbook §1.4 write-button phases → current codebase mapping (thin adapter).
 * Not a second state machine — composes wallet / writeReady / referral / money blocks.
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

export function evaluateWriteButtonPhase(args: {
  walletReady: boolean
  /** Connected but not on expected chain (BSC). */
  writeReady: boolean
  needReferral: boolean
  accountMigrated?: boolean
  moneyBlock:
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
  if (args.accountMigrated || args.moneyBlock === 'accountMigrated') return 'account_migrated'
  if (args.needReferral || args.moneyBlock === 'notBound') return 'need_referral'
  if (args.isSubmitting) return 'submitting'
  if (args.isQuoting) return 'estimating'
  if (args.moneyBlock === 'insufficientBalance') return 'need_balance'
  if (args.moneyBlock === 'insufficientAllowance') return 'need_allowance'
  if (
    args.moneyBlock === 'insufficientQuota' ||
    args.moneyBlock === 'poolPaused' ||
    args.moneyBlock === 'depositoryNotAuth' ||
    args.moneyBlock === 'zeroAmount' ||
    args.moneyBlock === 'unavailable'
  ) {
    return 'blocked'
  }
  return 'ready'
}
