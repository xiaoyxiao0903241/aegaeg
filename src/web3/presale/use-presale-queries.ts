import type { UseQueryResult } from '@tanstack/react-query'

import { ZERO_BI } from '~/core/constants'
import { findActivePresalePhase, type PresalePhaseOnChain } from '~/core/presale/presale-math'
import { type ChainQueryOptions, useChainQuery } from '~/hooks/use-chain-query'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscReadClient } from '~/web3/bsc-read-client'
import { useErc20AllowanceQuery, useErc20BalanceQuery } from '~/web3/erc20/use-erc20-queries'
import {
  readAllPresalePhases,
  readPresaleAgxPriceWei,
  readPresaleAirdropThresholdWei,
  readPresalePaused,
  readPreviewAirdropValue,
  readTotalPresalePurchased,
  readUserPhaseRemainingAmount,
  readUserPresaleTotal,
} from '~/web3/presale/presale-read'

/**
 * 查询全部预售档位（公开数据）。
 *
 * @see 手册 §6 预售 PreSale
 */
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

/**
 * 查询当前处于生效期的预售档位。
 *
 * 阶段是否开放以最新块时间为准（手册）；列表或块时未就绪时保持 undefined。
 */
export function usePresaleActivePhaseQuery(): PresaleActivePhaseQueryResult {
  const phasesQuery = usePresalePhasesQuery()
  const blockTimeQuery = useChainQuery({
    queryKey: queryKeys.chain.latestBlockTimestamp,
    scope: 'public',
    freshness: 'presale',
    queryFn: async () => {
      const block = await bscReadClient.getBlock({ blockTag: 'latest' })
      return Number(block.timestamp)
    },
    refetchInterval: QUERY_STALE_TIME.presale,
  })

  const data =
    phasesQuery.data === undefined || blockTimeQuery.data === undefined
      ? undefined
      : findActivePresalePhase(phasesQuery.data, blockTimeQuery.data)

  return {
    data,
    error: phasesQuery.error ?? blockTimeQuery.error,
    isLoading: phasesQuery.isLoading || blockTimeQuery.isLoading,
    isSuccess: phasesQuery.isSuccess && blockTimeQuery.isSuccess,
    isError: phasesQuery.isError || blockTimeQuery.isError,
    isFetching: phasesQuery.isFetching || blockTimeQuery.isFetching,
    status: phasesQuery.isError || blockTimeQuery.isError ? 'error' : phasesQuery.status,
  }
}

/**
 * 查询预售 AGX 单价（公开数据）。
 */
export function usePresaleAgxPriceQuery() {
  return useChainQuery({
    queryKey: queryKeys.chain.presaleAgxPrice,
    scope: 'public',
    freshness: 'presale',
    queryFn: () => readPresaleAgxPriceWei(),
  })
}

/**
 * 查询全网预售累计购买额（公开数据）。
 *
 * @param options 查询选项（enabled 等）
 */
export function usePresaleTotalPurchasedQuery(options?: ChainQueryOptions) {
  const enabled = options?.enabled ?? true

  return useChainQuery({
    queryKey: queryKeys.chain.presaleTotalPurchased,
    scope: 'public',
    freshness: 'presale',
    enabled,
    queryFn: () => readTotalPresalePurchased(),
    // 累计购买额在 Genesis 页激活期间每 30 秒刷新。
    refetchInterval: enabled ? QUERY_STALE_TIME.presale : false,
  })
}

/**
 * 查询空投门槛（公开数据）。
 *
 * @param options 查询选项（enabled 等）
 */
export function usePresaleAirdropThresholdQuery(options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.presaleAirdropThreshold,
    scope: 'public',
    freshness: 'presale',
    enabled: options?.enabled ?? true,
    queryFn: () => readPresaleAirdropThresholdWei(),
  })
}

/**
 * 查询预售暂停状态（公开数据）。
 *
 * @param options 查询选项（enabled 等）
 */
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

/**
 * 查询用户预售累计购买额（钱包作用域）。
 *
 * @param options 查询选项（enabled 等）
 */
export function usePresaleUserTotalQuery(options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.presaleUserTotal,
    freshness: 'presale',
    enabled: options?.enabled ?? true,
    queryFn: (addr) => readUserPresaleTotal(addr),
  })
}

/**
 * 查询用户在指定档位的剩余可购额度。
 *
 * @param address 钱包地址
 * @param phaseIndex 档位 index
 * @param options 查询选项（enabled 等）
 */
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

/** Genesis 空投预览 — user（可零地址）+ phase + purchaseAmount。 */
export function usePresalePreviewAirdropValueQuery(
  user: string,
  phaseIndex: number,
  purchaseAmount: bigint,
  options?: ChainQueryOptions,
) {
  const enabled = (options?.enabled ?? true) && purchaseAmount > ZERO_BI
  return useChainQuery({
    queryKey: queryKeys.chain.presalePreviewAirdropValue(
      user,
      phaseIndex,
      purchaseAmount.toString(),
    ),
    scope: 'public',
    freshness: 'presale',
    enabled,
    queryFn: () => readPreviewAirdropValue(user, phaseIndex, purchaseAmount),
  })
}

/**
 * 查询钱包 USD1 余额与预售授权额度。
 *
 * @param address 钱包地址
 * @param options 查询选项（enabled 等）
 */
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
    usd1Balance: balanceQuery.data ?? ZERO_BI,
    usd1BalanceKnown: balanceQuery.data !== undefined,
    allowance: allowanceQuery.data ?? ZERO_BI,
    isWalletLoading: queryEnabled && (balanceQuery.isLoading || allowanceQuery.isLoading),
  }
}
