import { useQuery } from '@tanstack/react-query'

import { toApiQueryView, useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import { useI18n } from '~/i18n/use-i18n'
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
  searchPerformance,
} from '~/shared/api/endpoints'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { PaginationParams } from '~/shared/api/types'

/** 社区与业绩数据主要依赖登录态；搜索做市业绩是唯一公开查询。 */

/**
 * 查询当前用户做市业绩。
 *
 * @param enabled false 时暂停请求
 */
export function usePerformance(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.performance, getPerformance, enabled)
}

/**
 * 按地址搜索做市业绩（公开接口，不依赖登录会话）
 *
 * 地址为空时不发起查询，避免无效请求。
 *
 * @param address 待搜索的钱包地址
 * @param enabled 是否允许执行
 * @see docs/backend-api/api.md #一期接口/search-performance
 */

export function useSearchPerformance(address: string | null | undefined, enabled = true) {
  const { messages: t } = useI18n()
  const normalized = address?.trim() ?? ''
  const query = useQuery({
    queryKey: queryKeys.api.searchPerformance(normalized || 'empty'),
    queryFn: () => searchPerformance(normalized),
    enabled: enabled && normalized.length > 0,
    staleTime: QUERY_STALE_TIME.api,
  })

  return toApiQueryView(query, t.errors.api)
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
