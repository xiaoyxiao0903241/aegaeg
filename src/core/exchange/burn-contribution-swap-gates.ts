import { formatTokenAmount } from '~/core/exchange/token-amount'

/** AgxContributionSwap submit gates from handbook `getConfig` (no UI invented). */
export type BurnContributionSwapConfig = {
  decimals: number
  rateBps: bigint
  isPaused: boolean
  minIn: bigint
  maxIn: bigint
  totalBurned: bigint
  totalContribution: bigint
}

export type BurnContributionSwapGateReason = 'paused' | 'belowMin' | 'aboveMax' | 'zeroRate'

export function resolveBurnContributionSwapGate(args: {
  amountIn: bigint
  config: BurnContributionSwapConfig | null | undefined
}): BurnContributionSwapGateReason | null {
  const { amountIn, config } = args
  if (!config) return null
  if (config.isPaused) return 'paused'
  if (config.rateBps === 0n) return 'zeroRate'
  if (amountIn === 0n) return null
  if (config.minIn > 0n && amountIn < config.minIn) return 'belowMin'
  if (config.maxIn > 0n && amountIn > config.maxIn) return 'aboveMax'
  return null
}

export function burnContributionSwapGateBlocksSubmit(
  reason: BurnContributionSwapGateReason | null | undefined,
): boolean {
  return reason != null
}

/** `1 AGX = 6 贡献点数` from on-chain `rateBps` (contribution = agx * rateBps / 10000). */
export function formatBurnContributionRateLabel({
  rateBps,
  decimals,
  agxSymbol,
  pointsLabel,
  fractionDigits = 2,
}: {
  rateBps: bigint
  decimals: number
  agxSymbol: string
  pointsLabel: string
  fractionDigits?: number
}): string {
  if (rateBps === 0n) {
    return `1 ${agxSymbol} = — ${pointsLabel}`
  }

  const oneAgx = 10n ** BigInt(decimals)
  const pointsPerAgx = (oneAgx * rateBps) / 10000n
  const formatted = formatTokenAmount(pointsPerAgx, decimals, fractionDigits)

  return `1 ${agxSymbol} = ${formatted} ${pointsLabel}`
}
