import { useChainQuery } from '~/hooks/use-chain-query'
import type { Address } from '~/shared/config/contracts'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readErc20Allowance, readErc20Balance } from '~/web3/exchange/exchange-read'

type Erc20QueryOptions = {
  enabled?: boolean
}

/**
 * Atomic ERC20 balance — cross-rail SSOT (`queryKeys.chain.erc20BalanceOf`).
 * Explicit `owner` → `scope: 'public'` (any address, not only active wallet).
 */
export function useErc20BalanceQuery(
  token: Address | undefined,
  owner: string | undefined,
  options?: Erc20QueryOptions,
) {
  return useChainQuery({
    queryKey: queryKeys.chain.erc20BalanceOf(token ?? '', owner ?? ''),
    scope: 'public',
    freshness: 'balances',
    enabled: (options?.enabled ?? true) && Boolean(token && owner),
    queryFn: () => readErc20Balance(token!, owner!),
  })
}

/**
 * Atomic ERC20 allowance — spender-specific; not part of connect prefetch.
 * Explicit owner/spender → `scope: 'public'`.
 */
export function useErc20AllowanceQuery(
  token: Address | undefined,
  owner: string | undefined,
  spender: Address | undefined,
  options?: Erc20QueryOptions,
) {
  return useChainQuery({
    queryKey: queryKeys.chain.erc20Allowance(token ?? '', owner ?? '', spender ?? ''),
    scope: 'public',
    freshness: 'balances',
    enabled: (options?.enabled ?? true) && Boolean(token && owner && spender),
    queryFn: () => readErc20Allowance(token!, owner!, spender!),
  })
}
