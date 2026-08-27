import {
  AreaSeries,
  ColorType,
  createChart,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type MouseEventParams,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts'
import {
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react'

import { Card } from '~/shared/components/card'
import { Empty } from '~/shared/components/empty'
import { Skeleton } from '~/shared/components/skeleton'
import { Text } from '~/shared/components/text'
import {
  type ChartDateGrain,
  chartDateGrainFromPoints,
  formatChartTipDate,
  formatChartYearMonth,
  pickChartAxisLabels,
} from '~/shared/lib/chart-axis-date'
import {
  CHART_MORPH_MS,
  CHART_MORPH_SAMPLES,
  easeOutCubic,
  ensureAscendingTimes,
  morphSeriesFrame,
  sampleSeriesNormalized,
} from '~/shared/lib/chart-series-morph'
import { chartVisibleLogicalRange } from '~/shared/lib/chart-visible-range'
import { cssRemVarPx } from '~/shared/lib/root-rem-px'
import { cn } from '~/shared/lib/utils'
import { formatNumber, formatUsd } from '~/shared/presenters/format'
import { colorHex } from '~/shared/styles/tokens/tokens'

/**
 * DApp 面积图
 *
 * 组合组件：`Chart` · `Header` · `Plot` · `Empty` · `Skeleton`。
 * 绘图区用 Lightweight Charts 实现；数据点与文案由调用方提供。
 * @see docs/foundation/component-usage.md
 */

export type ChartPoint = {
  /** UTC 秒（Lightweight Charts 的 `UTCTimestamp`） */
  time: UTCTimestamp
  value: number
  /** 接口原样日期；`YYYY-MM` 时轴/tip 按月 */
  date?: string
}

/** `#rrggbb` → `rgba(r,g,b,a)`；非法 hex 回退 primary 不透明。 */
function withAlpha(hex: string, alpha: number): string {
  const raw = hex.replace('#', '')
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return hex
  const r = Number.parseInt(full.slice(0, 2), 16)
  const g = Number.parseInt(full.slice(2, 4), 16)
  const b = Number.parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const LINE = colorHex.primary
const AREA_TOP = withAlpha(colorHex.primary, 0.38)
const AREA_BOTTOM = withAlpha(colorHex.primary, 0.02)

const MARK_DOT_CLASS =
  'pointer-events-none absolute z-10 size-(--chart-mark-size) -translate-x-1/2 -translate-y-1/2 rounded-full border-solid'

function chartMarkStyle(pos: { x: number; y: number }) {
  return {
    left: pos.x,
    top: pos.y,
    // 描边用 rem token；写进 style，避免被边框颜色 class 盖成 1px
    borderWidth: 'var(--chart-mark-border)',
  }
}

type ChartTip = {
  left: number
  top: number
  dateLabel: string
  valueLabel: string
}

/** 换批曲线 morph 用：点数 + 首末指纹（父级每次 map 出新数组）。 */
function pointsSignature(points: readonly ChartPoint[]): string {
  if (points.length === 0) return '0'
  const first = points[0]!
  const last = points[points.length - 1]!
  return `${points.length}:${first.time}:${first.value}:${last.time}:${last.value}`
}

/**
 * 按 fit 模式套上时间轴可见范围。
 *
 * @param chart 图表实例
 * @param pointCount 当前序列点数
 * @param fit 贴边或内缩
 * @param widthPx 绘图区宽度；inset 用来把像素留白换成逻辑槽
 */
function fitSeriesRange(
  chart: IChartApi,
  pointCount: number,
  fit: 'flush' | 'inset',
  widthPx: number,
): void {
  const range = chartVisibleLogicalRange(pointCount, fit, widthPx)
  if (range == null) return
  chart.timeScale().setVisibleLogicalRange(range)
}

/**
 * 点数过少时加密到 morph 同级采样，避免落定后半槽留白突然变大。
 *
 * @param points 原始或中间帧点列
 */
function densifyForPaint(
  points: readonly { time: number; value: number }[],
): { time: number; value: number }[] {
  if (points.length === 0) return []
  if (points.length === 1 || points.length >= CHART_MORPH_SAMPLES) {
    return points.map((p) => ({ time: p.time, value: p.value }))
  }
  const out: { time: number; value: number }[] = []
  for (let i = 0; i < CHART_MORPH_SAMPLES; i += 1) {
    out.push(sampleSeriesNormalized(points, i / (CHART_MORPH_SAMPLES - 1)))
  }
  return ensureAscendingTimes(out)
}

function tipValueLabel(value: number): string {
  if (!Number.isFinite(value)) return formatUsd(null)
  if (Math.abs(value) >= 1000) return formatUsd(value)
  return formatNumber(value, { digits: 2, prefix: '$' })
}

/**
 * tip 日期：数值时间按 grain；BusinessDay / 业务日字符串走月粒度回退。
 *
 * @param time Lightweight Charts 时间
 * @param grain 日期粒度
 */
function tipDateFromTime(time: Time | undefined, grain: ChartDateGrain): string | null {
  if (time == null) return null
  if (typeof time === 'number') return formatChartTipDate(time, grain)
  if (typeof time === 'string') {
    return time.length >= 7 ? time.slice(0, 7) : time
  }
  if (typeof time === 'object' && 'year' in time) {
    return formatChartYearMonth(Date.UTC(time.year, time.month - 1, time.day ?? 1) / 1000)
  }
  return null
}

type ChartRootProps = HTMLAttributes<HTMLDivElement> & {
  surface?: 'elevated' | 'outlined'
  children?: ReactNode
}

/** 图表卡片容器：elevated 默认；outlined 仅特例 */
function ChartRoot({ surface = 'elevated', className, children, ...props }: ChartRootProps) {
  return (
    <Card
      surface={surface}
      className={cn(
        'grid gap-3 rounded-2xl p-4',
        surface === 'outlined' ? 'shadow-sm' : undefined,
        className,
      )}
      {...props}
    >
      {children}
    </Card>
  )
}

function Header({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * 绘图区
 *
 * 面积图渲染并跟随鼠标显示数值提示；
 * 坐标轴标签与提示文案可自定义。
 */
function Plot({
  axisLabels: axisLabelsProp,
  className,
  fit = 'flush',
  formatTipDate,
  mark,
  points,
}: {
  axisLabels?: readonly string[]
  className?: string
  /** `flush` 首末贴边；`inset` 按像素留边，首末点能点到。 */
  fit?: 'flush' | 'inset'
  formatTipDate?: (time: Time) => string | null
  /** 曲线上的测算日标记；无则不画。 */
  mark?: { time: number; label?: string }
  points: readonly ChartPoint[]
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null)
  /** 当前画布上的点（含 morph 中间帧），供下一次换批接续。 */
  const visualPointsRef = useRef<readonly ChartPoint[]>([])
  const appliedSigRef = useRef('')
  const morphRafRef = useRef(0)
  /** chart 实例重建后递增，驱动重新落数。 */
  const [plotEpoch, setPlotEpoch] = useState(0)
  const [tip, setTip] = useState<ChartTip | null>(null)
  const [markPos, setMarkPos] = useState<{ x: number; y: number } | null>(null)
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null)
  // points 换批时在 render 期清 tip，避免 effect 里 setState 造成一帧陈旧十字线。
  const [tipPoints, setTipPoints] = useState(points)
  if (points !== tipPoints) {
    setTipPoints(points)
    setTip(null)
    setHoverPos(null)
  }
  const dateGrain = chartDateGrainFromPoints(points)
  const axisLabels = axisLabelsProp ?? pickChartAxisLabels(points, 6)
  // 十字线回调在 chart 订阅里；用 Effect Event 读最新 formatTipDate / grain，避免 render 写 ref / 把 formatter 塞进 effect deps。
  const resolveTipDate = useEffectEvent((time: Time) => {
    return formatTipDate?.(time) ?? tipDateFromTime(time, dateGrain)
  })
  const applyFit = useEffectEvent(() => {
    const chart = chartRef.current
    const host = hostRef.current
    if (!chart || !host) return
    fitSeriesRange(chart, visualPointsRef.current.length, fit, host.clientWidth)
  })
  const syncMark = useEffectEvent(() => {
    const chart = chartRef.current
    const series = seriesRef.current
    if (!chart || !series || mark == null) {
      setMarkPos(null)
      return
    }
    const hit = points.find((p) => Number(p.time) === mark.time)
    if (!hit) {
      setMarkPos(null)
      return
    }
    const x = chart.timeScale().timeToCoordinate(mark.time as Time)
    const y = series.priceToCoordinate(hit.value)
    if (x == null || y == null) {
      setMarkPos(null)
      return
    }
    setMarkPos((prev) => (prev && prev.x === x && prev.y === y ? prev : { x, y }))
  })

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const chart = createChart(host, {
      width: host.clientWidth,
      height: Math.max(1, host.clientHeight),
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        fontFamily: 'Montserrat, ui-sans-serif, system-ui, sans-serif',
        fontSize: 12,
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      leftPriceScale: { visible: false },
      rightPriceScale: { visible: false },
      timeScale: {
        visible: false,
        borderVisible: false,
        rightOffset: 0,
        // 默认 max 为半宽，点数少时无法拉满贴边
        maxBarSpacing: 1000,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        horzLine: {
          visible: true,
          labelVisible: false,
          color: withAlpha(colorHex.primary, 0.25),
          style: 3,
        },
        vertLine: {
          visible: true,
          labelVisible: false,
          color: withAlpha(colorHex.primary, 0.45),
          style: 0,
        },
      },
      handleScroll: false,
      handleScale: false,
    })
    const series = chart.addSeries(AreaSeries, {
      lineColor: LINE,
      topColor: AREA_TOP,
      bottomColor: AREA_BOTTOM,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    })

    chartRef.current = chart
    seriesRef.current = series
    setPlotEpoch((n) => n + 1)

    const onMove = (param: MouseEventParams<Time>) => {
      if (
        param.point == null ||
        param.time == null ||
        param.point.x < 0 ||
        param.point.y < 0 ||
        param.point.x > host.clientWidth ||
        param.point.y > host.clientHeight
      ) {
        setTip(null)
        setHoverPos(null)
        return
      }
      const raw = param.seriesData.get(series)
      const value =
        raw && typeof raw === 'object' && 'value' in raw && typeof raw.value === 'number'
          ? raw.value
          : null
      if (value == null) {
        setTip(null)
        setHoverPos(null)
        return
      }
      const dateLabel = resolveTipDate(param.time)
      if (dateLabel == null) {
        setTip(null)
        setHoverPos(null)
        return
      }
      const tipW = 112
      const tipH = 48
      const pad = 10
      const maxLeft = Math.max(0, host.clientWidth - tipW)
      let left = param.point.x + pad
      if (left > maxLeft) left = param.point.x - tipW - pad
      left = Math.min(maxLeft, Math.max(0, left))
      let top = param.point.y - tipH - pad
      if (top < 0) top = param.point.y + pad
      const hx = chart.timeScale().timeToCoordinate(param.time)
      const hy = series.priceToCoordinate(value)
      if (hx != null && hy != null) setHoverPos({ x: hx, y: hy })
      else setHoverPos(null)
      setTip({
        left,
        top: Math.max(0, top),
        dateLabel,
        valueLabel: tipValueLabel(value),
      })
    }

    chart.subscribeCrosshairMove(onMove)

    const ro = new ResizeObserver(() => {
      if (!hostRef.current || !chartRef.current) return
      chartRef.current.applyOptions({
        width: hostRef.current.clientWidth,
        height: Math.max(1, hostRef.current.clientHeight),
      })
      applyFit()
      requestAnimationFrame(() => {
        applyFit()
        syncMark()
      })
    })
    ro.observe(host)

    return () => {
      cancelAnimationFrame(morphRafRef.current)
      chart.unsubscribeCrosshairMove(onMove)
      ro.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
      visualPointsRef.current = []
      appliedSigRef.current = ''
      setTip(null)
      setHoverPos(null)
      setMarkPos(null)
    }
  }, [])

  useEffect(() => {
    const series = seriesRef.current
    const chart = chartRef.current
    if (!series || !chart) return

    const targetSig = pointsSignature(points)
    if (targetSig === appliedSigRef.current) return

    const to = points.map((p) => ({ time: Number(p.time), value: p.value }))
    const from = visualPointsRef.current.map((p) => ({
      time: Number(p.time),
      value: p.value,
    }))

    const paint = (next: readonly { time: number; value: number }[], pinMark = false) => {
      const drawn = densifyForPaint(next)
      series.setData(drawn.map((p) => ({ time: p.time as Time, value: p.value })))
      visualPointsRef.current = drawn.map((p) => ({
        time: p.time as UTCTimestamp,
        value: p.value,
      }))
      // setData 后布局可能异步校正；下一帧再钉边，避免被内部 range 覆盖
      applyFit()
      requestAnimationFrame(() => {
        if (seriesRef.current !== series || chartRef.current !== chart) return
        applyFit()
        if (pinMark) syncMark()
      })
    }

    const commit = (next: readonly { time: number; value: number }[]) => {
      paint(next, true)
      appliedSigRef.current = pointsSignature(
        next.map((p) => ({ time: p.time as UTCTimestamp, value: p.value })),
      )
    }

    cancelAnimationFrame(morphRafRef.current)

    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 首绘 / 清空 / 减动效：直接落目标，不做 morph
    if (reduceMotion || from.length === 0 || to.length === 0) {
      commit(to)
      return
    }

    const startedAt = performance.now()
    let cancelled = false

    const tick = (now: number) => {
      if (cancelled) return
      const raw = Math.min(1, (now - startedAt) / CHART_MORPH_MS)
      const eased = easeOutCubic(raw)
      if (raw >= 1) {
        commit(to)
        return
      }
      paint(morphSeriesFrame(from, to, eased))
      morphRafRef.current = requestAnimationFrame(tick)
    }

    morphRafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(morphRafRef.current)
    }
  }, [points, plotEpoch])

  useEffect(() => {
    applyFit()
    const id = requestAnimationFrame(() => applyFit())
    return () => cancelAnimationFrame(id)
  }, [fit])

  useEffect(() => {
    syncMark()
  }, [mark?.time, plotEpoch])

  const markLabelAbove =
    markPos != null && markPos.y >= cssRemVarPx('--chart-mark-size', 0.5625) * 4

  return (
    <div className={cn('grid w-full gap-2', className)}>
      <div
        className={cn(
          'relative h-(--chart-plot-height) w-full rounded-md',
          fit === 'inset' ? 'overflow-visible' : 'overflow-hidden',
        )}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-md"
          ref={hostRef}
          style={{
            backgroundImage: 'var(--chart-plot-dot)',
            backgroundSize: 'var(--chart-plot-dot-size) var(--chart-plot-dot-size)',
          }}
        />
        {tip ? (
          <div
            aria-hidden
            className="pointer-events-none absolute z-20 min-w-26 rounded-md bg-card px-2.5 py-1.5 shadow-menu"
            style={{ left: tip.left, top: tip.top }}
          >
            <Text as="p" className="m-0" tone="muted-foreground" variant="support">
              {tip.dateLabel}
            </Text>
            <Text as="p" className="m-0 font-semibold" variant="copy">
              {tip.valueLabel}
            </Text>
          </div>
        ) : null}
        {hoverPos ? (
          <div
            aria-hidden
            className={cn(MARK_DOT_CLASS, 'border-primary bg-card')}
            style={chartMarkStyle(hoverPos)}
          />
        ) : null}
        {mark && markPos ? (
          <>
            <div
              aria-hidden
              className={cn(MARK_DOT_CLASS, 'border-white bg-primary')}
              style={chartMarkStyle(markPos)}
            />
            {mark.label && !tip ? (
              <Text
                as="span"
                className="pointer-events-none absolute z-10 rounded-full bg-card px-2 py-0.5 font-semibold whitespace-nowrap text-primary tabular-nums shadow-menu"
                style={{
                  left: markPos.x,
                  top: markPos.y,
                  transform: markLabelAbove
                    ? 'translate(-50%, calc(-100% - 0.625rem))'
                    : 'translate(-50%, 0.75rem)',
                }}
                variant="support"
              >
                {mark.label}
              </Text>
            ) : null}
          </>
        ) : null}
      </div>
      {axisLabels.length > 0 ? (
        <div className="flex w-full items-center justify-between gap-1">
          {axisLabels.map((label, i) => (
            <Text
              as="span"
              className="min-w-0 shrink truncate"
              key={`${label}-${i}`}
              tone="muted-foreground"
              variant="copy"
            >
              {label}
            </Text>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/**
 * 曲线 / 面积图加载骨架：绘图区与底部轴标占位，高度对齐 `Plot`（`--chart-plot-height`）。
 */
function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div aria-busy="true" className={cn('grid w-full gap-2', className)}>
      <Skeleton className="h-(--chart-plot-height) w-full rounded-md" />
      <div className="flex w-full items-center justify-between gap-1">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton className="h-3 w-10 shrink" key={i} />
        ))}
      </div>
    </div>
  )
}

export const Chart = Object.assign(ChartRoot, {
  Header,
  Plot,
  Empty,
  Skeleton: ChartSkeleton,
})
