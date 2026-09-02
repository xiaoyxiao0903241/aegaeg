import type { SeasonOption } from '~/core/presale/genesis-promo-types'
import {
  formatPhaseDate,
  isPhaseActive,
  type PresalePhaseOnChain,
} from '~/core/presale/presale-math'

function formatUsdApproxPrice(value: number): string {
  return `≈ $${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatPhaseDateRange(startTime: bigint, endTime: bigint): string {
  return `${formatPhaseDate(startTime)} – ${formatPhaseDate(endTime)}`
}

/**
 * 由链上预售阶段生成季节选项（文案格式化）。
 *
 * 折扣、空投比例与价格均按阶段参数格式化；价格以 AGX 参考价折算，
 * 参考价非正时显示 `—`；阶段状态按当前时间判定。
 *
 * @param phases 链上预售阶段
 * @param agxPriceUsd AGX 参考价（美元）
 * @param nowSeconds 当前时间（unix 秒）
 * @returns 季节选项列表
 * @see 手册 §6.3 展示字段
 */
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
      price: effectivePrice > 0 ? formatUsdApproxPrice(effectivePrice) : '—',
      date: formatPhaseDateRange(phase.startTime, phase.endTime),
    }
  })
}
