/** 计算器曲线左右各留这么多像素，十字和 tip 才点得到首末点。 */
export const CHART_INSET_PAD_PX = 10

/**
 * 面积图时间轴可见逻辑范围。
 *
 * Lightweight Charts 把点画在 bar 槽中心；`from` 可为负，用来超出数据留边。
 * `flush` 裁掉半槽，让首末点贴绘图区左右边（市值图）。
 * `inset` 按像素留白换成逻辑槽：密点时半槽不到 1px，右侧 `rightOffsetPixels`
 * 只对 `fitContent` 生效，两侧都要垫就用本范围。
 *
 * @param pointCount 当前序列点数
 * @param fit `flush` 贴边；`inset` 内缩
 * @param widthPx 绘图区宽度；inset 用来把像素留白换成逻辑槽，缺则按 400
 * @returns 可见逻辑范围；点数非法时 null
 * @see https://tradingview.github.io/lightweight-charts/docs/time-scale
 */
export function chartVisibleLogicalRange(
  pointCount: number,
  fit: 'flush' | 'inset' = 'flush',
  widthPx?: number,
): { from: number; to: number } | null {
  if (!Number.isFinite(pointCount) || pointCount <= 0) return null
  if (pointCount === 1) {
    return fit === 'inset' ? { from: -0.5, to: 1.5 } : { from: 0, to: 1 }
  }
  if (fit === 'inset') {
    const last = pointCount - 1
    const width = widthPx != null && Number.isFinite(widthPx) && widthPx > 0 ? widthPx : 400
    const inner = Math.max(1, width - 2 * CHART_INSET_PAD_PX)
    const padBars = (CHART_INSET_PAD_PX * last) / inner
    return { from: -padBars, to: last + padBars }
  }
  return { from: 0.5, to: pointCount - 1.5 }
}
