import { create } from 'zustand'

import {
  buildCalcEstimate,
  type CalcEstimateResult,
  type CalcProduct,
} from '~/core/staking/build-calc-estimate'
import type { StakePeriod } from '~/core/staking/staking-period'
import {
  CALC_AGX_COST_USD,
  CALC_DEFAULT_DAYS,
  CALC_MAX_DAYS,
  CALC_X_START_USD,
} from '~/core/staking/staking-yield'

export type { CalcEstimateResult, CalcProduct } from '~/core/staking/build-calc-estimate'

type LiveRates = {
  epochRebasePct: number | null
  xmineDailyPct: number | null
  epochsPerDay: number | null
}

type CalcEstimateStore = {
  product: CalcProduct
  period: StakePeriod
  amount: string
  price: string
  days: number
  /** 最近一次链上利率；点「计算」时写入快照。 */
  rates: LiveRates | null
  result: CalcEstimateResult | null
  setProduct: (product: CalcProduct) => void
  setPeriod: (period: StakePeriod) => void
  setAmount: (amount: string) => void
  setPrice: (price: string) => void
  setDays: (days: number) => void
  /**
   * 灌链上利率。利率就绪且尚无结果时提交默认表单快照；之后只由「计算」刷新。
   */
  liveSync: (rates: LiveRates) => void
  /**
   * 用当前表单与最近一次链上利率生成右侧快照。
   *
   * 仅「计算」按钮调用；利率未就绪或表单非法时不写。
   */
  commit: () => void
}

function defaultPeriodFor(product: CalcProduct): StakePeriod {
  return product === 'stake' || product === 'xmine' ? 'liquid' : '180'
}

function snapshotFrom(s: {
  product: CalcProduct
  period: StakePeriod
  amount: string
  price: string
  days: number
  rates: LiveRates | null
}): CalcEstimateResult {
  const rates = s.rates
  return buildCalcEstimate({
    product: s.product,
    period: s.period,
    amount: s.amount,
    price: s.price,
    days: s.days,
    epochRebasePct: rates?.epochRebasePct ?? null,
    xmineDailyPct: s.product === 'xmine' ? (rates?.xmineDailyPct ?? null) : null,
    epochsPerDay: rates?.epochsPerDay ?? null,
  })
}

function ratesReady(product: CalcProduct, rates: LiveRates | null): boolean {
  if (rates == null) return false
  if (product === 'xmine') {
    return rates.xmineDailyPct != null && Number.isFinite(rates.xmineDailyPct)
  }
  return (
    rates.epochRebasePct != null &&
    Number.isFinite(rates.epochRebasePct) &&
    rates.epochsPerDay != null &&
    rates.epochsPerDay > 0
  )
}

/**
 * 计算器表单 + 右侧估算结果；左右栏共享，不涉及链上写。
 * UI 直订本 store（字段同名），禁止再包 rename 层。
 */
export const useCalcEstimateStore = create<CalcEstimateStore>((set, get) => ({
  product: 'stake',
  period: 'liquid',
  amount: '1',
  price: String(CALC_AGX_COST_USD),
  days: CALC_DEFAULT_DAYS,
  rates: null,
  result: null,
  setProduct: (product) => {
    const xmine = product === 'xmine'
    set({
      product,
      period: defaultPeriodFor(product),
      price: xmine ? String(CALC_X_START_USD) : String(CALC_AGX_COST_USD),
    })
  },
  setPeriod: (period) => set({ period }),
  setAmount: (amount) => set({ amount }),
  setPrice: (price) => set({ price }),
  setDays: (days) => set({ days: Math.min(CALC_MAX_DAYS, Math.max(1, days)) }),
  liveSync: (rates) => {
    const s = get()
    const amountN = Number.parseFloat(s.amount.replace(/,/g, '')) || 0
    const priceN = Number.parseFloat(s.price.replace(/,/g, '')) || 0
    const canBuild = amountN > 0 && priceN > 0 && ratesReady(s.product, rates)
    if (canBuild && s.result == null) {
      set({ rates, result: snapshotFrom({ ...s, rates }) })
      return
    }
    set({ rates })
  },
  commit: () => {
    const s = get()
    const amountN = Number.parseFloat(s.amount.replace(/,/g, '')) || 0
    const priceN = Number.parseFloat(s.price.replace(/,/g, '')) || 0
    if (!ratesReady(s.product, s.rates) || !(amountN > 0 && priceN > 0)) return
    set({ result: snapshotFrom(s) })
  },
}))
