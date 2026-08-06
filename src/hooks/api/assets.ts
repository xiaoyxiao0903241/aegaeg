import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import {
  getAssetsHoldingsDistribution,
  getAssetsHoldingsSummary,
  getAssetsRewardSummary,
} from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'

export function useAssetsHoldingsDistribution(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.assetsHoldingsDistribution,
    getAssetsHoldingsDistribution,
    enabled,
  )
}

export function useAssetsHoldingsSummary(enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.assetsHoldingsSummary,
    getAssetsHoldingsSummary,
    enabled,
  )
}

export function useAssetsRewardSummary(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.assetsRewardSummary, getAssetsRewardSummary, enabled)
}
