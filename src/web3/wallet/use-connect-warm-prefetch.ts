import { useEffect } from 'react'
import { prefetchConnectWarm } from '~/shared/api/query/prefetch'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

/** On wallet ready: warm bind + AGX/USD1/gAGX/USDT balances into RQ. */
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
