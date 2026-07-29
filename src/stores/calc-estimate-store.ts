import { create } from 'zustand'

export type CalcProduct = 'stake' | 'lpbond' | 'burnbond' | 'xmine'

export type CalcEstimateResult = {
  product: CalcProduct
  period: string
  days: number
  /** Token principal used in the estimate. */
  principal: number
  /** USD price assumption. */
  price: number
  interestTokens: number
  totalTokens: number
  /** Net yield value (收益总额). */
  interestUsd: number
  /** Principal × price (总投入 / 已释放本金价值 for liquid). */
  investedUsd: number
  /** Invested + interest (卖出总值). */
  sellUsd: number
  ratePct: number
}

interface CalcEstimateStore {
  result: CalcEstimateResult | null
  setResult: (result: CalcEstimateResult | null) => void
}

/** Local calc widget ↔ aside — no chain I/O. */
export const useCalcEstimateStore = create<CalcEstimateStore>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
}))
