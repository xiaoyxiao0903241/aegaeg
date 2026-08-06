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
import { type HTMLAttributes, type ReactNode, useEffect, useRef, useState } from 'react'

import { formatNumber, formatUsd } from '~/shared/api/format-display'
import { Card } from '~/shared/components/card'
import { Empty } from '~/shared/components/empty'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { colorHex } from '~/shared/styles/tokens/tokens'

/**
 * DApp 面积图
 *
 * 组合组件：`Chart` · `Header` · `Plot` · `Empty`。
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

/** 格式化 UTC 时间为坐标轴月份 `YYYY-MM` */
function formatChartMonthLabel(time: UTCTimestamp): string {
  const d = new Date(Number(time) * 1000)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

/**
 * 均匀挑选坐标轴标签，保证首尾都出现（最多 6 个）。
 * 点数不超过上限时全部保留。
 */
function pickChartAxisLabels(points: readonly ChartPoint[], maxLabels = 6): readonly string[] {
  if (points.length === 0) return []
  if (points.length <= maxLabels) {
    return points.map((p) => formatChartMonthLabel(p.time))
  }
  const last = maxLabels - 1
  const labels: string[] = []
  for (let i = 0; i < maxLabels; i += 1) {
    const idx = Math.round((i / last) * (points.length - 1))
    labels.push(formatChartMonthLabel(points[idx]!.time))
  }
  return labels
}

function tipValueLabel(value: number): string {
  if (!Number.isFinite(value)) return formatUsd(null)
  if (Math.abs(value) >= 1000) return formatUsd(value)
  return formatNumber(value, { digits: 2, prefix: '$' })
}

function tipDateFromTime(time: Time | undefined): string | null {
  if (time == null) return null
  if (typeof time === 'number') return formatChartMonthLabel(time as UTCTimestamp)
  if (typeof time === 'string') {
    return time.length >= 7 ? time.slice(0, 7) : time
  }
  if (typeof time === 'object' && 'year' in time) {
    return `${time.year}-${String(time.month).padStart(2, '0')}`
  }
  return null
}

type ChartRootProps = HTMLAttributes<HTMLDivElement> & {
  surface?: 'elevated' | 'outlined'
  children?: ReactNode
}

/** 图表卡片外壳：elevated 默认；outlined 仅特例 */
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
  formatTipDate,
  height = 170,
  points,
}: {
  axisLabels?: readonly string[]
  className?: string
  formatTipDate?: (time: Time) => string | null
  height?: number
  points: readonly ChartPoint[]
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null)
  const [tip, setTip] = useState<ChartTip | null>(null)
  const axisLabels = axisLabelsProp ?? pickChartAxisLabels(points)
  const formatTipDateRef = useRef(formatTipDate)
  formatTipDateRef.current = formatTipDate

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
      const dateLabel = formatTipDateRef.current?.(param.time) ?? tipDateFromTime(param.time)
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
      chart.unsubscribeCrosshairMove(onMove)
      ro.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
      setTip(null)
    }
  }, [height])

  useEffect(() => {
    const series = seriesRef.current
    const chart = chartRef.current
    if (!series || !chart) return
    series.setData(points.map((p) => ({ time: p.time as Time, value: p.value })))
    chart.timeScale().fitContent()
    setTip(null)
  }, [points])

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
            className="pointer-events-none absolute z-10 min-w-[6.5rem] rounded-md bg-card px-2.5 py-1.5 shadow-menu"
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

export const Chart = Object.assign(ChartRoot, {
  Header,
  Plot,
  Empty,
})
