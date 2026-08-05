import { QueryClient } from '@tanstack/react-query'

const FIVE_MINUTES = 5 * 60 * 1000
const THIRTY_MINUTES = 30 * 60 * 1000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES,
      gcTime: THIRTY_MINUTES,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
})

/**
 * 按新鲜度档位（S/U/Q/L）映射 staleTime：
 * - S（近乎静态）→ `api` / `static`（不可变池元数据为 Infinity）
 * - U（用户余额/持仓）→ `balances` / `presale` 30s
 * - Q（报价）→ `quote` 10s
 * - L（提交时实时校验）→ staleTime 0 / 直接读取——不在此列出，绝不通过 useChainQuery
 */
export const QUERY_STALE_TIME = {
  api: FIVE_MINUTES,
  /** 链上不可变元数据（pair token0/token1 等）。 */
  static: Number.POSITIVE_INFINITY,
  presale: 30_000,
  balances: 30_000,
  quote: 10_000,
} as const
