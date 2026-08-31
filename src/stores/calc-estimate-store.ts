import { create } from 'zustand'

import {
  buildCalcEstimate,
  type CalcEstimateResult,
  type CalcProduct,
} from '~/core/staking/build-calc-estimate'
import type { StakePeriod } from '~/core/staking/staking-period'
import { CALC_DEFAULT_DAYS, CALC_MAX_DAYS, CALC_X_START_USD } from '~/core/staking/staking-yield'

type LiveRates = {
  epochRebasePct: number | null
  xmineDailyPct: number | null
  epochsPerDay: number | null
  /** 链上债券成交价率 BPS；非债券为 null。 */
  discountRateBP: number | null
}

type CalcEstimateStore = {
  product: CalcProduct
  period: StakePeriod
  amount: string
  price: string
  /** AGX 投入现价；未灌入或失效时为 null。 */
  spotUsd: number | null
  days: number
  /** 最近一次链上利率；点「计算」时写入快照。 */
  rates: LiveRates | null
  result: CalcEstimateResult | null
  setProduct: (product: CalcProduct) => void
  setPeriod: (period: StakePeriod) => void
  setAmount: (amount: string) => void
  setPrice: (price: string) => void
  setSpotUsd: (spotUsd: number | null) => void
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
  spotUsd: number | null
  days: number
  rates: LiveRates | null
}): CalcEstimateResult {
  const rates = s.rates
  return buildCalcEstimate({
    product: s.product,
    period: s.period,
    amount: s.amount,
    price: s.price,
    spotUsd: s.spotUsd ?? 0,
    days: s.days,
    epochRebasePct: rates?.epochRebasePct ?? null,
    xmineDailyPct: s.product === 'xmine' ? (rates?.xmineDailyPct ?? null) : null,
    epochsPerDay: rates?.epochsPerDay ?? null,
    discountRateBP:
      s.product === 'lpbond' || s.product === 'burnbond' ? (rates?.discountRateBP ?? null) : null,
  })
}

function ratesReady(product: CalcProduct, rates: LiveRates | null): boolean {
  if (rates == null) return false
  if (product === 'xmine') {
    return rates.xmineDailyPct != null && Number.isFinite(rates.xmineDailyPct)
  }
  const rebaseOk =
    rates.epochRebasePct != null &&
    Number.isFinite(rates.epochRebasePct) &&
    rates.epochsPerDay != null &&
    rates.epochsPerDay > 0
  if (!rebaseOk) return false
  if (product === 'lpbond' || product === 'burnbond') {
    return (
      rates.discountRateBP != null &&
      Number.isFinite(rates.discountRateBP) &&
      rates.discountRateBP > 0
    )
  }
  return true
}

function formReady(s: {
  product: CalcProduct
  amount: string
  price: string
  spotUsd: number | null
  rates: LiveRates | null
}): boolean {
  const amountN = Number.parseFloat(s.amount.replace(/,/g, '')) || 0
  const priceN = Number.parseFloat(s.price.replace(/,/g, '')) || 0
  const spotOk = s.spotUsd != null && Number.isFinite(s.spotUsd) && s.spotUsd > 0
  return amountN > 0 && priceN > 0 && spotOk && ratesReady(s.product, s.rates)
}

/**
 * 计算器表单 + 右侧估算结果；左右栏共享，不涉及链上写。
 * UI 直订本 store（字段同名），禁止再包 rename 层。
 */
export const useCalcEstimateStore = create<CalcEstimateStore>((set, get) => ({
  product: 'stake',
  period: 'liquid',
  amount: '1',
  /** AGX 产品空着等现价灌入；挖矿用算法起点价。 */
  price: '',
  spotUsd: null,
  days: CALC_DEFAULT_DAYS,
  rates: null,
  result: null,
  setProduct: (product) => {
    const xmine = product === 'xmine'
    set({
      product,
      period: defaultPeriodFor(product),
      price: xmine ? String(CALC_X_START_USD) : '',
    })
  },
  setPeriod: (period) => set({ period }),
  setAmount: (amount) => set({ amount }),
  setPrice: (price) => {
    const s = get()
    const next = { ...s, price }
    if (s.result == null && formReady(next)) {
      set({ price, result: snapshotFrom(next) })
      return
    }
    set({ price })
  },
  setSpotUsd: (spotUsd) => {
    const s = get()
    const next = { ...s, spotUsd }
    if (s.result == null && formReady(next)) {
      set({ spotUsd, result: snapshotFrom(next) })
      return
    }
    set({ spotUsd })
  },
  setDays: (days) => set({ days: Math.min(CALC_MAX_DAYS, Math.max(1, Math.round(days))) }),
  liveSync: (rates) => {
    const s = get()
    const next = { ...s, rates }
    if (s.result == null && formReady(next)) {
      set({ rates, result: snapshotFrom(next) })
      return
    }
    set({ rates })
  },
  commit: () => {
    const s = get()
    if (!formReady(s)) return
    set({ result: snapshotFrom(s) })
  },
}))
