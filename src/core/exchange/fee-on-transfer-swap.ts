/**
 * 市价兑换是否须走 SupportingFeeOnTransfer 路由。
 *
 * AGX / X 卖出均扣转账税，普通 `swapExactTokensForTokens` 会因到池数量不足回滚。
 *
 * @see docs/onchain-manual/contracts/agx.md
 * @see docs/onchain-manual/contracts/xtoken.md
 */

import { isAgxSellPath } from '~/core/exchange/agx-sell-tax'
import { isXSellPath } from '~/core/exchange/x-sell-tax'

/**
 * @param tokenIn 路径首币（卖出侧）
 * @param addresses AGX / X 合约地址
 */
export function requiresFeeOnTransferSwap(
  tokenIn: `0x${string}`,
  addresses: { agx: `0x${string}`; x: `0x${string}` },
): boolean {
  return isAgxSellPath(tokenIn, addresses.agx) || isXSellPath(tokenIn, addresses.x)
}
