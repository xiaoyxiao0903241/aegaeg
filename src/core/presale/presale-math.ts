import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'

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
}

export interface PresalePhaseRemaining {
  remainingPhaseAmount: bigint
  remainingUserAmount: bigint
  userPurchaseLimit: bigint
  userPhaseAmountCurrent: bigint
}

const USD1_DECIMALS = 18

export { USD1_DECIMALS }

/** Phase inventory left from `phases()` fields; never negative when sold ≫ max. */
export function remainingPhaseAmount(
  phaseRemaining: PresalePhaseRemaining | null | undefined,
  activePhase: PresalePhaseOnChain | null | undefined,
): bigint {
  if (phaseRemaining) {
    return phaseRemaining.remainingPhaseAmount
  }

  if (!activePhase) return 0n
  if (activePhase.soldAmount >= activePhase.maxAmount) return 0n
  return activePhase.maxAmount - activePhase.soldAmount
}

/**
 * 计算用户本期剩余可购金额。
 * `userPurchaseLimit == 0n` 表示不限制，用户剩余等于本期剩余。
 * 无 `getUserPhaseRemainingAmount` 时无法扣减已购，fail-closed 返回 0。
 */
export function remainingUserAmount(
  phaseRemaining: PresalePhaseRemaining | null | undefined,
  activePhase: PresalePhaseOnChain | null | undefined,
  fallbackMaxAmount: bigint,
): bigint {
  if (phaseRemaining) {
    return phaseRemaining.userPurchaseLimit === 0n
      ? phaseRemaining.remainingPhaseAmount
      : phaseRemaining.remainingUserAmount
  }

  if (activePhase) {
    if (activePhase.userPurchaseLimit > 0n) return 0n
    return remainingPhaseAmount(null, activePhase)
  }

  return fallbackMaxAmount
}

/** One share equals the phase min purchase amount on-chain (typically 100 USD1). */
export function sharePriceWei(phase: PresalePhaseOnChain | null | undefined): bigint {
  if (phase?.minAmount && phase.minAmount > 0n) {
    return phase.minAmount
  }
  return 0n
}

/** 份额上限 = min(本期剩余, 用户剩余, 余额可购份数)。 */
export function genesisMaxShares({
  sharePriceWei,
  remainingPhaseAmount,
  remainingUserAmount,
  usd1Balance = 0n,
  walletReady = false,
}: {
  sharePriceWei: bigint
  remainingPhaseAmount: bigint
  remainingUserAmount: bigint
  usd1Balance?: bigint
  walletReady?: boolean
}): number {
  if (sharePriceWei === 0n) return 0

  const maxPurchasableWei =
    remainingPhaseAmount < remainingUserAmount ? remainingPhaseAmount : remainingUserAmount

  const caps = [Number(maxPurchasableWei / sharePriceWei)]

  if (walletReady) {
    caps.push(Number(usd1Balance / sharePriceWei))
  }

  return Math.max(0, Math.min(...caps))
}

/**
 * Clamp draft share count against maxShares for display / submit.
 * Empty draft (0) stays 0; when maxShares is 0, force 0 (fail-closed).
 * S6 may tighten vs legacy effect (which early-returned when maxShares≤0).
 */
export function clampGenesisShares(shares: number, maxShares: number): number {
  if (maxShares <= 0 || shares <= 0) return 0
  return Math.min(Math.max(shares, 1), maxShares)
}

/** Controlled input mirror of numeric shares (empty when zero). */
export function formatGenesisSharesText(shares: number): string {
  return shares === 0 ? '' : String(shares)
}

/** Genesis purchase submit check (chain + draft). Bind + pause are fail-closed. */
export function canPurchaseGenesis({
  walletReady,
  hasActivePhase,
  isBound,
  isPaused = false,
  maxShares,
  shares,
  purchaseAmount,
  minAmount,
  maxPurchasableWei,
}: {
  walletReady: boolean
  hasActivePhase: boolean
  /** Only `true` may purchase; `false` / loading must not open the CTA. */
  isBound: boolean
  /** On-chain `paused()` — when true, block before the wallet prompt. */
  isPaused?: boolean
  maxShares: number
  shares: number
  purchaseAmount: bigint
  minAmount: bigint
  maxPurchasableWei: bigint
}): boolean {
  return (
    walletReady &&
    hasActivePhase &&
    isBound &&
    !isPaused &&
    maxShares > 0 &&
    shares >= 1 &&
    shares <= maxShares &&
    purchaseAmount >= minAmount &&
    purchaseAmount <= maxPurchasableWei
  )
}

