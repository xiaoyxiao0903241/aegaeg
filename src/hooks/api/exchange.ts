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

/** AGX 贡献与 Turbine 的汇总、日志都封装成带登录态的分页 hooks。 */

/**
 * 查询 AGX 贡献销毁汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useAgxContributionSummary(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.agxContributionSummary,
    getAgxContributionSummary,
    enabled,
  )
}

/**
 * 分页查询 AGX 贡献销毁记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 分页查询 AGX 贡献消耗记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 查询 Turbine 涡轮汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useTurbineSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.turbineSummary, getTurbineSummary, enabled)
}

/**
 * 分页查询 Turbine 流水，支持按涡轮类型过滤。
 *
 * @param params 分页与过滤参数
 * @param enabled false 时暂停请求
 */
export function useTurbineLogs(params: TurbineLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.turbineLogs(params),
    (token) => getTurbineLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}
