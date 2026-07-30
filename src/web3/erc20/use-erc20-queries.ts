import { useQuery } from '@tanstack/react-query'
import type { Address } from '~/shared/config/contracts'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { readErc20Allowance, readErc20Balance } from '~/web3/exchange/exchange-read'
import { useChainReadClient } from '~/web3/use-chain-read-client'

type Erc20QueryOptions = {
  enabled?: boolean
}

/** Atomic ERC20 balance — cross-rail SSOT (`queryKeys.chain.erc20Balance`). */
export function useErc20BalanceQuery(
  token: Address | undefined,
  owner: string | undefined,
  options?: Erc20QueryOptions,
) {
  const readClient = useChainReadClient()
  const enabled = (options?.enabled ?? true) && Boolean(token && owner)

  return useQuery({
    queryKey: queryKeys.chain.erc20Balance(token ?? '', owner ?? ''),
    queryFn: () => readErc20Balance(token!, owner!, readClient),
    enabled,
    staleTime: QUERY_STALE_TIME.balances,
  })
}

/** Atomic ERC20 allowance — spender-specific; not part of connect prefetch. */
export function useErc20AllowanceQuery(
  token: Address | undefined,
  owner: string | undefined,
  spender: Address | undefined,
  options?: Erc20QueryOptions,
) {
  const readClient = useChainReadClient()
  const enabled = (options?.enabled ?? true) && Boolean(token && owner && spender)

  return useQuery({
    queryKey: queryKeys.chain.erc20Allowance(token ?? '', owner ?? '', spender ?? ''),
    queryFn: () => readErc20Allowance(token!, owner!, spender!, readClient),
    enabled,
    staleTime: QUERY_STALE_TIME.balances,
  })
}
