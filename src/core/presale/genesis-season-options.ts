import type { SeasonOption } from '~/core/presale/genesis-promo-types'
import {
  formatPhaseDate,
  isPhaseActive,
  type PresalePhaseOnChain,
} from '~/core/presale/presale-math'

function formatApproxUsdPrice(value: number): string {
  return `≈ $${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatPhaseDateRange(startTime: bigint, endTime: bigint): string {
  return `${formatPhaseDate(startTime)} – ${formatPhaseDate(endTime)}`
}

export function seasonOptionsFromPhases(
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
      name: `Phase ${index + 1}`,
      status: active ? 'LIVE' : ended ? 'Ended' : 'Upcoming',
      active,
      discount: `${discountPct}% off`,
      desktopMeta: {
        discount: `-${discountPct}%`,
        airdrop,
      },
      price: effectivePrice > 0 ? formatApproxUsdPrice(effectivePrice) : '—',
      date: formatPhaseDateRange(phase.startTime, phase.endTime),
    }
  })
}
