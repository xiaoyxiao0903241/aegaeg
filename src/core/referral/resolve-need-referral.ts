/** Handbook §5 / §1.4 — unbound referrer blocks stake/bond/governance writes. */
export type NeedReferralReason = 'need_referral'

/**
 * Pure gate: `isBindReferral === false` → need_referral.
 * Call sites map to UI (`notBound` / bind CTA → community). Flash/Trade do not use this.
 */
export function resolveNeedReferral(
  isBound: boolean | null | undefined,
): NeedReferralReason | null {
  if (isBound === true) return null
  if (isBound === false) return 'need_referral'
  // Unknown / loading — fail-closed for money writes that require bind.
  return 'need_referral'
}
