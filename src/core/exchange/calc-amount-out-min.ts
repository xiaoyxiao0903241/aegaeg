export function calcAmountOutMin(quotedOut: bigint, slippageBps: number): bigint {
  if (slippageBps < 0 || slippageBps >= 10_000) {
    throw new Error(`Invalid slippage bps: ${slippageBps}`)
  }

  if (quotedOut <= 0n) return 0n

  const floored = (quotedOut * BigInt(10_000 - slippageBps)) / 10_000n
  // Integer division can truncate a tiny quote to 0 under high slippage —
  // keep a 1-wei floor so the on-chain bound is never vacuous.
  return floored > 0n ? floored : 1n
}
