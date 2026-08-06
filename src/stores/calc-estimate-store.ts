import { create } from 'zustand'

export type CalcProduct = 'stake' | 'lpbond' | 'burnbond' | 'xmine'

export type CalcEstimateResult = {
  product: CalcProduct
  period: string
  days: number
  /** 估算使用的本金金额。 */
  principal: number
  /** 假设的 USD 单价。 */
  price: number
  interestTokens: number
  totalTokens: number
  /** 净收益价值（收益总额）。 */
  interestUsd: number
  /** 本金 × 单价（总投入 / 液态已释放本金价值）。 */
  investedUsd: number
  /** 投入 + 收益（卖出总值）。 */
  sellUsd: number
  ratePct: number
  /** 该快照使用的周期 rebase 百分比（null 表示零收益）。 */
  epochRebasePct: number | null
  /** xmine 日收益率（%）；非 xmine 为 null。 */
  xmineDailyPct: number | null
}

interface CalcEstimateStore {
  result: CalcEstimateResult | null
  setResult: (result: CalcEstimateResult | null) => void
}

/** 计算器部件与侧栏共享的本地状态，不涉及链上读写。 */
export const useCalcEstimateStore = create<CalcEstimateStore>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
}))
