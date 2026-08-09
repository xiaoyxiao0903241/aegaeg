import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import {
  getCommunityFundLogs,
  getCommunityFundTotal,
  getMakingOverview,
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
import { queryKeys } from '~/shared/api/query/query-keys'
import type { PaginationParams } from '~/shared/api/types'

/** 社区与业绩数据依赖登录态。 */

/**
 * 查询当前用户做市业绩。
 *
 * @param enabled false 时暂停请求
 */
export function usePerformance(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.performance, getPerformance, enabled)
}

/**
 * 查询满足升级条件的分区数量。
 *
 * @param enabled false 时暂停请求
 */
export function useQualifiedPartitions(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.qualifiedPartitions, getQualifiedPartitions, enabled)
}

/**
 * 查询做市概览汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useMakingOverview(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.makingOverview, getMakingOverview, enabled)
}

/**
 * 分页查询销售记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 分页查询奖励记录，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 查询推荐奖可领汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useReferralTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.referralTotal, getReferralTotal, enabled)
}

/**
 * 查询团队奖励可领汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useTeamRewardTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.teamRewardTotal, getTeamRewardTotal, enabled)
}

/**
 * 查询社区基金可领汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useCommunityFundTotal(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.communityFundTotal, getCommunityFundTotal, enabled)
}

/**
 * 分页查询社区基金流水，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 分页查询团队奖励领取单，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 分页查询直推下级，翻页时保留上一页数据。
 *
 * @param params 分页参数
 * @param enabled false 时暂停请求
 */
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

/**
 * 查询团队概览汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useTeamOverview(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.teamOverview, getTeamOverview, enabled)
}
