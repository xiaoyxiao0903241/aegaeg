import { defaultChain } from '~/web3/thirdweb'
import { useActiveAccount, useActiveWalletChain } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

/**
 * Address presence vs write readiness.
 * `walletReady` — account restored (balances/reads).
 * `writeReady` — also on the app expected chain (BSC).
 */
export function useWriteReadiness() {
  const account = useActiveAccount()
  const chain = useActiveWalletChain()
  const walletReady = hasWalletAccount(account)
  const writeReady = walletReady && chain?.id === defaultChain.id
  return {
    account,
    walletReady,
    writeReady,
    chainId: chain?.id,
    expectedChainId: defaultChain.id,
  }
}
