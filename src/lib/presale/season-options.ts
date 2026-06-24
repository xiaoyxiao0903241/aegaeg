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
    const airdropBps = Number(phase.airdropValueRatio > 0n ? phase.airdropValueRatio : 0n)
    const airdrop =
      airdropBps > 0
        ? `+${(airdropBps / 100).toFixed(0)}%`
        : (AIRDROP_BY_PHASE[index] ?? '+1%')

    return {
      name: `Season ${index + 1}`,
      status: active ? 'LIVE' : ended ? 'Ended' : 'Upcoming',
      active,
      discount: `${discountPct}% off`,
      desktopMeta: {
        discount: `-${discountPct}%`,
        airdrop,
      },
      price: `≈ $${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(effectivePrice)}`,
      date: formatPhaseDateRange(phase.startTime, phase.endTime),
    }
  })
}
