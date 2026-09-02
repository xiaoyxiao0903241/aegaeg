import type { Wallet } from 'thirdweb/wallets'

import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { WALLET_BLOCKED } from '~/web3/errors/sentinels'
import { approveErc20IfNeeded } from '~/web3/exchange/approve-erc20-if-needed'
import { marketSwapWriteCall } from '~/web3/exchange/market-swap-write-call'
import { writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

export { marketSwapWriteCall }

/** 路由器授权额度低于本次所需时返回 true，需在兑换前补 approve。 */
export function needsTokenApproval(allowance: bigint, amountIn: bigint): boolean {
  return allowance < amountIn
}

/** 输入代币 → 兑换路由器授权：按需补 approve。 */
export async function approveTokenIfNeeded({
  wallet,
  token,
  amountIn,
}: {
  wallet: Wallet
  token: `0x${string}`
  amountIn: bigint
}) {
  return approveErc20IfNeeded({
    wallet,
    token,
    spender: EXCHANGE_CONFIG.router,
    amountIn,
  })
}

/**
 * 提交市价兑换
 *
 * 走 Pancake Router；AGX / X 卖币路径扣卖税，须用带费率转移支持的
 * `swapExactTokensForTokensSupportingFeeOnTransferTokens`。
 * 路径少于两跳或输入代币缺失时直接抛错，杜绝用非法路径发交易。
 *
 * @param wallet 当前钱包
 * @param amountIn 输入代币数量
 * @param path 兑换路径，直连两跳或经中间币三跳，须与实时报价路径一致
 * @param amountOutMin 授权后实时重算的最低输出下限，不在本函数内重算
 * @see docs/onchain-manual/contracts/agx.md
 * @see docs/onchain-manual/contracts/xtoken.md
 */
export async function exchangeTokens({
  wallet,
  amountIn,
  path,
  amountOutMin,
}: {
  wallet: Wallet
  amountIn: bigint
  /** 直连（2）或经中间币（3）跳，须与实时报价路径一致。 */
  path: readonly `0x${string}`[]
  /** 授权后实时重算的最低输出下限，不在本函数内重算。 */
  amountOutMin: bigint
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }

  const write = marketSwapWriteCall({
    amountIn,
    path,
    amountOutMin,
    recipient: account.address as `0x${string}`,
  })

  return writeContractViaWallet({
    wallet,
    address: write.address,
    abi: write.abi,
    functionName: write.functionName,
    args: write.args,
  })
}