/** Genesis：approve 后二次门闸（绑定 / 暂停）。 */
export type GenesisPostApprove = { ok: true } | { ok: false; reason: 'not_bound' | 'unavailable' }

export function evaluateGenesisPostApprove({
  isBound,
  isPaused,
  isPausedUnknown,
}: {
  isBound: boolean | undefined
  isPaused: boolean
  isPausedUnknown: boolean
}): GenesisPostApprove {
  if (isBound !== true) return { ok: false, reason: 'not_bound' }
  if (isPaused || isPausedUnknown) return { ok: false, reason: 'unavailable' }
  return { ok: true }
}

/** Genesis：live 阶段/用户剩余是否仍覆盖拟购金额。 */
export function evaluateGenesisPurchaseAmountLive(args: {
  purchaseAmount: bigint
  remainingPhaseAmount: bigint
  remainingUserAmount: bigint
}): boolean {
  if (args.purchaseAmount <= 0n) return false
  return (
    args.purchaseAmount <= args.remainingPhaseAmount &&
    args.purchaseAmount <= args.remainingUserAmount
  )
}

export function isPhaseActive(
  phase: PresalePhaseOnChain,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  const now = BigInt(nowSeconds)
  return now >= phase.startTime && now <= phase.endTime
}

export function findActivePresalePhase(
  phases: readonly PresalePhaseOnChain[],
  nowSeconds = Math.floor(Date.now() / 1000),
): PresalePhaseOnChain | null {
  return phases.find((phase) => isPhaseActive(phase, nowSeconds)) ?? null
}

export type PhaseCountdownMode = 'starts' | 'ends'

export function phaseCountdownKey(
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

export function phaseCountdownTarget(
  phases: readonly PresalePhaseOnChain[],
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

export type PhaseCountdownUnits = {
  days: string
  hours: string
  minutes: string
}

export const DEFAULT_PHASE_COUNTDOWN_UNITS: PhaseCountdownUnits = {
  days: 'd',
  hours: 'h',
  minutes: 'm',
}

export function formatPhaseCountdown(
  targetTime: bigint,
  nowSeconds = Math.floor(Date.now() / 1000),
  units: PhaseCountdownUnits = DEFAULT_PHASE_COUNTDOWN_UNITS,
): string {
  const remaining = Number(targetTime) - nowSeconds
  if (remaining <= 0) {
    return `0${units.days} ${String(0).padStart(2, '0')}${units.hours} ${String(0).padStart(2, '0')}${units.minutes}`
  }

  const days = Math.floor(remaining / 86_400)
  const hours = Math.floor((remaining % 86_400) / 3_600)
  const minutes = Math.floor((remaining % 3_600) / 60)

  return `${days}${units.days} ${String(hours).padStart(2, '0')}${units.hours} ${String(minutes).padStart(2, '0')}${units.minutes}`
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

/** Resolve presale phase discount bps by API/contract phase index (0-based). */
export function phaseDiscountBps(
  phaseId: number,
  phases: ReadonlyArray<Pick<PresalePhaseOnChain, 'discountBps'>> = [],
): number {
  if (!Number.isFinite(phaseId) || phaseId < 0) return 0

  const chainPhase = phases[phaseId]
  if (!chainPhase) return 0

  const bps = Number(chainPhase.discountBps)
  return Number.isFinite(bps) && bps > 0 ? bps : 0
}

export function presaleAirdropThresholdToUsd(thresholdWei: bigint): number {
  if (thresholdWei <= 0n) return 0
  return formatTokenAmountToNumber(thresholdWei, USD1_DECIMALS)
}

export function getAirdropBpsForPhase(_phaseIndex: number, phase?: PresalePhaseOnChain): number {
  if (phase?.airdropValueRatio !== undefined && phase.airdropValueRatio > 0n) {
    return Number(phase.airdropValueRatio)
  }
  return 0
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

export function xTokenAirdropUsdForPurchase(
  periodContributedUsd: number,
  payUsd1: number,
  phaseIndex: number,
  minPeriodUsd: number,
  phase?: PresalePhaseOnChain,
): number {
  const periodTotalUsd = periodContributedUsd + payUsd1
  if (minPeriodUsd <= 0 || periodTotalUsd < minPeriodUsd || payUsd1 <= 0) return 0
  return estimateXTokenAirdropUsd(payUsd1, phaseIndex, phase)
}
