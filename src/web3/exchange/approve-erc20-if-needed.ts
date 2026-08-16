import type { Wallet } from 'thirdweb/wallets'

import { ERC20_ERRORS, ERC20_METHODS } from '~/web3/abis'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { WALLET_BLOCKED } from '~/web3/errors/sentinels'
import { readErc20Allowance } from '~/web3/exchange/exchange-read'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve, ERC20_ERRORS)

/**
 * 授权不足时按需发起 ERC20 approve
 *
 * 先读取当前授权额度，低于本次所需才写 approve；未连接钱包直接抛阻断。
 * 授权已足够时返回 null，表示无需写交易。
 *
 * @param wallet 当前钱包
 * @param token 代币合约地址
 * @param spender 被授权方（兑换路由器 / 质押池等）
 * @param amountIn 本次需要的授权额度
 * @returns 已发起 approve 的交易结果；额度已够时返回 null
 */
export async function approveErc20IfNeeded({
  wallet,
  token,
  spender,
  amountIn,
}: {
  wallet: Wallet
  token: `0x${string}`
  spender: `0x${string}`
  amountIn: bigint
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }

  const readClient = createWalletReadClient(wallet)
  const allowance = await readErc20Allowance(token, account.address, spender, readClient)
  if (allowance >= amountIn) return null

  return writeContractViaWallet({
    wallet,
    address: token,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [spender, amountIn],
  })
}
