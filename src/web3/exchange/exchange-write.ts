import { getAddress } from 'thirdweb/utils'
import type { Wallet } from 'thirdweb/wallets'
import { parseAbi } from 'viem'

import { exchangeDeadline } from '~/core/exchange/exchange-math'
import { requiresFeeOnTransferSwap } from '~/core/exchange/fee-on-transfer-swap'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { PANCAKE_ROUTER_V2_METHODS } from '~/web3/abis'
import { WALLET_BLOCKED } from '~/web3/errors/sentinels'
import { approveErc20IfNeeded } from '~/web3/exchange/approve-erc20-if-needed'
import { writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const exchangeRouterWriteAbi = parseAbi([
  PANCAKE_ROUTER_V2_METHODS.swapExactTokensForTokens,
  PANCAKE_ROUTER_V2_METHODS.swapExactTokensForTokensSupportingFeeOnTransferTokens,
])

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
  if (path.length < 2) {
    throw new Error(`EXCHANGE_PATH_TOO_SHORT:${path.length}`)
  }
  const tokenIn = path[0]
  if (tokenIn === undefined) {
    throw new Error('EXCHANGE_PATH_TOO_SHORT:0')
  }

  const deadline = BigInt(exchangeDeadline(EXCHANGE_CONFIG.deadlineSeconds))
  // AGX / X 卖币路径扣卖税，须走带费率转移支持的路径
  const functionName = requiresFeeOnTransferSwap(tokenIn, {
    agx: BSC_CONTRACTS.agx,
    x: BSC_CONTRACTS.xToken,
  })
    ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
    : 'swapExactTokensForTokens'

  return writeContractViaWallet({
    wallet,
    address: EXCHANGE_CONFIG.router,
    abi: exchangeRouterWriteAbi,
    functionName,
    args: [amountIn, amountOutMin, [...path], getAddress(account.address), deadline],
  })
}
