import { useQuery } from '@tanstack/react-query'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { queryKeys } from '~/shared/api/query/query-keys'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readReleaseBufferSnapshot, readReleaseQueueSnapshot } from '~/web3/release/release-read'
import type { Address } from '~/shared/config/contracts'

export function useReleaseQueueSnapshot(enabled: boolean) {
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const walletReady = hasWalletAccount(account)
  const address = account?.address as Address | undefined

  return useQuery({
    queryKey: queryKeys.chain.releaseQueue(address ?? ''),
    queryFn: () => readReleaseQueueSnapshot(address!, readClient),
    enabled: enabled && walletReady && Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })
}

export function useReleaseBufferSnapshot(enabled: boolean) {
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const walletReady = hasWalletAccount(account)
  const address = account?.address as Address | undefined

  return useQuery({
    queryKey: queryKeys.chain.releaseBuffer(address ?? ''),
    queryFn: () => readReleaseBufferSnapshot(address!, readClient),
    enabled: enabled && walletReady && Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })
}
