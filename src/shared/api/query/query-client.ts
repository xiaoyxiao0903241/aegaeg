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
 * Maps Spec freshness tiers (S/U/Q/L):
 * - S (quasi-static) → `api` / default 5m (pool metadata may use Infinity)
 * - U (user balances/positions) → `balances` / `presale` 30s
 * - Q (quotes) → `quote` 10s
 * - L (submit live) → staleTime 0 / direct read — not listed here
 */
export const QUERY_STALE_TIME = {
  api: FIVE_MINUTES,
  presale: 30_000,
  balances: 30_000,
  quote: 10_000,
} as const
