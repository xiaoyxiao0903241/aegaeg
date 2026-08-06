import { apiRequest } from '~/shared/api/request'
import type {
  AssetsHoldingsDistribution,
  AssetsHoldingsSummary,
  AssetsRewardSummary,
} from '~/shared/api/types'

/** 集中封装资产 Hub 的持仓分布、持仓汇总与奖励概览端点。 */

export async function getAssetsHoldingsDistribution(
  token: string,
): Promise<AssetsHoldingsDistribution> {
  return apiRequest<AssetsHoldingsDistribution>('/assets/holdings-distribution', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getAssetsHoldingsSummary(token: string): Promise<AssetsHoldingsSummary> {
  return apiRequest<AssetsHoldingsSummary>('/assets/holdings-summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getAssetsRewardSummary(token: string): Promise<AssetsRewardSummary> {
  return apiRequest<AssetsRewardSummary>('/assets/reward-summary', {
    method: 'POST',
    token,
    body: {},
  })
}
