/**
 * 面积图换批曲线 morph：把两段序列采样到同一归一化轴再插值。
 * Lightweight Charts 的 setData 无内建变形，需自绘过渡帧。
 */

export type MorphPoint = {
  time: number
  value: number
}

/** 默认采样点数：够平滑又不过度 setData。 */
export const CHART_MORPH_SAMPLES = 64

/** 换批 morph 时长（ms）。 */
export const CHART_MORPH_MS = 360

/**
 * 在已排序点列上按归一化位置 u∈[0,1] 线性采样。
 *
 * @param points 升序时间点列
 * @param u 归一化位置
 */
export function sampleSeriesNormalized(points: readonly MorphPoint[], u: number): MorphPoint {
  if (points.length === 0) return { time: 0, value: 0 }
  if (points.length === 1) return { time: points[0]!.time, value: points[0]!.value }
  const clamped = Math.min(1, Math.max(0, u))
  const pos = clamped * (points.length - 1)
  const i = Math.floor(pos)
  const f = pos - i
  const a = points[i]!
  const b = points[Math.min(i + 1, points.length - 1)]!
  return {
    time: a.time + (b.time - a.time) * f,
    value: a.value + (b.value - a.value) * f,
  }
}

/** easeOutCubic：快起慢收，切 range 时更跟手。 */
export function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return 1 - (1 - x) ** 3
}

/**
 * 保证时间严格递增（LWC 要求）；浮点贴边时向后拨 1 秒。
 *
 * @param points 待校验点列（会被复制）
 */
export function ensureAscendingTimes(points: readonly MorphPoint[]): MorphPoint[] {
  if (points.length === 0) return []
  const out: MorphPoint[] = [{ time: points[0]!.time, value: points[0]!.value }]
  for (let i = 1; i < points.length; i += 1) {
    const prev = out[i - 1]!
    const cur = points[i]!
    const time = cur.time <= prev.time ? prev.time + 1 : cur.time
    out.push({ time, value: cur.value })
  }
  return out
}

/**
 * 生成 morph 中间帧：progress=0 贴近 from，=1 为 to 原样。
 * 两列等长时按索引插值，保持点数；否则采样到同一归一化轴。
 *
 * @param from 当前可视序列
 * @param to 目标序列
 * @param progress 0..1（未 easing）
 * @param samples 中间帧采样数
 */
export function morphSeriesFrame(
  from: readonly MorphPoint[],
  to: readonly MorphPoint[],
  progress: number,
  samples = CHART_MORPH_SAMPLES,
): MorphPoint[] {
  const t = Math.min(1, Math.max(0, progress))
  if (to.length === 0) return []
  if (from.length === 0 || t >= 1) {
    return to.map((p) => ({ time: p.time, value: p.value }))
  }
  if (t <= 0) {
    return from.map((p) => ({ time: p.time, value: p.value }))
  }

  // 等长序列逐点插值，避免先抽稀再落回原点数时参考线跟着跳
  if (from.length === to.length) {
    const out: MorphPoint[] = []
    for (let i = 0; i < to.length; i += 1) {
      const a = from[i]!
      const b = to[i]!
      out.push({
        time: a.time + (b.time - a.time) * t,
        value: a.value + (b.value - a.value) * t,
      })
    }
    return ensureAscendingTimes(out)
  }

  const n = Math.max(2, samples)
  const out: MorphPoint[] = []
  for (let i = 0; i < n; i += 1) {
    const u = i / (n - 1)
    const a = sampleSeriesNormalized(from, u)
    const b = sampleSeriesNormalized(to, u)
    out.push({
      time: a.time + (b.time - a.time) * t,
      value: a.value + (b.value - a.value) * t,
    })
  }
  return ensureAscendingTimes(out)
}
