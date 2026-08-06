import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import {
  getBufferPoolLogs,
  getBufferPoolSummary,
  getReleasePoolLogs,
  getReleasePoolSummary,
} from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { BufferPoolLogsParams, ReleasePoolLogsParams } from '~/shared/api/types'

export function useBufferPoolSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.bufferPoolSummary, getBufferPoolSummary, enabled)
}

export function useBufferPoolLogs(params: BufferPoolLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bufferPoolLogs(params),
    (token) => getBufferPoolLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

export function useReleasePoolSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.releasePoolSummary, getReleasePoolSummary, enabled)
}

export function useReleasePoolLogs(params: ReleasePoolLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.releasePoolLogs(params),
    (token) => getReleasePoolLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}
