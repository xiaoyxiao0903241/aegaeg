import {
  calcStakingEstimate,
  defaultAprForBondPeriod,
  defaultAprForStakePeriod,
} from '~/core/staking/calc-staking-yield'
import type { BondPeriod, StakePeriod } from '~/core/staking/staking-period'
import type { CalcEstimateResult, CalcProduct } from '~/stores/calc-estimate-store'

const XMINE_APR = 0.1

export function aprForCalcProduct(product: CalcProduct, period: string): number {
  if (product === 'xmine') return XMINE_APR
  if (product === 'stake') return defaultAprForStakePeriod(period as StakePeriod)
  return defaultAprForBondPeriod(period as BondPeriod)
}

/** Locked periods use tenure; liquid/unknown use the slider day count. */
export function periodEndDays(period: string, sliderDays: number): number {
  if (period === '180') return 180
  if (period === '360') return 360
  if (period === '540') return 540
  return sliderDays
}

/** Local estimate snapshot for calc left↔right sync — zero chain I/O. */
export function buildCalcEstimate(args: {
  product: CalcProduct
  period: string
  amount: string
  price: string
  days: number
}): CalcEstimateResult {
  const principal = Number.parseFloat(args.amount.replace(/,/g, '')) || 0
  const priceN = Number.parseFloat(args.price.replace(/,/g, '')) || 0
  const apr = aprForCalcProduct(args.product, args.period)
  const estimate = calcStakingEstimate({ principal, apr, days: args.days })
  const interestUsd = estimate.interest * priceN
  const investedUsd = principal * priceN
  const sellUsd = investedUsd + interestUsd
  const ratePct = investedUsd > 0 ? (interestUsd / investedUsd) * 100 : 0
  return {
    product: args.product,
    period: args.period,
    days: args.days,
    principal,
    price: priceN,
    interestTokens: estimate.interest,
    totalTokens: estimate.total,
    interestUsd,
    investedUsd,
    sellUsd,
    ratePct,
  }
}
