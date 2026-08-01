import type { WriteButtonPhase } from '~/core/wallet/write-button-phase'

/** Release / claim rails: wallet + writeReady + path busy (latch∨in-flight) + claimable. */
export function canClaimWhen(args: {
  walletReady: boolean
  writeReady: boolean
  /** Historical name — pass `useChainMutation.isLocked` (busy, not latch-only). */
  unknownReceiptLocked: boolean
  claimable: bigint
  /** When set, also require plan index resolved (queue rows). */
  planIndexOk?: boolean
}): boolean {
  if (!args.walletReady || !args.writeReady || args.unknownReceiptLocked) return false
  if (args.claimable <= 0n) return false
  if (args.planIndexOk === false) return false
  return true
}

/** Stake / bond / xmine primary CTA: blocked while path busy, submitting, or not write-ready. */
export function writeCtaDisabled(args: {
  /** Historical name — pass `useChainMutation.isLocked` (busy, not latch-only). */
  unknownReceiptLocked: boolean
  isSubmitting: boolean
  writeReady: boolean
  walletReady: boolean
}): boolean {
  return args.unknownReceiptLocked || args.isSubmitting || !args.writeReady || !args.walletReady
}

/** §1.4 phase → CTA label (migrated / bind referral / default submit). */
export function writeCtaLabel(
  phase: WriteButtonPhase,
  copy: { accountMigrated: string; bindReferral: string; submit: string },
): string {
  if (phase === 'account_migrated') return copy.accountMigrated
  if (phase === 'need_referral') return copy.bindReferral
  return copy.submit
}

/** `{template}` with `{balance}` replaced — empty balance → `''` (DappCountValue retains). */
export function formatAmountBalanceLabel(template: string, args: { balance: string }): string {
  if (args.balance.trim() === '') return ''
  return template.replace('{balance}', args.balance)
}
