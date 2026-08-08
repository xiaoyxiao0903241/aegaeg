import { create } from 'zustand'

import type { AssetsSortKey } from '~/views/dapp/assets/primitives'

export type AssetsProduct = 'stake' | 'lpbond' | 'burnbond'

/**
 * 仓位产品侧栏会话（报价 / 排序 / 分页）。
 * 领奖 / 赎回弹层留在 dock 内 `useState`；换产品 / 钱包由 `AssetsDockBody` key remount。
 * `syncProduct` 在写入口内归页（store 跨 remount 仍存活）。
 */
export const usePositionSessionStore = create<{
  product: AssetsProduct
  quote: 'agx' | 'usd'
  sort: AssetsSortKey
  page: number
  opsPage: number
  syncProduct: (product: AssetsProduct) => void
  setQuote: (quote: 'agx' | 'usd') => void
  setSort: (sort: AssetsSortKey) => void
  setPage: (page: number) => void
  setOpsPage: (page: number) => void
}>((set, get) => ({
  product: 'stake',
  quote: 'agx',
  sort: 'startNear',
  page: 0,
  opsPage: 1,
  syncProduct: (product) => {
    if (get().product === product) return
    set({ product, page: 0, opsPage: 1 })
  },
  setQuote: (quote) => set({ quote }),
  setSort: (sort) => set({ sort }),
  setPage: (page) => set({ page }),
  setOpsPage: (page) => set({ opsPage: page }),
}))

/** X 挖矿侧栏会话（报价 / 排序）。退出确认弹窗留在 dock 内 `useState`。 */
export const useXmineSessionStore = create<{
  quote: 'agx' | 'usd'
  sort: AssetsSortKey
  setQuote: (quote: 'agx' | 'usd') => void
  setSort: (sort: AssetsSortKey) => void
}>((set) => ({
  quote: 'agx',
  sort: 'startNear',
  setQuote: (quote) => set({ quote }),
  setSort: (sort) => set({ sort }),
}))
