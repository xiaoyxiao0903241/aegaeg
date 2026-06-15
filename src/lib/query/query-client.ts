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

export const QUERY_STALE_TIME = {
  api: FIVE_MINUTES,
  presale: 30_000,
  balances: 30_000,
  quote: 10_000,
} as const
