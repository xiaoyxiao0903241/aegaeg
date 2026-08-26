import { type StakePeriod } from '~/core/staking/staking-period'
import {
  CALC_MAX_DAYS,
  calcLockDays,
  type CalcProduct,
  computeCalcDay,
  findBreakEvenDay,
} from '~/core/staking/staking-yield'

export type { CalcProduct } from '~/core/staking/staking-yield'

export type CalcEstimateResult = {
  product: CalcProduct
  period: StakePeriod
  days: number
  /** 估算使用的本金金额（质押/挖矿为代币量，债券为 USD1）。 */
  principal: number
  /** 用户到期价（AGX；挖矿为 X）。 */
  price: number
  /** 净收益价值（rewards × Pd）。 */
  interestUsd: number
  /** 已释放本金价值。 */
  releasedUsd: number
  /** 总投入（成本计价 $65 / 债券实付）。 */
  investedUsd: number
  /** 已释放本金价值 + 净收益价值。 */
  sellUsd: number
  /** 卖出总值 − 总投入。 */
  profitUsd: number
  ratePct: number
  /** 收益总额首次 ≥ 0 的天数；始终为负则为 null。 */
  breakEvenDay: number | null
  /** 本金全部可提取的天数。 */
  fullReleaseDay: number
  holdDay: number
  holdProfitUsd: number
  holdRatePct: number
  /** 该快照使用的周期 rebase 百分比（null 表示零收益）。 */
  epochRebasePct: number | null
  /** xmine 日收益率（%）；非 xmine 为 null。 */
  xmineDailyPct: number | null
  /** 每日 epoch 数（链上推算；缺为 null，禁 FAQ 默认）。 */
  epochsPerDay: number | null
}

/**
 * 生成本地收益估算快照，供计算器左右两侧同步，零链上读取。
 *
 * 复利按 epoch、加成按单利毛 Rebase、本金线性释放；成本按 $65，卖出按用户到期价。
 *
 * @param args.product 产品类型（stake / lpbond / burnbond / xmine）
 * @param args.period 产品周期
 * @param args.amount 投入数量（允许含千分位逗号）
 * @param args.price 到期 AGX 价（挖矿为到期 X 价）
 * @param args.days 预计持仓天数
 * @param args.epochRebasePct 链上 epoch 收益率（百分比）；null 表示按零收益计算
 * @param args.xmineDailyPct 链上 X 挖矿日利率（%）；缺 → 挖矿零收益
 * @param args.epochsPerDay 链上每日 epoch 数；缺 → 零利息
 * @returns 本地收益估算结果
 */
export function buildCalcEstimate(args: {
  product: CalcProduct
  period: StakePeriod
  amount: string
  price: string
  days: number
  /** 实时 epoch 收益率（展示单位百分比）；null → 按零收益计算。 */
  epochRebasePct: number | null
  /** 链上 X 挖矿日利率（%）；缺 → 挖矿零收益。 */
  xmineDailyPct?: number | null
  /** 每日 epoch 数（链上推算）；缺 → 零利息。 */
  epochsPerDay?: number | null
}): CalcEstimateResult {
  const principal = Number.parseFloat(args.amount.replace(/,/g, '')) || 0
  const priceN = Number.parseFloat(args.price.replace(/,/g, '')) || 0
  const days = Math.min(Math.max(1, Math.round(args.days)), CALC_MAX_DAYS)
  const epochsPerDay = args.epochsPerDay ?? null
  const dayArgs = {
    product: args.product,
    period: args.period,
    amount: principal,
    pd: priceN,
    epochRebasePct: args.epochRebasePct,
    epochsPerDay,
    xmineDailyPct: args.product === 'xmine' ? (args.xmineDailyPct ?? null) : null,
    horizonDays: days,
  }
  const snap = computeCalcDay({ ...dayArgs, days })
  const lock = calcLockDays(args.period)
  const fullReleaseDay = lock ?? 1
  const holdDay = lock ?? CALC_MAX_DAYS
  const hold = computeCalcDay({ ...dayArgs, days: holdDay })
  const breakEvenDay = findBreakEvenDay({ ...dayArgs, maxDays: CALC_MAX_DAYS })
  return {
    product: args.product,
    period: args.period,
    days,
    principal,
    price: priceN,
    interestUsd: snap.rewardsUsd,
    releasedUsd: snap.releasedUsd,
    investedUsd: snap.costUsd,
    sellUsd: snap.sellUsd,
    profitUsd: snap.profitUsd,
    ratePct: snap.ratePct,
    breakEvenDay,
    fullReleaseDay,
    holdDay,
    holdProfitUsd: hold.profitUsd,
    holdRatePct: hold.ratePct,
    epochRebasePct: args.epochRebasePct,
    xmineDailyPct: args.product === 'xmine' ? (args.xmineDailyPct ?? null) : null,
    epochsPerDay,
  }
}
