import { apiRequest } from '~/shared/api/request'
import type {
  AssetsHoldingsDistribution,
  AssetsHoldingsSummary,
  AssetsProductInvestReward,
  AssetsRewardSummary,
} from '~/shared/api/types'

/** 集中封装资产 Hub 的持仓分布、持仓汇总、奖励概览与产品收益投资端点。 */

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

/** 各产品已领取收益与实际投资（债券投资为 AGX payout，不算折扣）。 */
export async function getAssetsProductInvestReward(
  token: string,
): Promise<AssetsProductInvestReward> {
  return apiRequest<AssetsProductInvestReward>('/assets/product-invest-reward', {
    method: 'POST',
    token,
    body: {},
  })
}
