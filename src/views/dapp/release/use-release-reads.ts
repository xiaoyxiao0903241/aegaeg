import { queryKeys } from '~/shared/api/query/query-keys'
import { readReleaseBufferSnapshot, readReleaseQueueSnapshot } from '~/web3/release/release-read'
import type { Address } from '~/shared/config/contracts'
import { useChainQuery } from '~/hooks/use-chain-query'

export function useReleaseQueueSnapshot(enabled: boolean) {
  return useChainQuery({
    queryKey: queryKeys.chain.releaseQueue,
    queryFn: (addr) => readReleaseQueueSnapshot(addr as Address),
    enabled,
  })
}

export function useReleaseBufferSnapshot(enabled: boolean) {
  return useChainQuery({
    queryKey: queryKeys.chain.releaseBuffer,
    queryFn: (addr) => readReleaseBufferSnapshot(addr as Address),
    enabled,
  })
}
