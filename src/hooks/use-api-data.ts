import { useMemo } from 'react'
import {
  getPerformance,
  getReferralTotal,
  getRewardLogs,
  getSalesLogs,
  getTeamReferrals,
  getTeamRewardTotal,
} from '../lib/api/endpoints'
import type { PaginationParams } from '../lib/api/types'
import { useApiQuery } from './use-api-query'
import { useAuth } from '../providers/auth-provider'

export function usePerformance(enabled = true) {
  const { isAuthenticated } = useAuth()

  return useApiQuery(
    useMemo(() => (token) => getPerformance(token), []),
    enabled && isAuthenticated,
  )
}

export function useSalesLogs(params: PaginationParams = {}, enabled = true) {
  const { isAuthenticated } = useAuth()
  const page = params.page
  const pageSize = params.page_size

  return useApiQuery(
    useMemo(
      () => (token) => getSalesLogs(token, { page, page_size: pageSize }),
      [page, pageSize],
    ),
    enabled && isAuthenticated,
  )
}

export function useRewardLogs(params: PaginationParams = {}, enabled = true) {
  const { isAuthenticated } = useAuth()
  const page = params.page
  const pageSize = params.page_size

  return useApiQuery(
    useMemo(
      () => (token) => getRewardLogs(token, { page, page_size: pageSize }),
      [page, pageSize],
    ),
    enabled && isAuthenticated,
  )
}

export function useReferralTotal(enabled = true) {
  const { isAuthenticated } = useAuth()

  return useApiQuery(
    useMemo(() => (token) => getReferralTotal(token), []),
    enabled && isAuthenticated,
  )
}

export function useTeamRewardTotal(enabled = true) {
  const { isAuthenticated } = useAuth()

  return useApiQuery(
    useMemo(() => (token) => getTeamRewardTotal(token), []),
    enabled && isAuthenticated,
  )
}

export function useTeamReferrals(params: PaginationParams = {}, enabled = true) {
  const { isAuthenticated } = useAuth()
  const page = params.page
  const pageSize = params.page_size

  return useApiQuery(
    useMemo(
      () => (token) => getTeamReferrals(token, { page, page_size: pageSize }),
      [page, pageSize],
    ),
    enabled && isAuthenticated,
  )
}
