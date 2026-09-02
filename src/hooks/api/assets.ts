import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import {
  getAssetsHoldingsDistribution,
  getAssetsHoldingsSummary,
  getAssetsProductInvestReward,
  getAssetsRewardSummary,
} from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'

/** 资产 Hub 的数据按持仓分布、汇总、奖励概览与产品收益投资组织，全部依赖登录态。 */

/**
 * 查询当前用户持仓分布。
 *
 * @param enabled false 时暂停请求
 */
export function useAssetsHoldingsDistribution(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.assetsHoldingsDistribution,
    getAssetsHoldingsDistribution,
    enabled,
  )
}

/**
 * 查询当前用户持仓汇总。
 *
 * @param enabled false 时暂停请求
 */
export function useAssetsHoldingsSummary(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.assetsHoldingsSummary,
    getAssetsHoldingsSummary,
    enabled,
  )
}

/**
 * 查询当前用户奖励概览。
 *
 * @param enabled false 时暂停请求
 */
export function useAssetsRewardSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.assetsRewardSummary, getAssetsRewardSummary, enabled)
}

/**
 * 查询各产品已领取收益与实际投资。
 *
 * @param enabled false 时暂停请求
 */
export function useAssetsProductInvestReward(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.assetsProductInvestReward,
    getAssetsProductInvestReward,
    enabled,
  )
}
