/**
 * AGX 卖出税相关辅助函数（sellRatio / extraSellBP / 价格熔断 / 单区块额度）。
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

function assertAgxSellTaxBps(raw: bigint): number {
  if (raw < 0n || raw >= BPS_DENOM) {
    throw new Error(`AGX_SELL_TAX_BPS_OUT_OF_RANGE:${raw}`)
  }
  return Number(raw)
}

/**
 * 有效卖出税（BPS）。
 *
 * - 额度观测块 ≠ 当前块 → 按防御税率 extraSellBP 处理（陈旧额度不可信）
 * - 同块且 `nextGross > blockSellLimit`，或 `blockSellLimit === 0 && amountIn > 0` → extraSellBP
 * - 否则按熔断选 fuse/sellRatio
 *
 * @see docs/onchain-manual/contracts/agx.md § 单区块额度
 */
export function effectiveAgxSellTaxBps(args: {
  crashFuseActive: boolean
  sellRatio: bigint
  extraSellBP: bigint
  amountIn: bigint
  blockSellLimit: bigint
  grossSoldInBlock: bigint
  blockSellQuotaBlock: bigint
  currentBlock: bigint
}): number {
  if (args.blockSellQuotaBlock !== args.currentBlock) {
    return assertAgxSellTaxBps(args.extraSellBP)
  }

  const nextGross = args.grossSoldInBlock + args.amountIn
  const overBlockLimit =
    nextGross > args.blockSellLimit || (args.blockSellLimit === 0n && args.amountIn > 0n)
  if (overBlockLimit) {
    return assertAgxSellTaxBps(args.extraSellBP)
  }

  return agxSellTaxBps({
    crashFuseActive: args.crashFuseActive,
    sellRatio: args.sellRatio,
    extraSellBP: args.extraSellBP,
  })
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
