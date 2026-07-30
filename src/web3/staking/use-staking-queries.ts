import { useQuery } from '@tanstack/react-query'
import type { Address } from '~/shared/config/contracts'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import {
  readBondZapPreflight,
  readStakeOpenPreflight,
  readXminePreflight,
} from '~/web3/staking/staking-read'
import { readBondHelperSlippage, readBondZapAgxPreview } from '~/web3/staking/bond-zap-quote-read'
import { useChainReadClient } from '~/web3/use-chain-read-client'

type StakingQueryOptions = {
  enabled?: boolean
}

export function useStakeOpenPreflightQuery(
  pool: Address,
  address: string | undefined,
  isLiquid: boolean,
  options?: StakingQueryOptions,
) {
  const readClient = useChainReadClient()
  const enabled = (options?.enabled ?? true) && Boolean(address)

  return useQuery({
    queryKey: queryKeys.chain.stakeOpenPreflight(pool, address ?? ''),
    queryFn: () =>
      readStakeOpenPreflight({
        pool,
        isLiquid,
        user: address!,
        client: readClient,
      }),
    enabled,
    staleTime: QUERY_STALE_TIME.balances,
  })
}

export function useBondZapPreflightQuery(
  depository: Address,
  address: string | undefined,
  options?: StakingQueryOptions,
) {
  const readClient = useChainReadClient()
  const enabled = (options?.enabled ?? true) && Boolean(address)

  return useQuery({
    queryKey: queryKeys.chain.bondZapPreflight(depository, address ?? ''),
    queryFn: () =>
      readBondZapPreflight({
        depository,
        user: address!,
        client: readClient,
      }),
    enabled,
    staleTime: QUERY_STALE_TIME.balances,
  })
}

export function useBondHelperSlippageQuery(options?: StakingQueryOptions) {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.bondHelperSlippage,
    queryFn: () => readBondHelperSlippage(readClient),
    enabled: options?.enabled ?? true,
    staleTime: QUERY_STALE_TIME.quote,
  })
}

export function useBondZapAgxPreviewQuery(
  kind: 'lp' | 'burn',
  depository: Address,
  depositUsd1: bigint,
  options?: StakingQueryOptions,
) {
  const readClient = useChainReadClient()
  const enabled = (options?.enabled ?? true) && depositUsd1 > 0n

  return useQuery({
    queryKey: queryKeys.chain.bondZapAgxPreview(kind, depository, depositUsd1.toString()),
    queryFn: () =>
      readBondZapAgxPreview({
        kind,
        depository,
        depositUsd1,
        client: readClient,
      }),
    enabled,
    staleTime: QUERY_STALE_TIME.quote,
  })
}

export function useXminePreflightQuery(address: string | undefined, options?: StakingQueryOptions) {
  const readClient = useChainReadClient()
  const enabled = (options?.enabled ?? true) && Boolean(address)

  return useQuery({
    queryKey: queryKeys.chain.xminePreflight(address ?? ''),
    queryFn: () => readXminePreflight({ user: address!, client: readClient }),
    enabled,
    staleTime: QUERY_STALE_TIME.balances,
  })
}
