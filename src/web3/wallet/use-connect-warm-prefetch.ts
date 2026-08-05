import { useEffect, useMemo } from 'react'

import { prefetchConnectWarm } from '~/shared/api/query/prefetch'
import { chainReadClient } from '~/web3/chain-read-client'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

/** 优先用已连接钱包的 RPC；未连接时回退到应用读 RPC。 */
function useChainReadClient() {
  const wallet = useActiveWallet()
  return useMemo(() => chainReadClient(wallet), [wallet])
}

/** 钱包就绪后：把推荐绑定与 AGX/USD1/gAGX/USDT/X 余额预热进 React Query。 */
export function useConnectWarmPrefetch() {
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address
  const walletReady = hasWalletAccount(account)

  useEffect(() => {
    if (!walletReady || !address) return
    prefetchConnectWarm(address, readClient)
  }, [walletReady, address, readClient])
}
