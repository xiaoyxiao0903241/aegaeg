import type { Wallet } from 'thirdweb/wallets'

import { ERC20_ERRORS, ERC20_METHODS } from '~/web3/abis'
import { createWalletReadClient } from '~/web3/bsc-read-client'
import { WALLET_BLOCKED } from '~/web3/errors/sentinels'
import { readErc20Allowance } from '~/web3/exchange/exchange-read'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve, ERC20_ERRORS)

type ApproveErc20Args = {
  wallet: Wallet
  token: `0x${string}`
  spender: `0x${string}`
  amountIn: bigint
}

/**
 * 发出 ERC20 approve 并等待确认。
 *
 * 调用方须已判定额度不足；本函数不再读 allowance。
 * 本笔 hash 只在本函数调用栈里 wait，不进入业务写。
 *
 * @param wallet 当前钱包
 * @param token 代币合约地址
 * @param spender 被授权方（兑换路由器 / 质押池等）
 * @param amountIn 本次需要的授权额度
 * @returns 已确认的 approve 回执
 */
export async function approveErc20({ wallet, token, spender, amountIn }: ApproveErc20Args) {
  const account = wallet.getAccount()
  if (!account) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }

  return writeContractViaWallet({
    wallet,
    address: token,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [spender, amountIn],
  })
}

/**
 * 授权不足时按需发起 ERC20 approve
 *
 * 先读取当前授权额度，低于本次所需才写 approve；未连接钱包直接抛阻断。
 * 供预检不看额度的路径（闪兑 / 市价 / 销毁）做一次判定。
 *
 * @param wallet 当前钱包
 * @param token 代币合约地址
 * @param spender 被授权方（兑换路由器 / 质押池等）
 * @param amountIn 本次需要的授权额度
 * @returns 已确认的 approve 回执；额度已够时返回 null
 */
export async function approveErc20IfNeeded({ wallet, token, spender, amountIn }: ApproveErc20Args) {
  const account = wallet.getAccount()
  if (!account) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }

  const readClient = createWalletReadClient(wallet)
  const allowance = await readErc20Allowance(token, account.address, spender, readClient)
  if (allowance >= amountIn) return null

  return approveErc20({ wallet, token, spender, amountIn })
}
