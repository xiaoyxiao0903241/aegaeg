import { useQuery, type QueryKey } from '@tanstack/react-query'
import { fetchAuthenticated, toQueryErrorMessage } from '../lib/query/fetch-authenticated'
import { QUERY_STALE_TIME } from '../lib/query/query-client'
import { useAuth } from '../providers/auth-provider'

export function useAuthenticatedQuery<T>(
  queryKey: QueryKey,
  fetcher: (token: string) => Promise<T>,
  enabled = true,
) {
  const { token, invalidateSession, isAuthenticated, hasHydrated } = useAuth()

  const query = useQuery({
    queryKey,
    queryFn: () => fetchAuthenticated(fetcher, token!, invalidateSession),
    enabled: enabled && hasHydrated && isAuthenticated && Boolean(token),
    staleTime: QUERY_STALE_TIME.api,
  })

  return {
    data: query.data ?? null,
    error: toQueryErrorMessage(query.error),
    isLoading: query.isLoading,
    refresh: async () => {
      await query.refetch()
    },
  }
}
