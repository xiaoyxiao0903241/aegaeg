import { create } from 'zustand'

import {
  buildCalcEstimate,
  type CalcEstimateResult,
  type CalcProduct,
} from '~/core/staking/build-calc-estimate'
import type { StakePeriod } from '~/core/staking/staking-period'
import { CALC_DEFAULT_DAYS, CALC_MAX_DAYS } from '~/core/staking/staking-yield'

type LiveRates = {
  epochRebasePct: number | null
  epochsPerDay: number | null
  /** 链上债券成交价率 BPS；非债券为 null。 */
  discountRateBP?: number | null
  /** 链上挖矿日利率 BPS；非挖矿可缺。 */
  yieldRateBP?: number | null
}

type CalcEstimateStore = {
  product: CalcProduct
  period: StakePeriod
  amount: string
  price: string
  /** 到期 X 价草稿；仅 X 挖矿使用。 */
  priceX: string
  /** AGX 投入现价；未灌入或失效时为 null。 */
  spotUsd: number | null
  /** X 现价；仅 X 挖矿使用，未灌入或失效时为 null。 */
  spotXUsd: number | null
  days: number
  /** 最近一次链上利率；点「计算」时写入快照。 */
  rates: LiveRates | null
  result: CalcEstimateResult | null
  setProduct: (product: CalcProduct) => void
  setPeriod: (period: StakePeriod) => void
  setAmount: (amount: string) => void
  setPrice: (price: string) => void
  setPriceX: (priceX: string) => void
  setSpotUsd: (spotUsd: number | null) => void
  setSpotXUsd: (spotXUsd: number | null) => void
  setDays: (days: number) => void
  /**
   * 灌链上利率。利率就绪且尚无结果、或当前快照已不是这个产品/周期时写入右侧；
   * 同一产品周期的后续利率跳动不改快照，改天数 / 数量 / 价格仍要点「计算」。
   */
  liveSync: (rates: LiveRates) => void
  /**
   * 用当前表单与最近一次链上利率生成右侧快照。
   *
   * 「计算」按钮调用；产品 / 周期切换也会走同一条路径。
   * 利率未就绪或表单非法时不写。
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
  priceX: string
  spotUsd: number | null
  spotXUsd: number | null
  days: number
  rates: LiveRates | null
}): CalcEstimateResult {
  const rates = s.rates
  const isXmine = s.product === 'xmine'
  return buildCalcEstimate({
    product: s.product,
    period: s.period,
    amount: s.amount,
    price: s.price,
    priceX: isXmine ? s.priceX : undefined,
    spotUsd: s.spotUsd ?? 0,
    spotXUsd: isXmine ? s.spotXUsd : null,
    days: s.days,
    epochRebasePct: rates?.epochRebasePct ?? null,
    epochsPerDay: rates?.epochsPerDay ?? null,
    discountRateBP:
      s.product === 'lpbond' || s.product === 'burnbond' ? (rates?.discountRateBP ?? null) : null,
    yieldRateBP: isXmine ? (rates?.yieldRateBP ?? null) : null,
  })
}

function ratesReady(product: CalcProduct, rates: LiveRates | null): boolean {
  if (rates == null) return false
  if (product === 'xmine') {
    return rates.yieldRateBP != null && Number.isFinite(rates.yieldRateBP) && rates.yieldRateBP >= 0
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
  priceX: string
  spotUsd: number | null
  spotXUsd: number | null
  rates: LiveRates | null
}): boolean {
  const amountN = Number.parseFloat(s.amount.replace(/,/g, '')) || 0
  const priceN = Number.parseFloat(s.price.replace(/,/g, '')) || 0
  const priceXN = Number.parseFloat(s.priceX.replace(/,/g, '')) || 0
  const spotOk = s.spotUsd != null && Number.isFinite(s.spotUsd) && s.spotUsd > 0
  if (s.product === 'xmine') {
    const spotXOk = s.spotXUsd != null && Number.isFinite(s.spotXUsd) && s.spotXUsd > 0
    if (!(priceXN > 0) || !spotXOk) return false
  }
  return amountN > 0 && priceN > 0 && spotOk && ratesReady(s.product, s.rates)
}

function snapshotIfReady(s: {
  product: CalcProduct
  period: StakePeriod
  amount: string
  price: string
  priceX: string
  spotUsd: number | null
  spotXUsd: number | null
  days: number
  rates: LiveRates | null
}): CalcEstimateResult | null {
  return formReady(s) ? snapshotFrom(s) : null
}

/** 债券成交价跟档位走；切产品 / 周期后旧 BPS 不能继续用。 */
function ratesForProduct(product: CalcProduct, rates: LiveRates | null): LiveRates | null {
  if (rates == null) return null
  if (product === 'lpbond' || product === 'burnbond') {
    return { ...rates, discountRateBP: null }
  }
  return rates
}

function draftAgxPrice(spotUsd: number | null): string {
  if (spotUsd == null || !(spotUsd > 0) || !Number.isFinite(spotUsd)) return ''
  return String(Number(spotUsd.toFixed(2)))
}

function resultStaleForForm(
  result: CalcEstimateResult | null,
  product: CalcProduct,
  period: StakePeriod,
): boolean {
  return result == null || result.product !== product || result.period !== period
}

/**
 * 计算器表单 + 右侧估算结果；左右栏共享，不涉及链上写。
 * UI 直订本 store（字段同名），禁止再包 rename 层。
 */
export const useCalcEstimateStore = create<CalcEstimateStore>((set, get) => ({
  product: 'stake',
  period: 'liquid',
  amount: '1',
  /** AGX 产品空着等现价灌入。 */
  price: '',
  priceX: '',
  spotUsd: null,
  spotXUsd: null,
  days: CALC_DEFAULT_DAYS,
  rates: null,
  result: null,
  setProduct: (product) => {
    const s = get()
    if (s.product === product) {
      const result = snapshotIfReady(s)
      if (result) set({ result })
      return
    }
    const period = defaultPeriodFor(product)
    const price = draftAgxPrice(s.spotUsd)
    const rates = ratesForProduct(product, s.rates)
    const next = { ...s, product, period, price, rates }
    // 新档利率未到时留下次快照，右栏不闪回骨架
    set({ product, period, price, rates, result: snapshotIfReady(next) ?? s.result })
  },
  setPeriod: (period) => {
    const s = get()
    if (s.period === period) {
      const result = snapshotIfReady(s)
      if (result) set({ result })
      return
    }
    const rates = ratesForProduct(s.product, s.rates)
    const next = { ...s, period, rates }
    set({ period, rates, result: snapshotIfReady(next) ?? s.result })
  },
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
  setPriceX: (priceX) => {
    const s = get()
    const next = { ...s, priceX }
    if (s.result == null && formReady(next)) {
      set({ priceX, result: snapshotFrom(next) })
      return
    }
    set({ priceX })
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
  setSpotXUsd: (spotXUsd) => {
    const s = get()
    const next = { ...s, spotXUsd }
    if (s.result == null && formReady(next)) {
      set({ spotXUsd, result: snapshotFrom(next) })
      return
    }
    set({ spotXUsd })
  },
  setDays: (days) => set({ days: Math.min(CALC_MAX_DAYS, Math.max(1, Math.round(days))) }),
  liveSync: (rates) => {
    const s = get()
    const next = { ...s, rates }
    if (resultStaleForForm(s.result, s.product, s.period) && formReady(next)) {
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
