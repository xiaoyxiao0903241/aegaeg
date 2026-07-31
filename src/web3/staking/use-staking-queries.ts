import { useChainQuery } from '~/hooks/use-chain-query'
import type { Address } from '~/shared/config/contracts'
import { queryKeys } from '~/shared/api/query/query-keys'
import {
  readBondZapPreflight,
  readStakeOpenPreflight,
  readXminePreflight,
} from '~/web3/staking/staking-read'
import { readBondHelperSlippage, readBondZapAgxPreview } from '~/web3/staking/bond-zap-quote-read'

type StakingQueryOptions = {
  enabled?: boolean
}

/** Wallet-scoped preflight — address from useChainQuery (active account). */
export function useStakeOpenPreflightQuery(
  pool: Address,
  isLiquid: boolean,
  options?: StakingQueryOptions,
) {
  return useChainQuery({
    queryKey: queryKeys.chain.stakeOpenPreflight(pool),
    freshness: 'balances',
    enabled: options?.enabled ?? true,
    queryFn: (user) =>
      readStakeOpenPreflight({
        pool,
        isLiquid,
        user,
      }),
  })
}

export function useBondZapPreflightQuery(depository: Address, options?: StakingQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.bondZapPreflight(depository),
    freshness: 'balances',
    enabled: options?.enabled ?? true,
    queryFn: (user) =>
      readBondZapPreflight({
        depository,
        user,
      }),
  })
}

export function useBondHelperSlippageQuery(options?: StakingQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.bondHelperSlippage,
    scope: 'public',
    freshness: 'quote',
    enabled: options?.enabled ?? true,
    queryFn: () => readBondHelperSlippage(),
  })
}

export function useBondZapAgxPreviewQuery(
  kind: 'lp' | 'burn',
  depository: Address,
  depositUsd1: bigint,
  options?: StakingQueryOptions,
) {
  return useChainQuery({
    queryKey: queryKeys.chain.bondZapAgxPreview(kind, depository, depositUsd1.toString()),
    scope: 'public',
    freshness: 'quote',
    enabled: (options?.enabled ?? true) && depositUsd1 > 0n,
    queryFn: () =>
      readBondZapAgxPreview({
        kind,
        depository,
        depositUsd1,
      }),
  })
}

export function useXminePreflightQuery(options?: StakingQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.xminePreflight,
    freshness: 'balances',
    enabled: options?.enabled ?? true,
    queryFn: (user) => readXminePreflight({ user }),
  })
}
