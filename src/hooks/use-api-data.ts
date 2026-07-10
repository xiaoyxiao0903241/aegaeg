import { useQuery, type QueryKey } from '@tanstack/react-query'
import {
  getCommunityFundLogs,
  getCommunityFundTotal,
  getPerformance,
  getQualifiedPartitions,
  getReferralTotal,
  getRewardLogs,
  getSalesLogs,
  getTeamOverview,
  getTeamReferrals,
  getTeamRewardClaimLogs,
  getTeamRewardTotal,
} from '~/shared/api/endpoints'
import type { PaginationParams } from '~/shared/api/types'
import { requestWithSession, toQueryErrorMessage } from '~/shared/api/query/session-request'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useAuth } from '~/app/bootstrap/use-auth'
import { useI18n } from '~/i18n/use-i18n'

function useAuthenticatedQuery<T>(
  queryKey: QueryKey,
  fetcher: (token: string) => Promise<T>,
  enabled = true,
  options?: { keepPreviousData?: boolean },
) {
  const { token, invalidateSession, sessionReady, hasHydrated } = useAuth()
  const { messages: t } = useI18n()

  const query = useQuery({
    // 用 JWT 作用域 key：切钱包换 token 时自动拉新数据，避免跨账户脏缓存。
    queryKey: token ? [...queryKey, token] : queryKey,
    queryFn: () => requestWithSession(fetcher, token!, invalidateSession),
    enabled: enabled && hasHydrated && sessionReady && Boolean(token),
    staleTime: QUERY_STALE_TIME.api,
    placeholderData: options?.keepPreviousData
      ? (previousData) => previousData
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

export function useQualifiedPartitions(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.qualifiedPartitions,
    getQualifiedPartitions,
    enabled,
  )
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

export function useRewardLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.rewardLogs({ page, page_size: pageSize }),
    (token) => getRewardLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useReferralTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.referralTotal, getReferralTotal, enabled)
}

export function useTeamRewardTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.teamRewardTotal, getTeamRewardTotal, enabled)
}

export function useCommunityFundTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.communityFundTotal, getCommunityFundTotal, enabled)
}

export function useCommunityFundLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.communityFundLogs({ page, page_size: pageSize }),
    (token) => getCommunityFundLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useTeamRewardClaimLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.teamRewardClaimLogs({ page, page_size: pageSize }),
    (token) => getTeamRewardClaimLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
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
