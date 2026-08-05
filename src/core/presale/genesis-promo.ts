import type { GenesisPromoSnapshot, GenesisPromoStatus } from '~/core/presale/genesis-promo-types'
import { seasonOptionsFromPhases } from '~/core/presale/genesis-season-options'
import type { PresalePhaseOnChain } from '~/core/presale/presale-math'
import { formatPhaseDate } from '~/core/presale/presale-math'

export type { GenesisPromoSnapshot, GenesisPromoStatus } from '~/core/presale/genesis-promo-types'

function featuredPhaseIndex(
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

/**
 * 构建预售首页横幅快照。
 *
 * 先由各阶段生成季节选项，再按当前阶段（或最近的进行 / 已结束阶段）
 * 选定主推季节；无阶段时返回 null。
 *
 * @param phases 链上预售阶段
 * @param activePhase 当前进行中的阶段；null 表示无
 * @param agxPriceUsd AGX 参考价（美元）
 * @param nowSeconds 当前时间（unix 秒）
 * @returns 横幅快照；无阶段或主推缺失时返回 null
 * @see 手册 §6.3 展示字段
 */
export function genesisPromoSnapshot(
  phases: PresalePhaseOnChain[],
  activePhase: PresalePhaseOnChain | null,
  agxPriceUsd: number,
  nowSeconds = Math.floor(Date.now() / 1000),
): GenesisPromoSnapshot | null {
  if (phases.length === 0) {
    return null
  }

  const seasonOptions = seasonOptionsFromPhases(phases, agxPriceUsd, nowSeconds)
  const featuredIndex = featuredPhaseIndex(phases, activePhase, nowSeconds)
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

/**
 * 拼接首页季节引导文案（模板替换）。
 *
 * 加载中折扣以省略号占位，避免文案闪烁。
 *
 * @param template 文案模板，含 {season} / {discount} 占位
 * @param season 季节序号
 * @param discount 折扣文案
 * @param isLoading 加载中是否用省略号
 * @returns 引导文案
 */
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
