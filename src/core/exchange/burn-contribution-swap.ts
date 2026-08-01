import { BPS_DENOM } from '~/core/exchange/bps'
import { formatTokenAmount } from '~/core/exchange/token-amount'

/** AgxContributionSwap submit checks from handbook `getConfig` (no UI invented). */
export type BurnContributionSwapConfig = {
  decimals: number
  rateBps: bigint
  isPaused: boolean
  minIn: bigint
  maxIn: bigint
  totalBurned: bigint
  totalContribution: bigint
  /** Burn share of convert (`getSplitConfig.splitBps`); remainder injects LP. */
  splitBps: bigint
}

/** Format `splitBps` (0–10000) as a whole/decimal percent string for FAQ. */
export function formatBurnSplitPercent(splitBps: bigint): string {
  if (splitBps < 0n || splitBps > BPS_DENOM) {
    throw new Error(`BURN_SPLIT_BPS_OUT_OF_RANGE:${splitBps}`)
  }
  if (splitBps % 100n === 0n) return (splitBps / 100n).toString()
  const whole = splitBps / 100n
  const frac = (splitBps % 100n).toString().padStart(2, '0').replace(/0+$/, '')
  return `${whole.toString()}.${frac}`
}

export type BurnContributionSwapBlockReason = 'paused' | 'belowMin' | 'aboveMax' | 'zeroRate'

export function evaluateBurnContributionSwap(args: {
  amountIn: bigint
  config: BurnContributionSwapConfig | null | undefined
}): BurnContributionSwapBlockReason | null {
  const { amountIn, config } = args
  if (!config) return null
  if (config.isPaused) return 'paused'
  if (config.rateBps === 0n) return 'zeroRate'
  if (amountIn === 0n) return null
  if (config.minIn > 0n && amountIn < config.minIn) return 'belowMin'
  if (config.maxIn > 0n && amountIn > config.maxIn) return 'aboveMax'
  return null
}

export function burnContributionSwapBlocksSubmit(
  reason: BurnContributionSwapBlockReason | null | undefined,
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
  const pointsPerAgx = (oneAgx * rateBps) / BPS_DENOM
  const formatted = formatTokenAmount(pointsPerAgx, decimals, fractionDigits)

  return `1 ${agxSymbol} = ${formatted} ${pointsLabel}`
}

/**
 * Hub / marketing ratio `1:6` from on-chain `rateBps`.
 * Exact when rateBps % 10000 === 0; otherwise decimal (trim trailing zeros).
 */
export function formatBurnContributionRatioColon(rateBps: bigint): string {
  if (rateBps === 0n) return '0'
  if (rateBps % BPS_DENOM === 0n) {
    return `1:${(rateBps / BPS_DENOM).toString()}`
  }
  const whole = rateBps / BPS_DENOM
  const frac = rateBps % BPS_DENOM
  const fracStr = frac.toString().padStart(4, '0').replace(/0+$/, '')
  return fracStr.length > 0 ? `1:${whole.toString()}.${fracStr}` : `1:${whole.toString()}`
}
