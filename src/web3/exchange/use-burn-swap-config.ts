import { keepPreviousData } from '@tanstack/react-query'

import { type ChainQueryOptions, useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readBurnContributionSwapConfig } from '~/web3/exchange/burn-exchange-read'

/**
 * 公开：AgxContributionSwap 全局配置。
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
