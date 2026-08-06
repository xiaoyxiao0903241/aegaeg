/**
 * 资产 Hub「持仓分布」环形图几何与文案（纯函数）。
 *
 * 百分比按各桶 USD 估值占比；几何对齐原型 SVG（r=54、周长 dash/offset）。
 * 分桶金额可由 API / 链读组装后传入；本模块只做展示几何。
 */

import { formatNumber, formatUsd } from '~/shared/presenters/format'

export type HoldingsDistributionModeKey = 'stake' | 'lpbond' | 'burnbond' | 'xmine'

/** 原型色板（稿面四桶；浅段用深字保证对比） */
const HOLDINGS_DISTRIBUTION_COLORS: Record<
  HoldingsDistributionModeKey,
  { color: string; text: string }
> = {
  stake: { color: '#e8552b', text: '#ffffff' },
  lpbond: { color: '#3a3145', text: '#ffffff' },
  burnbond: { color: '#b9829b', text: '#ffffff' },
  xmine: { color: '#f6c1b6', text: '#3a3145' },
}

const PIE_R = 54
const PIE_C = 2 * Math.PI * PIE_R
/** 扇区之间留缝，避免描边粘连 */
const SEG_GAP = 1.6
const LABEL_MIN_FRAC = 0.08

export type HoldingsDistributionSliceInput = {
  key: HoldingsDistributionModeKey
  label: string
  amountLabel: string
  usd: number
}

export type HoldingsDistributionSeg = {
  key: HoldingsDistributionModeKey
  label: string
  color: string
  textColor: string
  amountLabel: string
  usdLabel: string
  pctLabel: string
  frac: number
  dash: string
  offset: string
  showLabel: boolean
  labelX: number
  labelY: number
}

export type HoldingsDistributionView = {
  totalUsd: number
  totalLabel: string
  segs: HoldingsDistributionSeg[]
}

/**
 * 由四桶金额 + USD 估值生成环形图段与图例行。
 * 总估值 ≤ 0 时返回 `null`（UI 走空态）。
 */
export function buildHoldingsDistributionView(
  slices: readonly HoldingsDistributionSliceInput[],
): HoldingsDistributionView | null {
  const totalUsd = slices.reduce(
    (sum, s) => sum + (Number.isFinite(s.usd) ? Math.max(0, s.usd) : 0),
    0,
  )
  if (!(totalUsd > 0)) return null

  let pieAcc = 0
  const segs = slices.map((s) => {
    const usd = Number.isFinite(s.usd) && s.usd > 0 ? s.usd : 0
    const frac = usd / totalUsd
    const midA = ((pieAcc + frac / 2) * 360 - 90) * (Math.PI / 180)
    const arc = Math.max(0.5, frac * PIE_C - SEG_GAP)
    const palette = HOLDINGS_DISTRIBUTION_COLORS[s.key]
    const seg: HoldingsDistributionSeg = {
      key: s.key,
      label: s.label,
      color: palette.color,
      textColor: palette.text,
      amountLabel: s.amountLabel,
      usdLabel: formatNumber(usd, { digits: 2, prefix: '$' }),
      pctLabel: `${(frac * 100).toFixed(1)}%`,
      frac,
      dash: `${arc.toFixed(2)} ${(PIE_C - arc).toFixed(2)}`,
      offset: (-pieAcc * PIE_C).toFixed(2),
      showLabel: frac > LABEL_MIN_FRAC,
      labelX: Number((80 + PIE_R * Math.cos(midA)).toFixed(1)),
      labelY: Number((80 + PIE_R * Math.sin(midA)).toFixed(1)),
    }
    pieAcc += frac
    return seg
  })

  return {
    totalUsd,
    totalLabel: formatUsd(totalUsd),
    segs,
  }
}
