import type { SeasonOption } from '~/app/components/season-selector'
import { formatPhaseDate, isPhaseActive, type PresalePhaseOnChain } from '~/lib/presale/presale-math'

function formatPhaseDateRange(startTime: bigint, endTime: bigint): string {
  return `${formatPhaseDate(startTime)} – ${formatPhaseDate(endTime)}`
}

export function buildSeasonOptions(
  phases: PresalePhaseOnChain[],
  agxPriceUsd: number,
  nowSeconds = Math.floor(Date.now() / 1000),
): SeasonOption[] {
  return phases.map((phase, index) => {
    const discountBps = Number(phase.discountBps)
    const discountPct = (discountBps / 100).toFixed(0)
    const effectivePrice = agxPriceUsd > 0 ? agxPriceUsd * (1 - discountBps / 10_000) : 0
    const active = isPhaseActive(phase, nowSeconds)
    const ended = nowSeconds > Number(phase.endTime)
    const airdropBps = Number(phase.airdropValueRatio > 0n ? phase.airdropValueRatio : 0n)
    const airdrop = airdropBps > 0 ? `+${(airdropBps / 100).toFixed(0)}%` : '—'

    return {
      name: `Season ${index + 1}`,
      status: active ? 'LIVE' : ended ? 'Ended' : 'Upcoming',
      active,
      discount: `${discountPct}% off`,
      desktopMeta: {
        discount: `-${discountPct}%`,
        airdrop,
      },
      price:
        effectivePrice > 0
          ? `≈ $${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(effectivePrice)}`
          : '—',
      date: formatPhaseDateRange(phase.startTime, phase.endTime),
    }
  })
}
