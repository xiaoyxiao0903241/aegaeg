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
import { useEffect, useRef, useState } from 'react'

import { formatCompactUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { cn } from '~/shared/lib/utils'
import { colorHex } from '~/shared/styles/tokens/tokens'
import { Text } from '~/shared/ui/text'

export type TvAreaPoint = {
  /** UTC seconds — Lightweight Charts `UTCTimestamp`. */
  time: UTCTimestamp
  value: number
}

const LINE = colorHex.primary
const AREA_TOP = 'rgba(232, 106, 67, 0.38)'
const AREA_BOTTOM = 'rgba(232, 106, 67, 0.02)'

/** Figma `4585:572` plot — light grey dot lattice (not solid grid lines). */
const DOT_BG = 'radial-gradient(circle, rgba(0, 0, 0, 0.14) 0.9px, transparent 1px)'

type ChartTip = {
  left: number
  top: number
  dateLabel: string
  valueLabel: string
}

/** Format UTC day → Figma x-axis `YYYY-MM`. */
export function formatTvAreaChartMonthLabel(time: UTCTimestamp): string {
  const d = new Date(Number(time) * 1000)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

/**
 * Pick evenly spaced labels including first + last (Figma “全部” shows 6 ticks).
 * Short ranges keep all points when ≤ maxLabels.
 */
export function pickTvAreaChartAxisLabels(
  points: readonly TvAreaPoint[],
  maxLabels = 6,
): readonly string[] {
  if (points.length === 0) return []
  if (points.length <= maxLabels) {
    return points.map((p) => formatTvAreaChartMonthLabel(p.time))
  }
  const last = maxLabels - 1
  const labels: string[] = []
  for (let i = 0; i < maxLabels; i += 1) {
    const idx = Math.round((i / last) * (points.length - 1))
    labels.push(formatTvAreaChartMonthLabel(points[idx]!.time))
  }
  return labels
}

function tipValueLabel(value: number): string {
  if (!Number.isFinite(value)) return formatCompactUsd(null)
  if (Math.abs(value) >= 1000) return formatCompactUsd(value)
  return formatGroupedNumber(value, { digits: 2, prefix: '$' })
}

function tipDateFromTime(time: Time | undefined): string | null {
  if (time == null) return null
  if (typeof time === 'number') return formatTvAreaChartMonthLabel(time as UTCTimestamp)
  if (typeof time === 'string') {
    // business day `YYYY-MM-DD`
    return time.length >= 7 ? time.slice(0, 7) : time
  }
  if (typeof time === 'object' && 'year' in time) {
    return `${time.year}-${String(time.month).padStart(2, '0')}`
  }
  return null
}

/** TradingView Lightweight Charts area chrome — 跨页复用；点数由 call site 传入. */
export function TvAreaChart({
  axisLabels: axisLabelsProp,
  className,
  formatTipDate,
  height = 170,
  points,
}: {
  /** Override auto month axis (e.g. calc day labels). */
  axisLabels?: readonly string[]
  className?: string
  /** Crosshair date line; defaults to `YYYY-MM`. */
  formatTipDate?: (time: Time) => string | null
  height?: number
  points: readonly TvAreaPoint[]
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null)
  const [tip, setTip] = useState<ChartTip | null>(null)
  const axisLabels = axisLabelsProp ?? pickTvAreaChartAxisLabels(points)
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
          color: 'rgba(232, 106, 67, 0.25)',
          style: 3,
        },
        vertLine: {
          visible: true,
          labelVisible: false,
          color: 'rgba(232, 106, 67, 0.45)',
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
    <div className={cn('grid w-full gap-2', className)} ref={wrapRef}>
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
