/**
 * X 卖出税（向 Pair 转账时扣税销毁）。
 *
 * 手册恒定 `SELL_TAX_BP = 2500`（25%）；非白名单卖出按此税率。
 * 报价用净额喂 `getAmountsOut`；写路径须 SupportingFeeOnTransfer。
 *
 * @see docs/onchain-manual/contracts/xtoken.md
 */

import { applyAgxSellTaxToAmountIn } from '~/core/exchange/agx-sell-tax'

/** X 卖出税（BPS）；与链上 `SELL_TAX_BP` 常量一致。 */
export const X_SELL_TAX_BP = 2500

/**
 * 判断路径是否向池子卖出 X（走卖出税）。
 *
 * @param tokenIn 输入代币地址
 * @param xToken X 合约地址
 */
export function isXSellPath(tokenIn: `0x${string}`, xToken: `0x${string}`): boolean {
  return tokenIn.toLowerCase() === xToken.toLowerCase()
}

/**
 * 毛卖出量 → 扣除 X 卖出税后实际进入池子的数量。
 *
 * @param amountIn 毛卖出量
 */
export function applyXSellTaxToAmountIn(amountIn: bigint): bigint {
  return applyAgxSellTaxToAmountIn(amountIn, X_SELL_TAX_BP)
}
