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
} from '~/lib/api/endpoints'
import type { PaginationParams } from '~/lib/api/types'
import { queryKeys } from '~/lib/query/query-keys'
import { useAuthenticatedQuery } from '~/hooks/use-authenticated-query'

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
