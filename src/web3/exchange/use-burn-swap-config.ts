import { keepPreviousData } from '@tanstack/react-query'

import {
  formatContributionClaimRatioLabel,
  MANUAL_CONTRIBUTION_DIVISOR_FALLBACK,
} from '~/core/exchange/burn-contribution-swap'
import { type ChainQueryOptions, useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readBurnContributionSwapConfig } from '~/web3/exchange/burn-exchange-read'

/**
 * 公开：AgxContributionSwap 全局配置（含 contributionDivisor）。
 * 与兑换 burn / hub 共用 `burnSwapConfig` 缓存。
 */
export function useBurnSwapConfigQuery(options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.burnSwapConfig,
    scope: 'public',
    freshness: 'balances',
    enabled: options?.enabled ?? true,
    queryFn: () => readBurnContributionSwapConfig(),
    placeholderData: keepPreviousData,
  })
}

/**
 * 领取消耗比文案（如 `6:1`），来自共享 burnSwapConfig.contributionDivisor。
 */
export function useContributionClaimRatioLabel(options?: ChainQueryOptions): string {
  const configQuery = useBurnSwapConfigQuery(options)
  return formatContributionClaimRatioLabel(
    configQuery.data?.contributionDivisor ?? MANUAL_CONTRIBUTION_DIVISOR_FALLBACK,
  )
}
