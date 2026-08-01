import { BPS_DENOM, BPS_DENOM_NUMBER } from '~/core/exchange/bps'

/** Exchange quote math — slippage floor + swap deadline. */

export function calcAmountOutMin(quotedOut: bigint, slippageBps: number): bigint {
  if (slippageBps < 0 || slippageBps >= BPS_DENOM_NUMBER) {
    throw new Error(`Invalid slippage bps: ${slippageBps}`)
  }

  if (quotedOut <= 0n) return 0n

  const floored = (quotedOut * BigInt(BPS_DENOM_NUMBER - slippageBps)) / BPS_DENOM
  // Integer division can truncate a tiny quote to 0 under high slippage —
  // keep a 1-wei floor so the on-chain bound is never vacuous.
  return floored > 0n ? floored : 1n
}

export function exchangeDeadline(
  deadlineSeconds: number,
  nowSeconds = Math.floor(Date.now() / 1000),
): number {
  return nowSeconds + deadlineSeconds
}
