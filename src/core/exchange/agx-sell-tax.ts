/** AGX sell-tax helpers — handbook `contracts/agx.md` (sellRatio / extraSellBP / crash fuse). */

import { BPS_DENOM, BPS_DENOM_NUMBER } from '~/core/exchange/bps'

/**
 * Effective sell-tax bps for a non-whitelist transfer into the AGX pair.
 * Fuse on → defense tax; else base `sellRatio`.
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

/** Gross sell amount → amount that arrives in the pair after sell tax. */
export function applyAgxSellTaxToAmountIn(amountIn: bigint, taxBps: number): bigint {
  if (taxBps < 0 || taxBps >= BPS_DENOM_NUMBER) {
    throw new Error(`Invalid AGX sell tax bps: ${taxBps}`)
  }
  if (amountIn <= 0n || taxBps === 0) return amountIn
  return (amountIn * BigInt(BPS_DENOM_NUMBER - taxBps)) / BPS_DENOM
}

/** True when Trade path sells AGX into the pool (fee-on-transfer sell). */
export function isAgxSellPath(tokenIn: `0x${string}`, agx: `0x${string}`): boolean {
  return tokenIn.toLowerCase() === agx.toLowerCase()
}
