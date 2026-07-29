import type { StakePeriod, BondPeriod } from '~/core/staking/staking-period'

/**
 * Local-only yield estimate for Calc rail — zero chain I/O.
 * Uses simple compound approximation for display; not a protocol quote.
 */
export function calcStakingEstimate(args: {
  principal: number
  /** Annual rate as fraction, e.g. 0.12 = 12%. */
  apr: number
  /** Holding days. */
  days: number
  /** Compounding periods per year (e.g. 365 daily). */
  compoundsPerYear?: number
}): { interest: number; total: number } {
  const { principal, apr, days } = args
  if (!(principal > 0) || !(apr >= 0) || !(days > 0)) {
    return { interest: 0, total: Math.max(0, principal) }
  }
  const n = args.compoundsPerYear ?? 365
  const years = days / 365
  const total = principal * (1 + apr / n) ** (n * years)
  return { interest: total - principal, total }
}

export function defaultAprForStakePeriod(period: StakePeriod): number {
  if (period === 'liquid') return 0.08
  if (period === '180') return 0.12
  if (period === '360') return 0.15
  return 0.18
}

export function defaultAprForBondPeriod(period: BondPeriod): number {
  if (period === '180') return 0.1
  if (period === '360') return 0.12
  return 0.14
}
