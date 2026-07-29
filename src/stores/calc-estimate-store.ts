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
  interestUsd: number
  totalUsd: number
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
