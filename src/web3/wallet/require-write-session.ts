import type { Account, Wallet } from 'thirdweb/wallets'

import type { Address } from '~/shared/config/contracts'
import { WALLET_BLOCKED } from '~/web3/errors/sentinels'

export type WriteSession = {
  wallet: Wallet
  account: Account
  address: Address
}

/**
 * 从钱包派生写会话
 *
 * 未连接或无可读账户时直接抛阻断，写流程拿不到会话即中止；成功则返回
 * 钱包、账户与地址。调用方通常从 `useChainMutation` 取得。
 *
 * @param wallet 当前钱包，可能未连接
 * @returns 写会话（钱包 / 账户 / 地址）
 */
export function makeWriteSession(wallet: Wallet | undefined | null): WriteSession {
  if (!wallet) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }
  const account = wallet.getAccount()
  if (!account?.address) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }
  return {
    wallet,
    account,
    address: account.address as Address,
  }
}
