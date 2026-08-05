import { defaultChain } from '~/web3/thirdweb'
import { useActiveAccount, useActiveWalletChain } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

/**
 * 钱包就绪状态：地址存在 vs 可写
 *
 * `walletReady` — 账户已恢复（余额 / 读取可用）。
 * `writeReady` — 同时处于应用期望链（BSC），才可发起写。
 *
 * @returns 账户、两种就绪态与当前 / 期望链 id
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
