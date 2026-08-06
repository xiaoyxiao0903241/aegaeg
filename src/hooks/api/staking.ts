import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import {
  getBondFlowBurnLogs,
  getBondFlowBurnPurchases,
  getBondFlowLpLogs,
  getBondFlowLpPurchases,
  getStakeAddressCount,
  getStakeFlowLogs,
  getStakeFlowPositions,
  getX0MiningLogs,
  getX0MiningPositions,
} from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'
import type {
  BondFlowLogsParams,
  PaginationParams,
  StakeFlowLogsParams,
  X0MiningLogsParams,
} from '~/shared/api/types'

/** 质押、债券与 X 挖矿的指标与流水 hooks 都要求登录态。 */

/**
 * 查询活跃质押地址数。
 *
 * @param enabled false 时暂停请求
 */
export function useStakeAddressCount(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.stakeAddressCount, getStakeAddressCount, enabled)
}

/**
 * 分页查询债券 LP 流水，支持按操作类型过滤。
 *
 * @param params 分页与过滤参数
 * @param enabled false 时暂停请求
 */
export function useBondFlowLpLogs(params: BondFlowLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bondFlowLpLogs(params),
    (token) => getBondFlowLpLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 分页查询债券销毁流水，支持按操作类型过滤。
 *
 * @param params 分页与过滤参数
 * @param enabled false 时暂停请求
 */
export function useBondFlowBurnLogs(params: BondFlowLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bondFlowBurnLogs(params),
    (token) => getBondFlowBurnLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 分页查询债券 LP 购买记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
export function useBondFlowLpPurchases(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.bondFlowLpPurchases({ page, page_size: pageSize }),
    (token) => getBondFlowLpPurchases(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 分页查询债券销毁购买记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
export function useBondFlowBurnPurchases(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.bondFlowBurnPurchases({ page, page_size: pageSize }),
    (token) => getBondFlowBurnPurchases(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 分页查询质押流水，支持按操作类型过滤。
 *
 * @param params 分页与过滤参数
 * @param enabled false 时暂停请求
 */
export function useStakeFlowLogs(params: StakeFlowLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.stakeFlowLogs(params),
    (token) => getStakeFlowLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 分页查询质押持仓，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
export function useStakeFlowPositions(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.stakeFlowPositions({ page, page_size: pageSize }),
    (token) => getStakeFlowPositions(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 分页查询 X 挖矿流水，支持按操作类型过滤。
 *
 * @param params 分页与过滤参数
 * @param enabled false 时暂停请求
 */
export function useX0MiningLogs(params: X0MiningLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.x0MiningLogs(params),
    (token) => getX0MiningLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

/**
 * 分页查询 X 挖矿持仓，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
export function useX0MiningPositions(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.x0MiningPositions({ page, page_size: pageSize }),
    (token) => getX0MiningPositions(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}
