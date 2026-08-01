import { keepPreviousData } from '@tanstack/react-query'

import { type ChainQueryOptions, useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { readBondHelperSlippage, readBondZapAgxPreview } from '~/web3/staking/bond-zap-quote-read'
import {
  readBondZapPreflight,
  readStakeOpenPreflight,
  readXminePreflight,
} from '~/web3/staking/staking-read'

/** Wallet-scoped preflight — address from useChainQuery (active account). */
export function useStakeOpenPreflightQuery(
  pool: Address,
  isLiquid: boolean,
  options?: ChainQueryOptions,
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
    placeholderData: keepPreviousData,
  })
}

export function useBondZapPreflightQuery(depository: Address, options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.bondZapPreflight(depository),
    freshness: 'balances',
    enabled: options?.enabled ?? true,
    queryFn: (user) =>
      readBondZapPreflight({
        depository,
        user,
      }),
    placeholderData: keepPreviousData,
  })
}

export function useBondHelperSlippageQuery(options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.bondHelperSlippage,
    scope: 'public',
    freshness: 'quote',
    enabled: options?.enabled ?? true,
    queryFn: () => readBondHelperSlippage(),
    placeholderData: keepPreviousData,
  })
}

export function useBondZapAgxPreviewQuery(
  kind: 'lp' | 'burn',
  depository: Address,
  depositUsd1: bigint,
  options?: ChainQueryOptions,
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
    placeholderData: keepPreviousData,
  })
}

export function useXminePreflightQuery(options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.xminePreflight,
    freshness: 'balances',
    enabled: options?.enabled ?? true,
    queryFn: (user) => readXminePreflight({ user }),
    placeholderData: keepPreviousData,
  })
}
