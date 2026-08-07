import { useEffect } from 'react'

import { prefetchConnectWarm } from '~/shared/api/query/prefetch'
import { bscReadClient } from '~/web3/bsc-read-client'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

/**
 * 钱包就绪后：用 BSC 公共读客户端暖热推荐绑定与余额缓存。
 * 不用钱包 RPC，避免非 BSC chainId 污染 query cache。
 */
export function useConnectWarmPrefetch() {
  const account = useActiveAccount()
  const address = account?.address
  const walletReady = hasWalletAccount(account)

  useEffect(() => {
    if (!walletReady || !address) return
    prefetchConnectWarm(address, bscReadClient)
  }, [walletReady, address])
}
