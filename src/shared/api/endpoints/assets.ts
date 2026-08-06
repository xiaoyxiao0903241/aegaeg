import { apiRequest } from '~/shared/api/request'
import type {
  AssetsHoldingsDistribution,
  AssetsHoldingsSummary,
  AssetsRewardSummary,
} from '~/shared/api/types'

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
