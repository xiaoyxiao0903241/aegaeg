import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { findActivePresalePhase, type PresalePhaseOnChain } from '~/core/presale/presale-math'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import {
  readAllPresalePhases,
  readPresaleAgxPriceWei,
  readPresaleAirdropThresholdWei,
  readPresalePaused,
  readTotalPresalePurchased,
  readUserPhaseRemainingAmount,
  readUserPresaleTotal,
} from '~/web3/presale/presale-read'
import { useErc20AllowanceQuery, useErc20BalanceQuery } from '~/web3/erc20/use-erc20-queries'

type PresaleQueryOptions = {
  enabled?: boolean
}

export function usePresalePhasesQuery() {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.presalePhases,
    queryFn: () => readAllPresalePhases(readClient),
    staleTime: QUERY_STALE_TIME.presale,
  })
}

type PresaleActivePhaseQueryResult = Pick<
  UseQueryResult<PresalePhaseOnChain | null>,
  'data' | 'error' | 'isLoading' | 'isSuccess' | 'isError' | 'isFetching' | 'status'
>

export function usePresaleActivePhaseQuery(): PresaleActivePhaseQueryResult {
  const phasesQuery = usePresalePhasesQuery()

  const data = phasesQuery.data === undefined ? undefined : findActivePresalePhase(phasesQuery.data)

  return {
    data,
    error: phasesQuery.error,
    isLoading: phasesQuery.isLoading,
    isSuccess: phasesQuery.isSuccess,
    isError: phasesQuery.isError,
    isFetching: phasesQuery.isFetching,
    status: phasesQuery.status,
  }
}

export function usePresaleAgxPriceQuery() {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.presaleAgxPrice,
    queryFn: () => readPresaleAgxPriceWei(readClient),
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresaleTotalPurchasedQuery(options?: PresaleQueryOptions) {
  const readClient = useChainReadClient()
  const enabled = options?.enabled ?? true

  return useQuery({
    queryKey: queryKeys.chain.presaleTotalPurchased,
    queryFn: () => readTotalPresalePurchased(readClient),
    enabled,
    staleTime: QUERY_STALE_TIME.presale,
    // Cumulative contribution refreshes every 30s while the Genesis tab is active.
    refetchInterval: enabled ? QUERY_STALE_TIME.presale : false,
    refetchIntervalInBackground: false,
  })
}

export function usePresaleAirdropThresholdQuery(options?: PresaleQueryOptions) {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.presaleAirdropThreshold,
    queryFn: () => readPresaleAirdropThresholdWei(readClient),
    enabled: options?.enabled ?? true,
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresalePausedQuery(options?: PresaleQueryOptions) {
  const readClient = useChainReadClient()
  const enabled = options?.enabled ?? true

  return useQuery({
    queryKey: queryKeys.chain.presalePaused,
    queryFn: () => readPresalePaused(readClient),
    enabled,
    staleTime: QUERY_STALE_TIME.presale,
    refetchInterval: enabled ? QUERY_STALE_TIME.presale : false,
    refetchIntervalInBackground: false,
  })
}

export function usePresaleUserTotalQuery(address?: string, options?: PresaleQueryOptions) {
  const readClient = useChainReadClient()
  const queryEnabled = (options?.enabled ?? true) && Boolean(address)

  return useQuery({
    queryKey: queryKeys.chain.presaleUserTotal(address ?? ''),
    queryFn: () => readUserPresaleTotal(address!, readClient),
    enabled: queryEnabled,
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresaleUserPhaseRemainingQuery(
  address?: string,
  phaseIndex?: number,
  options?: PresaleQueryOptions,
) {
  const readClient = useChainReadClient()
  const queryEnabled = (options?.enabled ?? true) && Boolean(address) && phaseIndex !== undefined

  return useQuery({
    queryKey: queryKeys.chain.presaleUserPhaseRemaining(address ?? '', phaseIndex ?? 0),
    queryFn: () => readUserPhaseRemainingAmount(address!, phaseIndex!, readClient),
    enabled: queryEnabled,
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function useUsd1PresaleWalletQuery(address?: string, options?: PresaleQueryOptions) {
  const queryEnabled = (options?.enabled ?? true) && Boolean(address)

  const balanceQuery = useErc20BalanceQuery(BSC_CONTRACTS.usd1, address, {
    enabled: queryEnabled,
  })
  const allowanceQuery = useErc20AllowanceQuery(
    BSC_CONTRACTS.usd1,
    address,
    BSC_CONTRACTS.preSale,
    { enabled: queryEnabled },
  )

  return {
    balanceQuery,
    allowanceQuery,
    usd1Balance: balanceQuery.data ?? 0n,
    allowance: allowanceQuery.data ?? 0n,
    isWalletLoading: queryEnabled && (balanceQuery.isLoading || allowanceQuery.isLoading),
  }
}
