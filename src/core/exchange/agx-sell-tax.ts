/**
 * AGX 卖出税相关辅助函数（sellRatio / extraSellBP / 价格熔断）。
 *
 * @see docs/onchain-manual/contracts/agx.md
 */

import { BPS_DENOM, BPS_DENOM_NUMBER } from '~/core/exchange/bps'

/**
 * 非白名单地址向 AGX 池转账时的实际卖出税（BPS）。
 *
 * 价格熔断激活时用防御税率 extraSellBP，否则用基础 sellRatio。
 * 税率越界直接抛错，避免以非法 BPS 继续交易。
 *
 * @param args.crashFuseActive 价格熔断是否激活
 * @param args.sellRatio 基础卖出税率（BPS）
 * @param args.extraSellBP 防御税率（BPS）
 * @returns 有效卖出税（BPS）
 * @see docs/onchain-manual/contracts/agx.md
 */
export function agxSellTaxBps(args: {
  crashFuseActive: boolean
  sellRatio: bigint
  extraSellBP: bigint
}): number {
  const raw = args.crashFuseActive ? args.extraSellBP : args.sellRatio
  if (raw < 0n || raw >= BPS_DENOM) {
    throw new Error(`AGX_SELL_TAX_BPS_OUT_OF_RANGE:${raw}`)
  }
  return Number(raw)
}

/**
 * 毛卖出量 → 扣除卖出税后实际进入池子的数量。
 *
 * @param amountIn 毛卖出量
 * @param taxBps 卖出税（BPS）
 * @returns 税后进入池子的数量；金额 ≤ 0 或税率为 0 时原样返回
 */
export function applyAgxSellTaxToAmountIn(amountIn: bigint, taxBps: number): bigint {
  if (taxBps < 0 || taxBps >= BPS_DENOM_NUMBER) {
    throw new Error(`Invalid AGX sell tax bps: ${taxBps}`)
  }
  if (amountIn <= 0n || taxBps === 0) return amountIn
  return (amountIn * BigInt(BPS_DENOM_NUMBER - taxBps)) / BPS_DENOM
}

/**
 * 判断交易路径是否向池子卖出 AGX（走代币转账税）。
 *
 * @param tokenIn 输入代币地址
 * @param agx AGX 合约地址
 * @returns 输入为 AGX 时返回 true
 */
export function isAgxSellPath(tokenIn: `0x${string}`, agx: `0x${string}`): boolean {
  return tokenIn.toLowerCase() === agx.toLowerCase()
}
