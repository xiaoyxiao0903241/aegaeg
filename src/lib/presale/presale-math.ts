import { formatTokenAmount, parseTokenAmount } from '~/lib/swap/token-amount'
import { PRESALE_CONFIG } from '~/config/presale'

export interface PresalePhaseOnChain {
  index: number
  minAmount: bigint
  maxAmount: bigint
  discountBps: bigint
  airdropValueRatio: bigint
  startTime: bigint
  endTime: bigint
  soldAmount: bigint
  userPurchaseLimit: bigint
  /** @deprecated 使用 soldAmount */
  purchasedAmount: bigint
}

export interface PresalePhaseRemaining {
  remainingPhaseAmount: bigint
  remainingUserAmount: bigint
  userPurchaseLimit: bigint
  userPhaseAmountCurrent: bigint
}

const USD1_DECIMALS = 18

/** 份额上限 = min(本期剩余, 用户剩余, 余额可购份数)。 */
export function resolveGenesisMaxShares({
  sharePriceUsd1 = PRESALE_CONFIG.sharePriceUsd1,
  remainingPhaseAmount,
  remainingUserAmount,
  usd1Balance = 0n,
  walletReady = false,
}: {
  sharePriceUsd1?: string
  remainingPhaseAmount: bigint
  remainingUserAmount: bigint
  usd1Balance?: bigint
  walletReady?: boolean
}): number {
  const sharePriceWei = parseTokenAmount(sharePriceUsd1, USD1_DECIMALS)
  if (sharePriceWei === 0n) return 0

  const maxPurchasableWei =
    remainingPhaseAmount < remainingUserAmount
      ? remainingPhaseAmount
      : remainingUserAmount

  const caps = [Number(maxPurchasableWei / sharePriceWei)]

  if (walletReady) {
    caps.push(Number(usd1Balance / sharePriceWei))
  }

  return Math.max(0, Math.min(...caps))
}

export function isPhaseActive(phase: PresalePhaseOnChain, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  const now = BigInt(nowSeconds)
  return now >= phase.startTime && now <= phase.endTime
}

export function findActivePresalePhase(
  phases: PresalePhaseOnChain[],
  nowSeconds = Math.floor(Date.now() / 1000),
): PresalePhaseOnChain | null {
  return phases.find((phase) => isPhaseActive(phase, nowSeconds)) ?? null
}

export type PhaseCountdownMode = 'starts' | 'ends'

export function buildPhaseCountdownKey(
  target: { mode: PhaseCountdownMode; targetTime: bigint } | null,
): string | null {
  if (!target) return null
  return `${target.mode}:${target.targetTime.toString()}`
}

export function hasPhaseCountdownElapsed(
  targetTime: bigint,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  return nowSeconds >= Number(targetTime)
}

export function resolvePhaseCountdownTarget(
  phases: PresalePhaseOnChain[],
  nowSeconds = Math.floor(Date.now() / 1000),
): { mode: PhaseCountdownMode; targetTime: bigint } | null {
  const active = findActivePresalePhase(phases, nowSeconds)
  if (active) {
    return { mode: 'ends', targetTime: active.endTime }
  }

  const upcoming = phases
    .filter((phase) => Number(phase.startTime) > nowSeconds)
    .sort((left, right) => Number(left.startTime) - Number(right.startTime))[0]

  if (upcoming) {
    return { mode: 'starts', targetTime: upcoming.startTime }
  }

  return null
}

export function formatPhaseDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}.${day}`
}

export function formatPhaseCountdown(
  targetTime: bigint,
  nowSeconds = Math.floor(Date.now() / 1000),
): string {
  const remaining = Number(targetTime) - nowSeconds
  if (remaining <= 0) return '0D 00H 00M'

  const days = Math.floor(remaining / 86_400)
  const hours = Math.floor((remaining % 86_400) / 3_600)
  const minutes = Math.floor((remaining % 3_600) / 60)

  return `${days}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`
}

export function estimateAgxFromUsd1(
  amountUsd1: number,
  discountBps: number,
  agxPriceUsd: number,
): number {
  if (amountUsd1 <= 0 || agxPriceUsd <= 0) return 0

  const effectiveAgxPrice = agxPriceUsd * (1 - discountBps / 10_000)
  if (effectiveAgxPrice <= 0) return 0

  return amountUsd1 / effectiveAgxPrice
}

export const AIRDROP_BPS_BY_PHASE = [500, 200, 100] as const

/** Fallback when `AIRDROP_THRESHOLD` is unavailable — matches mainnet deployment. */
export const X_AIRDROP_MIN_PERIOD_USD = 5_000

export function presaleAirdropThresholdToUsd(thresholdWei: bigint): number {
  if (thresholdWei <= 0n) return X_AIRDROP_MIN_PERIOD_USD
  return Number(formatTokenAmount(thresholdWei, USD1_DECIMALS, 0))
}

export function getAirdropBpsForPhase(phaseIndex: number, phase?: PresalePhaseOnChain): number {
  if (phase?.airdropValueRatio !== undefined && phase.airdropValueRatio > 0n) {
    return Number(phase.airdropValueRatio)
  }
  return AIRDROP_BPS_BY_PHASE[phaseIndex] ?? 100
}

/** AGX amount at reference price — not the discounted purchase price. */
export function estimateContributionValueUsd(
  amountUsd1: number,
  discountBps: number,
  agxPriceUsd: number,
): number {
  const agx = estimateAgxFromUsd1(amountUsd1, discountBps, agxPriceUsd)
  return agx * agxPriceUsd
}

/** X token airdrop preview USD = purchase × on-chain `airdropValueRatio` (+5% / +2% / +1%). */
export function estimateXTokenAirdropUsd(
  amountUsd1: number,
  phaseIndex: number,
  phase?: PresalePhaseOnChain,
): number {
  if (amountUsd1 <= 0) return 0
  return amountUsd1 * (getAirdropBpsForPhase(phaseIndex, phase) / 10_000)
}

export function resolveXTokenAirdropUsdForPurchase(
  periodContributedUsd: number,
  payUsd1: number,
  phaseIndex: number,
  phase?: PresalePhaseOnChain,
): number {
  const periodTotalUsd = periodContributedUsd + payUsd1
  if (periodTotalUsd < X_AIRDROP_MIN_PERIOD_USD || payUsd1 <= 0) return 0
  return estimateXTokenAirdropUsd(payUsd1, phaseIndex, phase)
}
