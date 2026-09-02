import { useEffect } from 'react'

import { prefetchConnectWarm } from '~/shared/api/query/prefetch'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

/** 钱包就绪后暖热推荐绑定与余额缓存。 */
export function useConnectWarmPrefetch() {
  const account = useActiveAccount()
  const address = account?.address
  const walletReady = hasWalletAccount(account)

  useEffect(() => {
    if (!walletReady || !address) return
    prefetchConnectWarm(address)
  }, [walletReady, address])
}
