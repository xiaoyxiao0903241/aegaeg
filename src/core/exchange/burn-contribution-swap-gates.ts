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

/**
 * Hub / marketing ratio `1:6` from on-chain `rateBps`.
 * Exact when rateBps % 10000 === 0; otherwise decimal (trim trailing zeros).
 */
export function formatBurnContributionRatioColon(rateBps: bigint): string {
  if (rateBps === 0n) return '—'
  if (rateBps % 10000n === 0n) {
    return `1:${(rateBps / 10000n).toString()}`
  }
  const whole = rateBps / 10000n
  const frac = rateBps % 10000n
  const fracStr = frac.toString().padStart(4, '0').replace(/0+$/, '')
  return fracStr.length > 0 ? `1:${whole.toString()}.${fracStr}` : `1:${whole.toString()}`
}
