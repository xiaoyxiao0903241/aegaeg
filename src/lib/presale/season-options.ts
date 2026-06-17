import type { SeasonOption } from '~/app/components/season-selector'
import { PRESALE_CONFIG } from '~/config/presale'
import { formatPhaseDate, isPhaseActive, type PresalePhaseOnChain } from '~/lib/presale/presale-math'

export const AIRDROP_BY_PHASE = ['+5%', '+2%', '+1%'] as const

export function getAirdropLabelForPhase(phaseIndex: number): string {
  return AIRDROP_BY_PHASE[phaseIndex] ?? '+1%'
}

function formatPhaseDateRange(startTime: bigint, endTime: bigint): string {
  return `${formatPhaseDate(startTime)} – ${formatPhaseDate(endTime)}`
}

export function buildSeasonOptions(
  phases: PresalePhaseOnChain[],
  agxPriceUsd = Number(PRESALE_CONFIG.agxPriceUsd),
  nowSeconds = Math.floor(Date.now() / 1000),
): SeasonOption[] {
  return phases.map((phase, index) => {
    const discountBps = Number(phase.discountBps)
    const discountPct = (discountBps / 100).toFixed(0)
    const effectivePrice = agxPriceUsd * (1 - discountBps / 10_000)
    const active = isPhaseActive(phase, nowSeconds)
    const ended = nowSeconds > Number(phase.endTime)
    const airdrop = AIRDROP_BY_PHASE[index] ?? '+1%'

    return {
      name: `Season ${index + 1}`,
      status: active ? 'LIVE' : ended ? 'Ended' : 'Upcoming',
      active,
      discount: `${discountPct}% off`,
      desktopMeta: {
        discount: `-${discountPct}%`,
        airdrop,
      },
      price: `≈ $${effectivePrice.toFixed(2)}`,
      date: formatPhaseDateRange(phase.startTime, phase.endTime),
    }
  })
}

export function calcActivePhaseProgressPercent(
  phase: PresalePhaseOnChain | null | undefined,
): number {
  if (!phase || phase.maxAmount === 0n) return 0
  const ratio = Number(phase.purchasedAmount) / Number(phase.maxAmount)
  if (!Number.isFinite(ratio)) return 0
  return Math.min(100, Math.max(0, Math.round(ratio * 100)))
}
