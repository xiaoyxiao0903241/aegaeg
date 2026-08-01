import { keepPreviousData } from '@tanstack/react-query'
import { useChainQuery, type ChainQueryOptions } from '~/hooks/use-chain-query'
import type { Address } from '~/shared/config/contracts'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readErc20Allowance, readErc20Balance } from '~/web3/exchange/exchange-read'

/**
 * Atomic ERC20 balance — wallet-scoped SSOT (`queryKeys.chain.erc20Balance` + address).
 * `owner` gates enablement and must be the active wallet (invalidate still uses `*Of`).
 * Refetch keeps previous balance on screen (no skeleton / zero flash).
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
 * Atomic ERC20 allowance — spender-specific; not part of connect prefetch.
 * Owner + spender stay baked in the key (multi-party; not wallet-prefix-only).
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
