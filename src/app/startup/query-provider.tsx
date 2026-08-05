import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { queryClient } from '~/shared/api/query/query-client'

/** 提供全局唯一的 React Query 客户端。 */
export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
