/** Usd1Swap submit gates from handbook `getConfig` (no UI invented). */
export type FlashUsd1SwapConfig = {
  rateBps: bigint
  usdtDec: number
  usd1Dec: number
  isPaused: boolean
  minIn: bigint
  maxIn: bigint
  reserve: bigint
}

export type FlashUsd1SwapGateReason =
  'paused' | 'belowMin' | 'aboveMax' | 'insufficientReserve' | 'zeroRate'

export function resolveFlashUsd1SwapGate(args: {
  amountIn: bigint
  quotedOut: bigint
  config: FlashUsd1SwapConfig | null | undefined
}): FlashUsd1SwapGateReason | null {
  const { amountIn, quotedOut, config } = args
  if (!config) return null
  if (config.isPaused) return 'paused'
  if (config.rateBps === 0n) return 'zeroRate'
  if (config.minIn > 0n && amountIn < config.minIn) return 'belowMin'
  if (config.maxIn > 0n && amountIn > config.maxIn) return 'aboveMax'
  if (quotedOut > config.reserve) return 'insufficientReserve'
  return null
}

export function flashUsd1SwapGateBlocksSubmit(
  reason: FlashUsd1SwapGateReason | null | undefined,
): boolean {
  return reason != null
}
