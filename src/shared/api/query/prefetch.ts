import { queryClient } from '~/shared/api/query/query-client'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { BSC_CONTRACTS, type Address } from '~/shared/config/contracts'
import type { DappTab } from '~/shared/config/dapp-tabs'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { readErc20Balance } from '~/web3/exchange/exchange-read'
import { readIsBindReferral } from '~/web3/referral/referral-read'
import { TAB_QUERY_KEYS } from '~/shared/api/query/tab-query-keys'

/** Connect warm tokens — AGX / USD1 / gAGX / USDT only (no allowances). */
const CONNECT_WARM_TOKENS: readonly Address[] = [
  BSC_CONTRACTS.agx,
  BSC_CONTRACTS.usd1,
  BSC_CONTRACTS.gagx,
  BSC_CONTRACTS.usdt,
]

/**
 * Prefetch bind + four balances when wallet is ready.
 * Uses parallel `prefetchQuery` (atomic keys); Multicall3 left optional.
 */
export function prefetchConnectWarm(address: string, readClient: ChainReadClient): void {
  void queryClient.prefetchQuery({
    queryKey: queryKeys.chain.referralIsBound(address),
    queryFn: () => readIsBindReferral(address, readClient),
    staleTime: QUERY_STALE_TIME.balances,
  })

  for (const token of CONNECT_WARM_TOKENS) {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.chain.erc20Balance(token, address),
      queryFn: () => readErc20Balance(token, address, readClient),
      staleTime: QUERY_STALE_TIME.balances,
    })
  }
}

/**
 * Warm inactive observers for a tab’s query roots (hover / revisit).
 * No-op for never-fetched keys (need mount to register queryFn).
 */
export function prefetchTabQueries(tab: DappTab): void {
  for (const queryKey of TAB_QUERY_KEYS[tab]) {
    void queryClient.refetchQueries({ queryKey, type: 'inactive' })
  }
}
