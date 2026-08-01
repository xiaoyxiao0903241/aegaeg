import type { UseQueryResult } from '@tanstack/react-query'
import { findActivePresalePhase, type PresalePhaseOnChain } from '~/core/presale/presale-math'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { useChainQuery, type ChainQueryOptions } from '~/hooks/use-chain-query'
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

export function usePresalePhasesQuery() {
  return useChainQuery({
    queryKey: queryKeys.chain.presalePhases,
    scope: 'public',
    freshness: 'presale',
    queryFn: () => readAllPresalePhases(),
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
  return useChainQuery({
    queryKey: queryKeys.chain.presaleAgxPrice,
    scope: 'public',
    freshness: 'presale',
    queryFn: () => readPresaleAgxPriceWei(),
  })
}

export function usePresaleTotalPurchasedQuery(options?: ChainQueryOptions) {
  const enabled = options?.enabled ?? true

  return useChainQuery({
    queryKey: queryKeys.chain.presaleTotalPurchased,
    scope: 'public',
    freshness: 'presale',
    enabled,
    queryFn: () => readTotalPresalePurchased(),
    // Cumulative contribution refreshes every 30s while the Genesis tab is active.
    refetchInterval: enabled ? QUERY_STALE_TIME.presale : false,
  })
}

export function usePresaleAirdropThresholdQuery(options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.presaleAirdropThreshold,
    scope: 'public',
    freshness: 'presale',
    enabled: options?.enabled ?? true,
    queryFn: () => readPresaleAirdropThresholdWei(),
  })
}

export function usePresalePausedQuery(options?: ChainQueryOptions) {
  const enabled = options?.enabled ?? true

  return useChainQuery({
    queryKey: queryKeys.chain.presalePaused,
    scope: 'public',
    freshness: 'presale',
    enabled,
    queryFn: () => readPresalePaused(),
    refetchInterval: enabled ? QUERY_STALE_TIME.presale : false,
  })
}

export function usePresaleUserTotalQuery(options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.presaleUserTotal,
    freshness: 'presale',
    enabled: options?.enabled ?? true,
    queryFn: (addr) => readUserPresaleTotal(addr),
  })
}

export function usePresaleUserPhaseRemainingQuery(
  address?: string,
  phaseIndex?: number,
  options?: ChainQueryOptions,
) {
  return useChainQuery({
    queryKey: queryKeys.chain.presaleUserPhaseRemaining(address ?? '', phaseIndex ?? 0),
    scope: 'public',
    freshness: 'presale',
    enabled: (options?.enabled ?? true) && Boolean(address) && phaseIndex !== undefined,
    queryFn: () => readUserPhaseRemainingAmount(address!, phaseIndex!),
  })
}

export function useUsd1PresaleWalletQuery(address?: string, options?: ChainQueryOptions) {
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
    usd1BalanceKnown: balanceQuery.data !== undefined,
    allowance: allowanceQuery.data ?? 0n,
    isWalletLoading: queryEnabled && (balanceQuery.isLoading || allowanceQuery.isLoading),
  }
}
