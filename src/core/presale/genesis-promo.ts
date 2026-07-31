import type { PresalePhaseOnChain } from '~/core/presale/presale-math'
import { formatPhaseDate } from '~/core/presale/presale-math'
import { buildSeasonOptions } from '~/core/presale/genesis-season-options'
import type { GenesisPromoSnapshot, GenesisPromoStatus } from '~/core/presale/genesis-promo-types'

export type { GenesisPromoSnapshot, GenesisPromoStatus } from '~/core/presale/genesis-promo-types'

function resolveFeaturedPhaseIndex(
  phases: PresalePhaseOnChain[],
  activePhase: PresalePhaseOnChain | null,
  nowSeconds: number,
): number {
  if (activePhase) {
    return activePhase.index
  }

  const upcomingIndex = phases.findIndex((phase) => Number(phase.startTime) > nowSeconds)
  if (upcomingIndex >= 0) {
    return upcomingIndex
  }

  const lastEndedIndex = phases.reduce((latest, phase, index) => {
    if (nowSeconds > Number(phase.endTime)) {
      return index
    }
    return latest
  }, -1)

  if (lastEndedIndex >= 0) {
    return lastEndedIndex
  }

  return 0
}

export function buildGenesisPromoSnapshot(
  phases: PresalePhaseOnChain[],
  activePhase: PresalePhaseOnChain | null,
  agxPriceUsd: number,
  nowSeconds = Math.floor(Date.now() / 1000),
): GenesisPromoSnapshot | null {
  if (phases.length === 0) {
    return null
  }

  const seasonOptions = buildSeasonOptions(phases, agxPriceUsd, nowSeconds)
  const featuredIndex = resolveFeaturedPhaseIndex(phases, activePhase, nowSeconds)
  const featured = seasonOptions[featuredIndex]
  if (!featured) {
    return null
  }

  const phase = phases[featuredIndex]
  if (!phase) return null

  return {
    season: featuredIndex + 1,
    discount: featured.desktopMeta.discount,
    status: featured.status as GenesisPromoStatus,
    dateRange: featured.date,
    endDate: formatPhaseDate(phase.endTime),
    startDate: formatPhaseDate(phase.startTime),
  }
}

export function formatGenesisSeasonIntro(
  template: string,
  season: number,
  discount: string,
  isLoading = false,
): string {
  return template
    .replaceAll('{season}', String(season))
    .replaceAll('{discount}', isLoading ? '…' : discount)
}
