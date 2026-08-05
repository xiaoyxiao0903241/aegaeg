import { BPS_DENOM } from '~/core/exchange/bps'

/**
 * 债券认购的毛发放数量计算。
 *
 * 整除从左到右对齐 Solidity：value × 1e9 × 10000 ÷ agxPrice ÷ discountRateBP。
 * 任一入参为 0 时直接返回 0，避免除零。
 *
 * @param args.value 认购的 USD1 数量
 * @param args.agxPrice AGX 单价
 * @param args.discountRateBP 债券折扣率（BPS）
 * @returns 毛发放的债券数量；任一入参为 0 时返回 0n
 * @see docs/onchain-manual/contracts/bonddepository.md
 */
export function computeGrossBondPayout(args: {
  value: bigint
  agxPrice: bigint
  discountRateBP: bigint
}): bigint {
  const { value, agxPrice, discountRateBP } = args
  if (value === 0n || agxPrice === 0n || discountRateBP === 0n) return 0n
  // 对齐 Solidity 左结合整除：value × 1e9 ÷ agxPrice × 10000 ÷ discountRateBP
  return (((value * 1_000_000_000n) / agxPrice) * BPS_DENOM) / discountRateBP
}

/**
 * 毛发放扣除手续费后的净发放数量。
 *
 * 手续费按 BPS 计；手续费率不低于 100%（BPS_DENOM）时无净发放。
 *
 * @param grossPayout 毛发放数量（债券数量）
 * @param feeBps 手续费率（BPS）
 * @returns 净发放数量；毛发放为 0 返回 0n，手续费率 ≥ 100% 返回 0n
 */
export function computeNetBondPayout(grossPayout: bigint, feeBps: bigint): bigint {
  if (grossPayout === 0n) return 0n
  if (feeBps === 0n) return grossPayout
  if (feeBps >= BPS_DENOM) return 0n
  const fee = (grossPayout * feeBps) / BPS_DENOM
  return grossPayout > fee ? grossPayout - fee : 0n
}

/**
 * Uniswap V2 在池已有储备时的铸币流动性数量。
 *
 * 两侧分别按储备比例估算可得的流动性，取较小者，保证不会超额铸币。
 *
 * @param args.amountA 代币 A 投入数量
 * @param args.amountB 代币 B 投入数量
 * @param args.reserveA 池中代币 A 储备
 * @param args.reserveB 池中代币 B 储备
 * @param args.totalSupply 池 LP 总供应量
 * @returns 应铸的 LP 数量；任一储备或总供应为 0 时返回 0n
 */
export function quoteV2LpMintAmount(args: {
  amountA: bigint
  amountB: bigint
  reserveA: bigint
  reserveB: bigint
  totalSupply: bigint
}): bigint {
  const { amountA, amountB, reserveA, reserveB, totalSupply } = args
  if (totalSupply === 0n || reserveA === 0n || reserveB === 0n) return 0n
  const liqA = (amountA * totalSupply) / reserveA
  const liqB = (amountB * totalSupply) / reserveB
  return liqA < liqB ? liqA : liqB
}

/**
 * 按百分比滑点缩减数量。
 *
 * @param amount 原始数量
 * @param slippagePercent 滑点百分比（0–100）
 * @returns 缩减后的数量；滑点 ≥ 100% 时返回 0n
 */
export function applyPercentSlippage(amount: bigint, slippagePercent: bigint): bigint {
  if (amount === 0n) return 0n
  if (slippagePercent >= 100n) return 0n
  return (amount * (100n - slippagePercent)) / 100n
}
