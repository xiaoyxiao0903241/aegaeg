import { getAddress } from 'thirdweb/utils'
import { parseAbi } from 'viem'

import { exchangeDeadline } from '~/core/exchange/exchange-math'
import { requiresFeeOnTransferSwap } from '~/core/exchange/fee-on-transfer-swap'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { PANCAKE_ROUTER_V2_METHODS } from '~/web3/abis'

const exchangeRouterWriteAbi = parseAbi([
  PANCAKE_ROUTER_V2_METHODS.swapExactTokensForTokens,
  PANCAKE_ROUTER_V2_METHODS.swapExactTokensForTokensSupportingFeeOnTransferTokens,
])

/**
 * 组装市价兑换的 Router 写调用（提交与预估 Gas 共用）。
 *
 * AGX / X 卖出走 SupportingFeeOnTransfer；路径过短直接抛错。
 * 独立于 `exchange-write`，避免估 gas 经授权形成环。
 *
 * @param amountIn 卖出数量
 * @param path 兑换路径，须与报价一致
 * @param amountOutMin 滑点下限
 * @param recipient 收款地址
 * @param nowSeconds 当前 unix 秒；缺省取墙钟（测 deadline 时可注入）
 */
export function marketSwapWriteCall({
  amountIn,
  path,
  amountOutMin,
  recipient,
  nowSeconds,
}: {
  amountIn: bigint
  path: readonly `0x${string}`[]
  amountOutMin: bigint
  recipient: `0x${string}`
  nowSeconds?: number
}) {
  if (path.length < 2) {
    throw new Error(`EXCHANGE_PATH_TOO_SHORT:${path.length}`)
  }
  const tokenIn = path[0]
  if (tokenIn === undefined) {
    throw new Error('EXCHANGE_PATH_TOO_SHORT:0')
  }

  const deadline = BigInt(exchangeDeadline(EXCHANGE_CONFIG.deadlineSeconds, nowSeconds))
  const functionName = requiresFeeOnTransferSwap(tokenIn, {
    agx: BSC_CONTRACTS.agx,
    x: BSC_CONTRACTS.xToken,
  })
    ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
    : 'swapExactTokensForTokens'

  return {
    address: EXCHANGE_CONFIG.router,
    abi: exchangeRouterWriteAbi,
    functionName,
    args: [amountIn, amountOutMin, [...path], getAddress(recipient), deadline] as const,
  }
}
