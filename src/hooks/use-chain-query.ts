import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { chainWalletQueryKey } from '~/shared/api/query/chain-wallet-query-key'
import { chainQueryEnabled, type ChainQueryScope } from '~/core/wallet/chain-query-enabled'

export type ChainQueryFreshness = keyof typeof QUERY_STALE_TIME

/** Shared options bag for domain chain-query hooks (`enabled` only). */
export type ChainQueryOptions = {
  enabled?: boolean
}

type ChainQueryBase<TData> = {
  /** Default `balances` (U). Never use for submit-time live gates (L). */
  freshness?: ChainQueryFreshness
  /** Domain enabled; AND-ed with scope. Default true. */
  enabled?: boolean
  placeholderData?: UseQueryOptions<TData, Error, TData, QueryKey>['placeholderData']
  refetchInterval?: number | false
}

/** Wallet-scoped: `queryKey` is a prefix; hook appends active address. */
export type UseWalletChainQueryArgs<TData> = ChainQueryBase<TData> & {
  scope?: 'wallet'
  queryKey: QueryKey
  queryFn: (address: string) => Promise<TData>
}

/** Public: caller owns the full `queryKey`; no address injection. */
export type UsePublicChainQueryArgs<TData> = ChainQueryBase<TData> & {
  scope: 'public'
  queryKey: QueryKey
  queryFn: () => Promise<TData>
}

export type UseChainQueryArgs<TData> =
  UseWalletChainQueryArgs<TData> | UsePublicChainQueryArgs<TData>

/**
 * Chain display reads: freshness → staleTime, wallet scope owns address (key + queryFn).
 * Uses `bscReadClient` via `read*` defaults — no client injection.
 * L-tier live gates must not use this hook (direct read / fetchQuery staleTime:0).
 */
export function useChainQuery<TData>(args: UseChainQueryArgs<TData>): UseQueryResult<TData> {
  const account = useActiveAccount()
  const scope: ChainQueryScope = args.scope ?? 'wallet'
  const freshness = args.freshness ?? 'balances'
  /** Lowercase so key and queryFn always share one identity (checksum-safe). */
  const walletAddress = account?.address?.toLowerCase()

  // Wallet + disconnected: still suffix '' so the key never equals a bare prefix
  // that could collide if something incorrectly enables the query.
  const queryKey =
    scope === 'wallet' ? chainWalletQueryKey(args.queryKey, walletAddress ?? '') : args.queryKey

  return useQuery<TData, Error, TData, QueryKey>({
    queryKey,
    queryFn: () => {
      if (scope === 'wallet') {
        if (!walletAddress) {
          throw new Error('useChainQuery: wallet scope ran without address')
        }
        return (args as UseWalletChainQueryArgs<TData>).queryFn(walletAddress)
      }
      return (args as UsePublicChainQueryArgs<TData>).queryFn()
    },
    enabled: chainQueryEnabled({
      scope,
      enabled: args.enabled,
      address: walletAddress,
    }),
    staleTime: QUERY_STALE_TIME[freshness],
    placeholderData: args.placeholderData,
    refetchInterval: args.refetchInterval,
    refetchIntervalInBackground: args.refetchInterval ? false : undefined,
  })
}
