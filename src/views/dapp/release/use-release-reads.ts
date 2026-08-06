import { keepPreviousData } from '@tanstack/react-query'

import { SECONDS_PER_DAY } from '~/core/assets/claim-plans'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import {
  readPrincipalReleaseDuration,
  readReleaseBufferSnapshot,
  readReleaseQueuePlans,
  readReleaseQueueSnapshot,
} from '~/web3/release/release-read'

/**
 * 释放队列链上快照
 *
 * 按钱包地址读取各天数档位的释放数据；
 * 未启用时返回空，启用后以前值占位避免加载闪烁。
 */
export function useReleaseQueueSnapshot(enabled: boolean) {
  return useChainQuery({
    queryKey: queryKeys.chain.releaseQueue,
    queryFn: (addr) => readReleaseQueueSnapshot(addr as Address),
    enabled,
    placeholderData: keepPreviousData,
  })
}

/**
 * 缓冲池链上快照
 *
 * 按钱包地址读取缓冲池的入池、可提取与释放中数据；
 * 未启用时返回空，启用后以前值占位避免加载闪烁。
 */
export function useReleaseBufferSnapshot(enabled: boolean) {
  return useChainQuery({
    queryKey: queryKeys.chain.releaseBuffer,
    queryFn: (addr) => readReleaseBufferSnapshot(addr as Address),
    enabled,
    placeholderData: keepPreviousData,
  })
}

/** PRV 当前新单释放周期（天）；缺省回落 30。 */
export function usePrincipalReleaseDurationDays() {
  return useChainQuery({
    queryKey: queryKeys.chain.releaseDuration,
    scope: 'public',
    freshness: 'api',
    queryFn: async () => {
      const seconds = await readPrincipalReleaseDuration()
      const days = Number(seconds / SECONDS_PER_DAY)
      return Number.isFinite(days) && days > 0 ? days : 30
    },
  })
}

/** RewardQueue 计划（含税率），供 hub 税率表 / 选项派生。 */
export function useReleaseQueuePlans() {
  return useChainQuery({
    queryKey: queryKeys.chain.releaseQueuePlans,
    scope: 'public',
    freshness: 'api',
    queryFn: () => readReleaseQueuePlans(),
  })
}
