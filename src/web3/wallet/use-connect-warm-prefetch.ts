import { useEffect, useMemo } from 'react'
import { prefetchConnectWarm } from '~/shared/api/query/prefetch'
import { chainReadClient } from '~/web3/chain-read-client'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

/** Prefer the connected wallet's RPC; fall back to app read RPC when disconnected. */
function useChainReadClient() {
  const wallet = useActiveWallet()
  return useMemo(() => chainReadClient(wallet), [wallet])
}

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
