import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import {
  getAgxContributionBurnLogs,
  getAgxContributionConsumeLogs,
  getAgxContributionSummary,
  getTurbineLogs,
  getTurbineSummary,
} from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { PaginationParams, TurbineLogsParams } from '~/shared/api/types'

export function useAgxContributionSummary(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.agxContributionSummary,
    getAgxContributionSummary,
    enabled,
  )
}

export function useAgxContributionBurnLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.agxContributionBurnLogs({ page, page_size: pageSize }),
    (token) => getAgxContributionBurnLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useAgxContributionConsumeLogs(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.agxContributionConsumeLogs({ page, page_size: pageSize }),
    (token) => getAgxContributionConsumeLogs(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useTurbineSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.turbineSummary, getTurbineSummary, enabled)
}

export function useTurbineLogs(params: TurbineLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.turbineLogs(params),
    (token) => getTurbineLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}
