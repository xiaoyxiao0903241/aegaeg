/** Calculator slider + projected curve horizon (calc-only; not product lock tenure). */
export const CALC_MAX_DAYS = 720

export type CalcYieldCurvePoint = {
  day: number
  interestUsd: number
}

/** Handbook RewardManager `LOCKED_*_BONUS_BPS` — liquid has no locked bonus. */
export function lockedBonusBps(period: string): number {
  if (period === '180') return 1000
  if (period === '360') return 1500
  if (period === '540') return 2000
  return 0
}

/** sAGX.rebases(epoch).rebase (1e18) → percent units for display (e.g. 0.41 → 0.41%). */
export function epochRebasePctFrom1e18(rate1e18: bigint | null | undefined): number | null {
  if (rate1e18 == null) return null
  const pct = Number(rate1e18) / 1e18
  return Number.isFinite(pct) ? pct : null
}

/** FAQ: 2 epochs/day → base daily yield = 2 × single Rebase%. */
export function baseDailyPctFromEpoch(epochPct: number | null | undefined): number | null {
  if (epochPct == null || !Number.isFinite(epochPct) || epochPct < 0) return null
  return epochPct * 2
}

/** Daily compound interest on principal. `dailyPct` is percent units (0.82 = 0.82%/day). */
export function compoundInterest(principal: number, dailyPct: number, days: number): number {
  if (!(principal > 0) || !(dailyPct >= 0) || !(days > 0)) return 0
  const r = dailyPct / 100
  return principal * ((1 + r) ** days - 1)
}

/**
 * Locked-pool bonus interest — FAQ: does not compound while unclaimed.
 * Each epoch: principal × (epochPct/100) × (bps/10_000); 2 epochs/day.
 */
export function lockedBonusInterest(
  principal: number,
  epochPct: number,
  bonusBps: number,
  days: number,
): number {
  if (!(principal > 0) || !(epochPct >= 0) || !(bonusBps > 0) || !(days > 0)) return 0
  const perEpoch = principal * (epochPct / 100) * (bonusBps / 10_000)
  return perEpoch * days * 2
}

/** Period yield % from base daily compound only (bonus listed separately). */
export function periodYieldPct(baseDailyPct: number, periodDays: number): number {
  if (!(baseDailyPct >= 0) || !(periodDays > 0)) return 0
  const r = baseDailyPct / 100
  return ((1 + r) ** periodDays - 1) * 100
}

/** Tenure days for stake/bond period rows; liquid → 1 day for meta “周期收益率”. */
export function stakePeriodDays(period: string): number {
  if (period === '180') return 180
  if (period === '360') return 360
  if (period === '540') return 540
  return 1
}

/**
 * Local token interest for calc — stake/bond use live rebase + handbook bonus;
 * xmine has no protocol APR view → 0.
 */
export function calcLocalInterest(args: {
  product: 'stake' | 'lpbond' | 'burnbond' | 'xmine'
  period: string
  principal: number
  days: number
  epochRebasePct: number | null
}): { interest: number; total: number } {
  const { product, period, principal, days, epochRebasePct } = args
  if (!(principal > 0) || !(days > 0)) {
    return { interest: 0, total: Math.max(0, principal) }
  }
  if (product === 'xmine' || epochRebasePct == null) {
    return { interest: 0, total: principal }
  }
  const baseDaily = baseDailyPctFromEpoch(epochRebasePct)
  if (baseDaily == null) return { interest: 0, total: principal }

  const compound = compoundInterest(principal, baseDaily, days)
  // Locked stake bonus only — bonds enjoy rebase compound, not LOCKED_* BPS.
  const bonus =
    product === 'stake'
      ? lockedBonusInterest(principal, epochRebasePct, lockedBonusBps(period), days)
      : 0
  const interest = compound + bonus
  return { interest, total: principal + interest }
}

/** Projected cumulative interestUsd for calc curve — day 1..maxDays. */
export function buildCalcYieldCurvePoints(args: {
  product: 'stake' | 'lpbond' | 'burnbond' | 'xmine'
  period: string
  principal: number
  price: number
  epochRebasePct: number | null
  maxDays?: number
}): CalcYieldCurvePoint[] {
  const maxDays = args.maxDays ?? CALC_MAX_DAYS
  const points: CalcYieldCurvePoint[] = []
  for (let day = 1; day <= maxDays; day += 1) {
    const { interest } = calcLocalInterest({
      product: args.product,
      period: args.period,
      principal: args.principal,
      days: day,
      epochRebasePct: args.epochRebasePct,
    })
    points.push({
      day,
      interestUsd: interest * Math.max(0, args.price),
    })
  }
  return points
}
