export interface PresalePhaseOnChain {
  index: number
  minAmount: bigint
  maxAmount: bigint
  discountBps: bigint
  startTime: bigint
  endTime: bigint
  purchasedAmount: bigint
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
  if (remaining <= 0) return '0D 00H 00M 00S'

  const days = Math.floor(remaining / 86_400)
  const hours = Math.floor((remaining % 86_400) / 3_600)
  const minutes = Math.floor((remaining % 3_600) / 60)
  const seconds = remaining % 60

  return `${days}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M ${String(seconds).padStart(2, '0')}S`
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
