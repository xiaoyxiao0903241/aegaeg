import { useQuery, type QueryKey } from '@tanstack/react-query'
import {
  getCommunityFundTotal,
  getPerformance,
  getSalesLogs,
  getTeamOverview,
  getTeamReferrals,
  getTeamRewardTotal,
} from '~/shared/api/endpoints'
import type { PaginationParams } from '~/shared/api/types'
import {
  requestWithSession,
  toQueryErrorMessage,
  canRunAuthenticatedQuery,
} from '~/shared/api/query/session-request'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useAuth } from '~/hooks/use-auth'
import { useI18n } from '~/i18n/use-i18n'
import { useAuthStore } from '~/stores/auth-store'
import { normalizeAuthAddress } from '~/core/auth/types'

function useAuthenticatedQuery<T>(
  queryKey: QueryKey,
  fetcher: (token: string) => Promise<T>,
  enabled = true,
  options?: { keepPreviousData?: boolean },
) {
  const { token, invalidateSession, sessionReady, hasHydrated, session } = useAuth()
  const { messages: t } = useI18n()
  // Address-scoped key: JWT renew keeps cache; wallet switch isolates accounts.
  const scopeKey = session?.address ? normalizeAuthAddress(session.address) : undefined

  const query = useQuery({
    queryKey: scopeKey ? [...queryKey, scopeKey] : queryKey,
    queryFn: () => {
      // Prefer store token so silent renew updates mid-flight refetch without waiting for re-render.
      const latestToken = scopeKey
        ? (useAuthStore.getState().sessionsByAddress[scopeKey]?.token ?? token)
        : token
      if (!latestToken) {
        throw new Error('Authenticated query ran without a session token')
      }
      return requestWithSession(fetcher, latestToken, invalidateSession)
    },
    enabled: canRunAuthenticatedQuery({
      enabled,
      hasHydrated,
      sessionReady,
      hasToken: Boolean(token),
    }),
    staleTime: QUERY_STALE_TIME.api,
    placeholderData: options?.keepPreviousData
      ? (previousData, previousQuery) => {
          if (previousData == null || !scopeKey) return undefined
          if (previousQuery == null) return undefined
          const previousScope = previousQuery.queryKey.at(-1)
          if (previousScope !== scopeKey) return undefined
          return previousData
        }
      : undefined,
  })

  return {
    data: query.data ?? null,
    error: toQueryErrorMessage(query.error, t.errors.api),
    isLoading: query.isLoading,
    refresh: async () => {
      await query.refetch()
    },
  }
}

export function usePerformance(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.performance, getPerformance, enabled)
}

export function useSalesLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.salesLogs({ page, page_size: pageSize }),
    (token) => getSalesLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useTeamRewardTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.teamRewardTotal, getTeamRewardTotal, enabled)
}

export function useCommunityFundTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.communityFundTotal, getCommunityFundTotal, enabled)
}

export function useTeamReferrals(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.teamReferrals({ page, page_size: pageSize }),
    (token) => getTeamReferrals(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useTeamOverview(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.teamOverview, getTeamOverview, enabled)
}
