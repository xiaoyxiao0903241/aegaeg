import { keepPreviousData } from '@tanstack/react-query'

import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { readReleaseBufferSnapshot, readReleaseQueueSnapshot } from '~/web3/release/release-read'

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
