import { create } from 'zustand'

import {
  buildCalcEstimate,
  type CalcEstimateResult,
  type CalcProduct,
} from '~/core/staking/build-calc-estimate'
import type { StakePeriod } from '~/core/staking/staking-period'
import { CALC_MAX_DAYS } from '~/core/staking/staking-yield'
import { formatNumber } from '~/shared/presenters/format'

export type { CalcEstimateResult, CalcProduct } from '~/core/staking/build-calc-estimate'

type LiveRates = {
  spotUsd: number | null
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
  /** 是否已用实时行情灌过一次价格（之后不覆盖用户输入）。 */
  priceSeeded: boolean
  result: CalcEstimateResult | null
  setProduct: (product: CalcProduct) => void
  setPeriod: (period: StakePeriod) => void
  setAmount: (amount: string) => void
  setPrice: (price: string) => void
  setDays: (days: number) => void
  /**
   * 灌首次行情价（仅一次）并按当前表单重算右侧结果。
   * 输入 / 链上利率就绪后由 `useCalcEstimateLive` 调用。
   */
  liveSync: (rates: LiveRates) => void
}

function defaultPeriodFor(product: CalcProduct): StakePeriod {
  return product === 'stake' || product === 'xmine' ? 'liquid' : '180'
}

/**
 * 计算器表单 + 右侧估算结果；左右栏共享，不涉及链上写。
 * UI 直订本 store（字段同名），禁止再包 rename 层。
 */
export const useCalcEstimateStore = create<CalcEstimateStore>((set, get) => ({
  product: 'stake',
  period: 'liquid',
  amount: '1',
  price: '0',
  days: 100,
  priceSeeded: false,
  result: null,
  setProduct: (product) => set({ product, period: defaultPeriodFor(product) }),
  setPeriod: (period) => set({ period }),
  setAmount: (amount) => set({ amount }),
  setPrice: (price) => set({ price }),
  setDays: (days) => set({ days: Math.min(CALC_MAX_DAYS, Math.max(1, days)) }),
  liveSync: (rates) => {
    const s = get()
    const priceSeeded = s.priceSeeded || rates.spotUsd != null
    const price =
      !s.priceSeeded && rates.spotUsd != null
        ? formatNumber(rates.spotUsd, { digits: 2 }).replace(/,/g, '')
        : s.price
    set({
      price,
      priceSeeded,
      result: buildCalcEstimate({
        product: s.product,
        period: s.period,
        amount: s.amount,
        price,
        days: s.days,
        epochRebasePct: rates.epochRebasePct,
        xmineDailyPct: s.product === 'xmine' ? rates.xmineDailyPct : null,
        epochsPerDay: rates.epochsPerDay,
      }),
    })
  },
}))
