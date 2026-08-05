/** 计算器滑块与预估曲线的最大天数范围（仅计算器用，非产品锁定期限）。 */
export const CALC_MAX_DAYS = 720

export type CalcYieldCurvePoint = {
  day: number
  interestUsd: number
}

/**
 * 定期池锁定收益加成（BPS）。
 *
 * 数值来自手册 RewardManager 的 LOCKED_*_BONUS_BPS 常量；
 * 活期无锁定加成，返回 0。
 *
 * @param period 产品周期（'180' | '360' | '540' 或其他）
 * @returns 锁定加成 BPS；非定期返回 0
 * @see docs/onchain-manual/contracts/rewardmanager.md
 */
export function lockedBonusBps(period: string): number {
  if (period === '180') return 1000
  if (period === '360') return 1500
  if (period === '540') return 2000
  return 0
}

/**
 * sAGX.rebases(epoch).rebase（1e18 精度）→ 展示用百分比。
 *
 * 例如 0.41 → 0.41%。
 *
 * @param rate1e18 链上 rebase 比率（1e18 精度）；未知时 null/undefined
 * @returns 百分比数值；未知返回 null
 */
export function epochRebasePctFrom1e18(rate1e18: bigint | null | undefined): number | null {
  if (rate1e18 == null) return null
  const pct = Number(rate1e18) / 1e18
  return Number.isFinite(pct) ? pct : null
}

/**
 * 单 epoch 收益率 → 基础日收益率。
 *
 * FAQ：每日 2 个 epoch，基础日收益率 = 2 × 单 epoch Rebase%。
 *
 * @param epochPct 单 epoch 收益率（百分比）；未知或负数时 null
 * @returns 基础日收益率；输入无效返回 null
 */
export function baseDailyPctFromEpoch(epochPct: number | null | undefined): number | null {
  if (epochPct == null || !Number.isFinite(epochPct) || epochPct < 0) return null
  return epochPct * 2
}

/**
 * 本金按日利率复利计算的利息。
 *
 * @param principal 本金
 * @param dailyPct 日收益率（百分比，如 0.82 表示 0.82%/日）
 * @param days 复利天数
 * @returns 复利利息；任一入参非法返回 0
 */
export function compoundInterest(principal: number, dailyPct: number, days: number): number {
  if (!(principal > 0) || !(dailyPct >= 0) || !(days > 0)) return 0
  const r = dailyPct / 100
  return principal * ((1 + r) ** days - 1)
}

/**
 * 定期池锁定加成利息。
 *
 * FAQ：未领取期间加成不参与复利。
 * 每 epoch：本金 × (epochPct/100) × (bps/10000)；每日 2 个 epoch。
 *
 * @param principal 本金
 * @param epochPct 单 epoch 收益率（百分比）
 * @param bonusBps 锁定加成（BPS）
 * @param days 天数
 * @returns 锁定加成利息；任一入参非法返回 0
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

/**
 * 仅按基础日复利计算的周期收益率百分比。
 *
 * 锁定加成单独列出，不并入本值。
 *
 * @param baseDailyPct 基础日收益率（百分比）
 * @param periodDays 周期天数
 * @returns 周期收益率（百分比）；入参非法返回 0
 */
export function periodYieldPct(baseDailyPct: number, periodDays: number): number {
  if (!(baseDailyPct >= 0) || !(periodDays > 0)) return 0
  const r = baseDailyPct / 100
  return ((1 + r) ** periodDays - 1) * 100
}

/**
 * 质押/债券周期行展示用的期限天数。
 *
 * 活期无固定期限，展示为 1 天（对应“周期收益率”口径）。
 *
 * @param period 产品周期（'180' | '360' | '540' 或其他）
 * @returns 期限天数；非定期返回 1
 */
export function stakePeriodDays(period: string): number {
  if (period === '180') return 180
  if (period === '360') return 360
  if (period === '540') return 540
  return 1
}

/**
 * 计算器用的本地代币利息。
 *
 * 质押/债券用实时 rebase 加手册加成；xmine 无协议年化视图，恒为 0。
 *
 * @param args.product 产品类型（stake / lpbond / burnbond / xmine）
 * @param args.period 产品周期
 * @param args.principal 本金（已按产品折算）
 * @param args.days 天数
 * @param args.epochRebasePct 实时 epoch 收益率（百分比）；null 表示按零收益计算
 * @returns 利息与本金合计；本金或天数为 0 时利息为 0
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
  // 仅定期质押有锁定加成；债券走 rebase 复利，不享 LOCKED_*_BPS。
  const bonus =
    product === 'stake'
      ? lockedBonusInterest(principal, epochRebasePct, lockedBonusBps(period), days)
      : 0
  const interest = compound + bonus
  return { interest, total: principal + interest }
}

/**
 * 计算器预估曲线：第 1..maxDays 天的累计利息（USD）。
 *
 * 债券利息已是 USD；质押利息为 AGX × 现价。
 *
 * @param args.product 产品类型
 * @param args.period 产品周期
 * @param args.principal 本金
 * @param args.price 现价（质押折算 USD 用）
 * @param args.epochRebasePct 实时 epoch 收益率（百分比）；null 表示按零收益计算
 * @param args.maxDays 曲线最大天数；缺省为 CALC_MAX_DAYS
 * @returns 逐日累计利息（USD）点数组
 */
export function buildCalcYieldCurvePoints(args: {
  product: 'stake' | 'lpbond' | 'burnbond' | 'xmine'
  period: string
  principal: number
  price: number
  epochRebasePct: number | null
  maxDays?: number
}): CalcYieldCurvePoint[] {
  const maxDays = args.maxDays ?? CALC_MAX_DAYS
  const isBondUsd1 = args.product === 'lpbond' || args.product === 'burnbond'
  const price = Math.max(0, args.price)
  const points: CalcYieldCurvePoint[] = []
  for (let day = 1; day <= maxDays; day += 1) {
    const { interest } = calcLocalInterest({
      product: args.product,
      period: args.period,
      principal: args.principal,
      days: day,
      epochRebasePct: args.epochRebasePct,
    })
    // 债券利息已是 USD；质押利息为 AGX × 现价。
    points.push({
      day,
      interestUsd: isBondUsd1 ? interest : interest * price,
    })
  }
  return points
}
