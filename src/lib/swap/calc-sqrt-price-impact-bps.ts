/**
 * Absolute sqrtPriceX96 move vs pool spot, in basis points.
 * Per product doc: large gap between slot0 and quote sqrtPriceX96After ⇒ high impact.
 */
export function calcSqrtPriceImpactBps(
  sqrtPriceBefore: bigint,
  sqrtPriceAfter: bigint,
): number {
  if (sqrtPriceBefore === 0n) return 0

  const diff =
    sqrtPriceAfter >= sqrtPriceBefore
      ? sqrtPriceAfter - sqrtPriceBefore
      : sqrtPriceBefore - sqrtPriceAfter

  const bps = Number((diff * 10000n) / sqrtPriceBefore)
  return Number.isFinite(bps) ? bps : 0
}

/** Default warning threshold (1%) for trade-size price impact. */
export const HIGH_SWAP_PRICE_IMPACT_BPS = 100
