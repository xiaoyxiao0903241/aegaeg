export function calcAmountOutMin(quotedOut: bigint, slippageBps: number): bigint {
  if (slippageBps < 0 || slippageBps >= 10_000) {
    throw new Error(`Invalid slippage bps: ${slippageBps}`)
  }

  return (quotedOut * BigInt(10_000 - slippageBps)) / 10_000n
}
