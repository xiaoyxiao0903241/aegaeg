/**
 * Absolute spot→quote price move in basis points for Uniswap/Pancake V3.
 * Pool price P ∝ (sqrtPriceX96)², so impact is |ΔP|/P — not |Δ√P|/√P.
 */
export function calcPriceImpactBps(sqrtPriceBefore: bigint, sqrtPriceAfter: bigint): number {
  if (sqrtPriceBefore === 0n) return 0

  const priceBefore = sqrtPriceBefore * sqrtPriceBefore
  const priceAfter = sqrtPriceAfter * sqrtPriceAfter
  const diff = priceAfter >= priceBefore ? priceAfter - priceBefore : priceBefore - priceAfter

  const bps = Number((diff * 10000n) / priceBefore)
  return Number.isFinite(bps) ? bps : 0
}

/** Default warning threshold (1% true price impact). */
export const HIGH_EXCHANGE_PRICE_IMPACT_BPS = 100
