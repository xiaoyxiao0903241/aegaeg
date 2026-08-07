import {
  CALC_MAX_DAYS,
  calcLocalInterest,
  handbookBondDiscountRateBP,
} from '~/core/staking/staking-yield'
import type { CalcEstimateResult, CalcProduct } from '~/stores/calc-estimate-store'

/**
 * 计算收益预估的持仓天数。
 *
 * 定期（180/360/540 天）使用固定期限；活期或未知周期使用滑块天数，
 * 并收敛到 1..CALC_MAX_DAYS 区间。
 *
 * @param period 产品周期（'180' | '360' | '540' 或其他）
 * @param sliderDays 滑块选择的天数
 * @returns 用于估算的持仓天数
 */
export function periodEndDays(period: string, sliderDays: number): number {
  if (period === '180') return 180
  if (period === '360') return 360
  if (period === '540') return 540
  return Math.min(Math.max(1, sliderDays), CALC_MAX_DAYS)
}

/**
 * 生成本地收益估算快照，供计算器左右两侧同步，零链上读取。
 *
 * 债券：投入为 USD1；利息经折扣→AGX→rebase 后再折回 USD。质押本金/利息为 AGX，需乘现价折算 USD。
 *
 * @param args.product 产品类型（stake / lpbond / burnbond / xmine）
 * @param args.period 产品周期
 * @param args.amount 投入数量（允许含千分位逗号）
 * @param args.price 当前价格（质押 AGX 折算 USD / 债券折 AGX 用）
 * @param args.days 预计持仓天数
 * @param args.epochRebasePct 实时 epoch 收益率（展示单位百分比）；null 表示按零收益计算
 * @returns 本地收益估算结果
 */
export function buildCalcEstimate(args: {
  product: CalcProduct
  period: string
  amount: string
  price: string
  days: number
  /** 实时 epoch 收益率（展示单位百分比）；null → 按零收益计算。 */
  epochRebasePct: number | null
  /** XMine 日收益率（%）；仅 product=xmine 时使用。 */
  xmineDailyPct?: number | null
  /** 每日 epoch 数（链上推算）；缺省 FAQ 默认 2。 */
  epochsPerDay?: number | null
}): CalcEstimateResult {
  const principal = Number.parseFloat(args.amount.replace(/,/g, '')) || 0
  const priceN = Number.parseFloat(args.price.replace(/,/g, '')) || 0
  const days = Math.min(Math.max(1, Math.round(args.days)), CALC_MAX_DAYS)
  const isBondUsd1 = args.product === 'lpbond' || args.product === 'burnbond'
  const epochsPerDay = args.epochsPerDay ?? 2
  const estimate = calcLocalInterest({
    product: args.product,
    period: args.period,
    principal,
    days,
    epochRebasePct: args.epochRebasePct,
    xmineDailyPct: args.product === 'xmine' ? (args.xmineDailyPct ?? null) : null,
    agxPriceUsd: isBondUsd1 ? priceN : null,
    discountRateBP: isBondUsd1 ? handbookBondDiscountRateBP(args.period) : null,
    epochsPerDay,
  })
  // 债券：投入为 USD1；利息已在 calcLocalInterest 内折 AGX 后再 × 现价成 USD。
  // 质押/xmine：本金/利息为代币量，须 × 现价。
  const investedUsd = isBondUsd1 ? principal : principal * priceN
  const interestUsd = isBondUsd1 ? estimate.interest : estimate.interest * priceN
  const sellUsd = investedUsd + interestUsd
  const ratePct = investedUsd > 0 ? (interestUsd / investedUsd) * 100 : 0
  return {
    product: args.product,
    period: args.period,
    days,
    principal,
    price: priceN,
    interestTokens: estimate.interest,
    totalTokens: estimate.total,
    interestUsd,
    investedUsd,
    sellUsd,
    ratePct,
    epochRebasePct: args.epochRebasePct,
    xmineDailyPct: args.product === 'xmine' ? (args.xmineDailyPct ?? null) : null,
    epochsPerDay,
  }
}
