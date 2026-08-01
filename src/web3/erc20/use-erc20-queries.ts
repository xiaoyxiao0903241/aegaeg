import { keepPreviousData } from '@tanstack/react-query'

import { type ChainQueryOptions, useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { readErc20Allowance, readErc20Balance } from '~/web3/exchange/exchange-read'

/**
 * Atomic ERC20 balance — wallet-scoped SSOT（`queryKeys.chain.erc20Balance` + address）。
 * 展示可 keepPreviousData；决策面须看 `isPlaceholderData`（见 `decision-freshness`）。
 */
export function useErc20BalanceQuery(
  token: Address | undefined,
  owner: string | undefined,
  options?: ChainQueryOptions,
) {
  return useChainQuery({
    queryKey: queryKeys.chain.erc20Balance(token ?? ''),
    freshness: 'balances',
    enabled: (options?.enabled ?? true) && Boolean(token && owner),
    queryFn: (address) => readErc20Balance(token!, address),
    placeholderData: keepPreviousData,
  })
}

/**
 * Atomic ERC20 allowance — spender 进 key；非 connect prefetch。
 * 展示可 keepPreviousData；决策面须排除 placeholder。
 */
export function useErc20AllowanceQuery(
  token: Address | undefined,
  owner: string | undefined,
  spender: Address | undefined,
  options?: ChainQueryOptions,
) {
  return useChainQuery({
    queryKey: queryKeys.chain.erc20Allowance(token ?? '', owner ?? '', spender ?? ''),
    scope: 'public',
    freshness: 'balances',
    enabled: (options?.enabled ?? true) && Boolean(token && owner && spender),
    queryFn: () => readErc20Allowance(token!, owner!, spender!),
    placeholderData: keepPreviousData,
  })
}
