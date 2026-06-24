import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BSC_CONTRACTS } from '~/config/contracts'
import { QUERY_STALE_TIME, queryClient } from '~/lib/query/query-client'
import { queryKeys } from '~/lib/query/query-keys'
import {
  readActivePresalePhase,
  readAllPresalePhases,
  readPresaleAgxPriceWei,
  readPresaleAirdropThresholdWei,
  readTotalPresalePurchased,
  readUserPhaseRemainingAmount,
  readUserPresaleTotal,
} from '~/web3/presale-read'
import { readErc20Allowance, readErc20Balance } from '~/web3/swap-read'
import { readIsBindReferral } from '~/web3/referral-read'

export function useIsBindReferralQuery(address?: string) {
  return useQuery({
    queryKey: queryKeys.chain.referralIsBound(address ?? ''),
    queryFn: () => readIsBindReferral(address!),
    enabled: Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })
}

export function usePresalePhasesQuery() {
  return useQuery({
    queryKey: queryKeys.chain.presalePhases,
    queryFn: () => readAllPresalePhases(),
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresaleActivePhaseQuery() {
  return useQuery({
    queryKey: queryKeys.chain.presaleActivePhase,
    queryFn: () => readActivePresalePhase(),
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresaleAgxPriceQuery() {
  return useQuery({
    queryKey: queryKeys.chain.presaleAgxPrice,
    queryFn: () => readPresaleAgxPriceWei(),
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresaleTotalPurchasedQuery() {
  return useQuery({
    queryKey: queryKeys.chain.presaleTotalPurchased,
    queryFn: () => readTotalPresalePurchased(),
    staleTime: QUERY_STALE_TIME.presale,
    // Global cumulative contribution refreshes itself every 30s from chain.
    refetchInterval: QUERY_STALE_TIME.presale,
    refetchIntervalInBackground: false,
  })
}

export function usePresaleAirdropThresholdQuery() {
  return useQuery({
    queryKey: queryKeys.chain.presaleAirdropThreshold,
    queryFn: () => readPresaleAirdropThresholdWei(),
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresaleUserTotalQuery(address?: string) {
  return useQuery({
    queryKey: queryKeys.chain.presaleUserTotal(address ?? ''),
    queryFn: () => readUserPresaleTotal(address!),
    enabled: Boolean(address),
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresaleUserPhaseRemainingQuery(address?: string, phaseIndex?: number) {
  return useQuery({
    queryKey: queryKeys.chain.presaleUserPhaseRemaining(address ?? '', phaseIndex ?? 0),
    queryFn: () => readUserPhaseRemainingAmount(address!, phaseIndex!),
    enabled: Boolean(address) && phaseIndex !== undefined,
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function useUsd1PresaleWalletQuery(address?: string) {
  const balanceQuery = useQuery({
    queryKey: queryKeys.chain.erc20Balance(BSC_CONTRACTS.usd1, address ?? ''),
    queryFn: () => readErc20Balance(BSC_CONTRACTS.usd1, address!),
    enabled: Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })

  const allowanceQuery = useQuery({
    queryKey: queryKeys.chain.erc20Allowance(
      BSC_CONTRACTS.usd1,
      address ?? '',
      BSC_CONTRACTS.preSale,
    ),
    queryFn: () =>
      readErc20Allowance(BSC_CONTRACTS.usd1, address!, BSC_CONTRACTS.preSale),
    enabled: Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })

  return {
    balanceQuery,
    allowanceQuery,
    usd1Balance: balanceQuery.data ?? 0n,
    allowance: allowanceQuery.data ?? 0n,
    isWalletLoading: Boolean(address) && (balanceQuery.isLoading || allowanceQuery.isLoading),
  }
}
