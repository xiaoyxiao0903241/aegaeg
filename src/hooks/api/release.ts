import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import {
  getBufferPoolLogs,
  getBufferPoolSummary,
  getReleasePoolLogs,
  getReleasePoolSummary,
} from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { BufferPoolLogsParams, ReleasePoolLogsParams } from '~/shared/api/types'

/** 本金释放页的缓冲池、释放池查询共用登录态封装；分页参数走 hooks 参数。 */

/**
 * 查询缓冲池汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useBufferPoolSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.bufferPoolSummary, getBufferPoolSummary, enabled)
}

/**
 * 分页查询缓冲池流水，支持按事件类型过滤。
 *
 * @param params 分页与过滤参数
 * @param enabled false 时暂停请求
 */
export function useBufferPoolLogs(params: BufferPoolLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bufferPoolLogs(params),
    (token) => getBufferPoolLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 查询释放池汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useReleasePoolSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.releasePoolSummary, getReleasePoolSummary, enabled)
}

/**
 * 分页查询释放池流水，支持按事件类型过滤。
 *
 * @param params 分页与过滤参数
 * @param enabled false 时暂停请求
 */
export function useReleasePoolLogs(params: ReleasePoolLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.releasePoolLogs(params),
    (token) => getReleasePoolLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}
