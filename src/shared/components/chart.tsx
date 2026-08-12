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
  chartDateGrainFromSpan,
  chartPointsSpanSeconds,
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

/** 浅灰点阵底纹（不是实线网格） */
const DOT_BG = 'radial-gradient(circle, rgba(0, 0, 0, 0.14) 0.9px, transparent 1px)'

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
 * 把首末点钉在绘图区左右边。
 *
 * LWC 把点画在 bar 槽中心；可见范围用 `0.5..n-1.5` 裁掉半槽。
 *
 * @param chart 图表实例
 * @param pointCount 当前序列点数
 */
function fitSeriesFlush(chart: IChartApi, pointCount: number): void {
  if (pointCount <= 0) return
  if (pointCount === 1) {
    chart.timeScale().setVisibleLogicalRange({ from: 0, to: 1 })
    return
  }
  chart.timeScale().setVisibleLogicalRange({
    from: 0.5,
    to: pointCount - 1.5,
  })
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
  dateGrain: dateGrainProp,
  formatTipDate,
  height = 170,
  points,
}: {
  axisLabels?: readonly string[]
  className?: string
  /** 显式日期粒度；缺省按序列跨度回退 */
  dateGrain?: ChartDateGrain
  formatTipDate?: (time: Time) => string | null
  height?: number
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
  // points 换批时在 render 期清 tip，避免 effect 里 setState 造成一帧陈旧十字线。
  const [tipPoints, setTipPoints] = useState(points)
  if (points !== tipPoints) {
    setTipPoints(points)
    setTip(null)
  }
  const dateGrain = dateGrainProp ?? chartDateGrainFromSpan(chartPointsSpanSeconds(points))
  const axisLabels = axisLabelsProp ?? pickChartAxisLabels(points, 6, dateGrain)
  // 十字线回调在 chart 订阅里；用 Effect Event 读最新 formatTipDate / grain，避免 render 写 ref / 把 formatter 塞进 effect deps。
  const resolveTipDate = useEffectEvent((time: Time) => {
    return formatTipDate?.(time) ?? tipDateFromTime(time, dateGrain)
  })

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const chart = createChart(host, {
      width: host.clientWidth,
      height,
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
      crosshairMarkerVisible: true,
      crosshairMarkerBorderColor: LINE,
      crosshairMarkerBackgroundColor: '#fff',
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
        param.point.y > height
      ) {
        setTip(null)
        return
      }
      const raw = param.seriesData.get(series)
      const value =
        raw && typeof raw === 'object' && 'value' in raw && typeof raw.value === 'number'
          ? raw.value
          : null
      if (value == null) {
        setTip(null)
        return
      }
      const dateLabel = resolveTipDate(param.time)
      if (dateLabel == null) {
        setTip(null)
        return
      }
      const tipW = 112
      const tipH = 48
      const pad = 10
      let left = param.point.x + pad
      let top = param.point.y - tipH - pad
      if (left + tipW > host.clientWidth) left = param.point.x - tipW - pad
      if (top < 0) top = param.point.y + pad
      setTip({
        left: Math.max(0, left),
        top: Math.max(0, top),
        dateLabel,
        valueLabel: tipValueLabel(value),
      })
    }

    chart.subscribeCrosshairMove(onMove)

    const ro = new ResizeObserver(() => {
      if (!hostRef.current || !chartRef.current) return
      chartRef.current.applyOptions({ width: hostRef.current.clientWidth })
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
    }
  }, [height])

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

    const paint = (next: readonly { time: number; value: number }[]) => {
      const drawn = densifyForPaint(next)
      series.setData(drawn.map((p) => ({ time: p.time as Time, value: p.value })))
      // setData 后布局可能异步校正；下一帧再钉边，避免被内部 range 覆盖
      fitSeriesFlush(chart, drawn.length)
      requestAnimationFrame(() => {
        if (seriesRef.current !== series || chartRef.current !== chart) return
        fitSeriesFlush(chart, drawn.length)
      })
      visualPointsRef.current = drawn.map((p) => ({
        time: p.time as UTCTimestamp,
        value: p.value,
      }))
    }

    const commit = (next: readonly { time: number; value: number }[]) => {
      paint(next)
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

  return (
    <div className={cn('grid w-full gap-2', className)}>
      <div className="relative w-full overflow-hidden rounded-md" style={{ height }}>
        <div
          className="absolute inset-0"
          ref={hostRef}
          style={{
            backgroundImage: DOT_BG,
            backgroundSize: '10px 10px',
            backgroundPosition: '0 0',
          }}
        />
        {tip ? (
          <div
            aria-hidden
            className="pointer-events-none absolute z-10 min-w-26 rounded-md bg-card px-2.5 py-1.5 shadow-menu"
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
 * 曲线 / 面积图加载骨架：绘图区与底部轴标占位，高度对齐 `Plot` 的 170px。
 */
function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div aria-busy="true" className={cn('grid w-full gap-2', className)}>
      <Skeleton className="h-[170px] w-full rounded-md" />
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
