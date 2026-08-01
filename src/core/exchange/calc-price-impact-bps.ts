import { BPS_DENOM } from '~/core/exchange/bps'

/**
 * V2 AMM price impact vs mid (no-fee) reserve ratio, in basis points.
 * Includes pool fee + size impact relative to `amountIn * reserveOut / reserveIn`.
 */
export function calcV2PriceImpactBps({
  amountIn,
  amountOut,
  reserveIn,
  reserveOut,
}: {
  amountIn: bigint
  amountOut: bigint
  reserveIn: bigint
  reserveOut: bigint
}): number {
  if (amountIn === 0n || amountOut === 0n || reserveIn === 0n || reserveOut === 0n) return 0

  const midOut = (amountIn * reserveOut) / reserveIn
  if (midOut === 0n) return 0

  const diff = midOut > amountOut ? midOut - amountOut : 0n
  const bps = Number((diff * BPS_DENOM) / midOut)
  return Number.isFinite(bps) ? bps : 0
}

/** Default warning threshold (1% price impact). */
export const HIGH_EXCHANGE_PRICE_IMPACT_BPS = 100
