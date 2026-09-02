import { BPS_DENOM } from '~/core/exchange/bps'

/**
 * LP 债券毛发放：`value * 1e9 / agxPrice * 10000 / discountRateBP`。
 *
 * 整除从左到右对齐 Solidity `_payoutWithDiscount`。
 * 任一入参为 0 时直接返回 0，避免除零。
 *
 * @param args.value LP 估值（Treasury.valueOf / bondingCalculator.valuation，USD 口径）
 * @param args.agxPrice 池子价 `reserveU / reserveAGX`
 * @param args.discountRateBP 债券成交价率（BPS）
 * @returns 毛发放 AGX（9 位）；任一入参为 0 时返回 0n
 * @see docs/onchain-manual/01-frontend-integration-guide.md §10.6
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
 * BondDepository._getAgxPrice：池子即时价 `reserveU / reserveAGX`。
 *
 * @param reserveU 稳定币侧储备（USD1）
 * @param reserveAGX AGX 侧储备
 * @returns USD1-wei per AGX-wei；储备为 0 时返回 0n
 * @see docs/onchain-manual/01-frontend-integration-guide.md §10.6
 */
export function computeBondPoolAgxPrice(reserveU: bigint, reserveAGX: bigint): bigint {
  if (reserveU === 0n || reserveAGX === 0n) return 0n
  return reserveU / reserveAGX
}

/**
 * BondHelper zap 组 LP 的链下复算（手册 §10.6 方法二）。
 *
 * @returns 预估存入 BondDepository 的 LP 数量
 * @see docs/onchain-manual/01-frontend-integration-guide.md §10.6
 */
export function quoteZapLpAmount(args: {
  usd1Amount: bigint
  agxOut: bigint
  reserveU: bigint
  reserveAGX: bigint
  totalSupply: bigint
}): bigint {
  const { usd1Amount, agxOut, reserveU, reserveAGX, totalSupply } = args
  if (
    usd1Amount === 0n ||
    agxOut === 0n ||
    reserveU === 0n ||
    reserveAGX === 0n ||
    totalSupply === 0n
  ) {
    return 0n
  }
  const amountToSwap = usd1Amount / 2n
  const usdForLp = usd1Amount - amountToSwap
  const lpFromAgx = (agxOut * totalSupply) / reserveAGX
  const lpFromUsd = (usdForLp * totalSupply) / reserveU
  return lpFromAgx < lpFromUsd ? lpFromAgx : lpFromUsd
}

/**
 * BurnBond 毛发放：`agxAmount * 10000 / discountRateBP`。
 *
 * @see docs/onchain-manual/contracts/burnbonddepository.md
 */
export function computeBurnBondGrossPayout(agxAmount: bigint, discountRateBP: bigint): bigint {
  if (agxAmount === 0n || discountRateBP === 0n) return 0n
  return (agxAmount * BPS_DENOM) / discountRateBP
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
