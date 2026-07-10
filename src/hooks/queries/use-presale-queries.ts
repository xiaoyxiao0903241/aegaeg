import { useQuery } from '@tanstack/react-query'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { useChainReadClient } from '~/hooks/use-chain-read-client'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import {
  readActivePresalePhase,
  readAllPresalePhases,
  readPresaleAgxPriceWei,
  readPresaleAirdropThresholdWei,
  readPresalePaused,
  readTotalPresalePurchased,
  readUserPhaseRemainingAmount,
  readUserPresaleTotal,
} from '~/views/dapp/web3/presale-read'
import { readErc20Allowance, readErc20Balance } from '~/views/dapp/web3/swap-read'
import { readIsBindReferral } from '~/views/dapp/web3/referral-read'

export function useIsBindReferralQuery(address?: string) {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.referralIsBound(address ?? ''),
    queryFn: () => readIsBindReferral(address!, readClient),
    enabled: Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })
}

export function usePresalePhasesQuery() {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.presalePhases,
    queryFn: () => readAllPresalePhases(readClient),
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresaleActivePhaseQuery() {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.presaleActivePhase,
    queryFn: () => readActivePresalePhase(readClient),
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresaleAgxPriceQuery() {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.presaleAgxPrice,
    queryFn: () => readPresaleAgxPriceWei(readClient),
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresaleTotalPurchasedQuery() {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.presaleTotalPurchased,
    queryFn: () => readTotalPresalePurchased(readClient),
    staleTime: QUERY_STALE_TIME.presale,
    // Global cumulative contribution refreshes itself every 30s from chain.
    refetchInterval: QUERY_STALE_TIME.presale,
    refetchIntervalInBackground: false,
  })
}

export function usePresaleAirdropThresholdQuery() {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.presaleAirdropThreshold,
    queryFn: () => readPresaleAirdropThresholdWei(readClient),
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresalePausedQuery() {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.presalePaused,
    queryFn: () => readPresalePaused(readClient),
    staleTime: QUERY_STALE_TIME.presale,
    refetchInterval: QUERY_STALE_TIME.presale,
    refetchIntervalInBackground: false,
  })
}

export function usePresaleUserTotalQuery(address?: string) {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.presaleUserTotal(address ?? ''),
    queryFn: () => readUserPresaleTotal(address!, readClient),
    enabled: Boolean(address),
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function usePresaleUserPhaseRemainingQuery(address?: string, phaseIndex?: number) {
  const readClient = useChainReadClient()

  return useQuery({
    queryKey: queryKeys.chain.presaleUserPhaseRemaining(address ?? '', phaseIndex ?? 0),
    queryFn: () => readUserPhaseRemainingAmount(address!, phaseIndex!, readClient),
    enabled: Boolean(address) && phaseIndex !== undefined,
    staleTime: QUERY_STALE_TIME.presale,
  })
}

export function useUsd1PresaleWalletQuery(address?: string) {
  const readClient = useChainReadClient()

  const balanceQuery = useQuery({
    queryKey: queryKeys.chain.erc20Balance(BSC_CONTRACTS.usd1, address ?? ''),
    queryFn: () => readErc20Balance(BSC_CONTRACTS.usd1, address!, readClient),
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
      readErc20Allowance(BSC_CONTRACTS.usd1, address!, BSC_CONTRACTS.preSale, readClient),
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
