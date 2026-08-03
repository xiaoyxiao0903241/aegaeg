import { CALC_MAX_DAYS, calcLocalInterest } from '~/core/staking/staking-yield-display'
import type { CalcEstimateResult, CalcProduct } from '~/stores/calc-estimate-store'

/** Locked periods use tenure; liquid/unknown use the slider day count (capped at CALC_MAX_DAYS). */
export function periodEndDays(period: string, sliderDays: number): number {
  if (period === '180') return 180
  if (period === '360') return 360
  if (period === '540') return 540
  return Math.min(Math.max(1, sliderDays), CALC_MAX_DAYS)
}

/** Local estimate snapshot for calc left↔right sync — zero chain I/O. */
export function buildCalcEstimate(args: {
  product: CalcProduct
  period: string
  amount: string
  price: string
  days: number
  /** Live epoch rebase % (display units); null → honest zero yield. */
  epochRebasePct: number | null
}): CalcEstimateResult {
  const principal = Number.parseFloat(args.amount.replace(/,/g, '')) || 0
  const priceN = Number.parseFloat(args.price.replace(/,/g, '')) || 0
  const days = Math.min(Math.max(1, Math.round(args.days)), CALC_MAX_DAYS)
  const estimate = calcLocalInterest({
    product: args.product,
    period: args.period,
    principal,
    days,
    epochRebasePct: args.epochRebasePct,
  })
  const isBondUsd1 = args.product === 'lpbond' || args.product === 'burnbond'
  // 债券本金已是 USD1（USD）；质押本金为 AGX，须 × 现价。
  const investedUsd = isBondUsd1 ? principal : principal * priceN
  const interestUsd = estimate.interest * priceN
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
  }
}
