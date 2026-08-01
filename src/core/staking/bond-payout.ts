import { BPS_DENOM } from '~/core/exchange/bps'

/**
 * Bond deposit payout math (manual bonddepository §deposit).
 * gross = value * 1e9 * 10000 / agxPrice / discountRateBP
 * fee = gross * feeBps / 10000
 * net = gross - fee
 */
export function computeGrossBondPayout(args: {
  value: bigint
  agxPrice: bigint
  discountRateBP: bigint
}): bigint {
  const { value, agxPrice, discountRateBP } = args
  if (value === 0n || agxPrice === 0n || discountRateBP === 0n) return 0n
  // Match Solidity left-assoc: value * 1e9 / agxPrice * 10000 / discountRateBP
  return (((value * 1_000_000_000n) / agxPrice) * BPS_DENOM) / discountRateBP
}

export function computeNetBondPayout(grossPayout: bigint, feeBps: bigint): bigint {
  if (grossPayout === 0n) return 0n
  if (feeBps === 0n) return grossPayout
  if (feeBps >= BPS_DENOM) return 0n
  const fee = (grossPayout * feeBps) / BPS_DENOM
  return grossPayout > fee ? grossPayout - fee : 0n
}

/** Uniswap V2 mint liquidity when pool already has reserves. */
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

export function applyPercentSlippage(amount: bigint, slippagePercent: bigint): bigint {
  if (amount === 0n) return 0n
  if (slippagePercent >= 100n) return 0n
  return (amount * (100n - slippagePercent)) / 100n
}
