/** Claim Mixed plan tiers — UI days ≠ open-stake 活期/180… (AS-X5). */

export const RELEASE_DURATION_DAYS = [5, 20, 40, 60] as const
export type ReleaseDurationDays = (typeof RELEASE_DURATION_DAYS)[number]

export const RESTAKE_DURATION_DAYS = [360, 540] as const
export type RestakeDurationDays = (typeof RESTAKE_DURATION_DAYS)[number]

export const SECONDS_PER_DAY = 86_400n

export type DurationPlan = {
  /** On-chain array index (RewardQueue / RestakeConfig raw index). */
  index: number
  /** Plan duration in seconds. */
  durationSeconds: bigint
  /** Optional — RestakeConfig taxBP for display. */
  taxBps?: bigint
  exists?: boolean
}

/**
 * Match UI day tier → on-chain plan index by duration (seconds).
 * Fail-closed: no match → null (caller must not submit).
 */
export function matchPlanIndexByDurationDays(
  plans: readonly DurationPlan[],
  days: number,
): number | null {
  const target = BigInt(days) * SECONDS_PER_DAY
  for (const plan of plans) {
    if (plan.exists === false) continue
    if (plan.durationSeconds === target) return plan.index
  }
  return null
}

/** restakeBps = restakePct * 100 (0–10000). */
export function restakeBpsFromPct(restakePct: number): number {
  const pct = Math.min(100, Math.max(0, Math.round(restakePct)))
  return pct * 100
}

/**
 * Label for a duration plan option (release / restake days + optional tax).
 * Call sites pass i18n templates — no locale in core.
 */
export function planLabel(
  days: number,
  plans: readonly DurationPlan[] | undefined,
  daysTax: string,
  daysOnly: string,
  taxRate: string,
): string {
  const target = BigInt(days) * SECONDS_PER_DAY
  const plan = plans?.find((p) => p.exists !== false && p.durationSeconds === target)
  if (plan?.taxBps != null) {
    const tax = taxRate.replace('{rate}', String(Number(plan.taxBps) / 100))
    return daysTax.replace('{days}', String(days)).replace('{tax}', tax)
  }
  return daysOnly.replace('{days}', String(days))
}

/** Release % clamped to 0–100 integer (slider + split math SSOT). */
export function clampReleasePct(releasePct: number): number {
  return Math.min(100, Math.max(0, Math.round(releasePct)))
}

/** Release % → restake % (always sums to 100). */
export function claimSplitFromReleasePct(releasePct: number): {
  releasePct: number
  restakePct: number
} {
  const release = clampReleasePct(releasePct)
  return { releasePct: release, restakePct: 100 - release }
}
