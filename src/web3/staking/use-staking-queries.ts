import { keepPreviousData } from '@tanstack/react-query'
import { useMemo } from 'react'

import { ZERO_BI } from '~/core/constants'
import { type EpochScheduleLabels, formatEpochScheduleLabels } from '~/core/staking/staking-yield'
import { type ChainQueryOptions, useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { readBondZapAgxPreview, readBondZapPoolSnapshot } from '~/web3/staking/bond-zap-quote-read'
import {
  readLatestSagxRebaseRate,
  readStakingHubOverview,
} from '~/web3/staking/staking-hub-overview-read'
import {
  readBondZapPreflight,
  readStakeOpenPreflight,
  readXminePreflight,
} from '~/web3/staking/staking-read'
import { readXmineOverview } from '~/web3/staking/xmine-overview-read'

/** 质押中心页公开概览查询：质押池 / 流通 / 国库 / 销毁 / epoch，无钱包依赖。 */
export function useStakingHubOverviewQuery(options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.stakingHubOverview,
    scope: 'public',
    freshness: 'balances',
    enabled: options?.enabled ?? true,
    queryFn: () => readStakingHubOverview(),
    placeholderData: keepPreviousData,
  })
}

/** RewardManager 基础 Rebase 率与展示用日频 2；与 Hub 概览拆开。 */
export function useLatestSagxRebaseRateQuery(options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.sagxLatestRebase,
    scope: 'public',
    freshness: 'balances',
    enabled: options?.enabled ?? true,
    queryFn: () => readLatestSagxRebaseRate(),
    placeholderData: keepPreviousData,
  })
}

/**
 * Epoch 文案标签（块数 / 小时 / 每日次数），复用 `stakingHubOverview` 缓存。
 */
export function useEpochScheduleLabels(options?: ChainQueryOptions): EpochScheduleLabels {
  const overviewQuery = useStakingHubOverviewQuery(options)
  return useMemo(
    () =>
      formatEpochScheduleLabels(
        overviewQuery.data?.epochLengthBlocks,
        overviewQuery.data?.secondsPerBlock,
      ),
    [overviewQuery.data?.epochLengthBlocks, overviewQuery.data?.secondsPerBlock],
  )
}

/**
 * 质押开仓写前预检查询（钱包作用域）
 *
 * 地址由 `useChainQuery` 取当前活跃账户；结果含绑定、余额、授权与剩余额度。
 *
 * @param pool 质押池合约地址
 * @param isLiquid 是否为活期质押
 * @param options 查询选项（可禁用）
 * @see 手册 §8 质押 Staking
 */
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

/**
 * 债券 zap 写前预检查询（钱包作用域）
 *
 * 读取推荐绑定、USD1 余额与对 BondHelper 的授权、depository 是否被授权。
 *
 * @param depository 债券市场合约地址
 * @param options 查询选项（可禁用）
 * @see 手册 §10.4 用户写方法
 */
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

/**
 * 债券 zap 净 / 毛 AGX 预期查询（公开，报价级新鲜度）
 *
 * 仅当 `depositUsd1 > 0` 时启用。
 *
 * @param kind 债券类型：'lp' 或 'burn'
 * @param depository 债券市场合约地址
 * @param depositUsd1 投入的 USD1 数量
 * @param options 查询选项（可禁用）
 * @see docs/onchain-manual/contracts/bondhelper.md
 */
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
    enabled: (options?.enabled ?? true) && depositUsd1 > ZERO_BI,
    queryFn: () =>
      readBondZapAgxPreview({
        kind,
        depository,
        depositUsd1,
      }),
    placeholderData: keepPreviousData,
  })
}

/**
 * AGX/USD1 池储备快照（公开，报价级新鲜度），供债券最大可买 USD1 反推。
 */
export function useBondZapPoolSnapshotQuery(options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.bondZapPoolSnapshot,
    scope: 'public',
    freshness: 'quote',
    enabled: options?.enabled ?? true,
    queryFn: () => readBondZapPoolSnapshot(),
    placeholderData: keepPreviousData,
  })
}

/** X 挖矿写前预检查询（钱包作用域）：余额 / 授权 / 配额 / 已质押。 */
export function useXminePreflightQuery(options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.xminePreflight,
    freshness: 'balances',
    enabled: options?.enabled ?? true,
    queryFn: (user) => readXminePreflight({ user }),
    placeholderData: keepPreviousData,
  })
}

/** Xmine 概览查询（公开）：xPerAgx · yieldRateBP · totalStakedGagx。 */
export function useXmineOverviewQuery(options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.xmineOverview,
    scope: 'public',
    freshness: 'quote',
    enabled: options?.enabled ?? true,
    queryFn: () => readXmineOverview(),
    placeholderData: keepPreviousData,
  })
}
