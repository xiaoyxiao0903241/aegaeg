import {
  getPerformance,
  getReferralTotal,
  getRewardLogs,
  getSalesLogs,
  getTeamReferrals,
  getTeamRewardTotal,
} from '../lib/api/endpoints'
import type { PaginationParams } from '../lib/api/types'
import { queryKeys } from '../lib/query/query-keys'
import { useAuthenticatedQuery } from './use-authenticated-query'

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
  )
}

export function useRewardLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.rewardLogs({ page, page_size: pageSize }),
    (token) => getRewardLogs(token, { page, page_size: pageSize }),
    enabled,
  )
}

export function useReferralTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.referralTotal, getReferralTotal, enabled)
}

export function useTeamRewardTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.teamRewardTotal, getTeamRewardTotal, enabled)
}

export function useTeamReferrals(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.teamReferrals({ page, page_size: pageSize }),
    (token) => getTeamReferrals(token, { page, page_size: pageSize }),
    enabled,
  )
}
