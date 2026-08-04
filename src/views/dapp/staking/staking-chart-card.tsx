import { type ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { Segment } from '~/shared/components/segment'
import { Text } from '~/shared/components/text'
import { TvAreaChart, type TvAreaPoint } from '~/shared/components/tv-area-chart'

/** Staking TVL/range chart — TradingView Lightweight Charts when `points` set; else empty copy (not 0.00). */
export function StakingChartCard({
  chartRange,
  emptyLabel,
  header,
  points,
  rangeAriaLabel,
  rangeLabels,
  setChartRange,
  surface,
}: {
  chartRange: string
  /** Shown when `points` is empty/undefined — never a numeric placeholder. */
  emptyLabel: string
  header: ReactNode
  points?: readonly TvAreaPoint[]
  rangeAriaLabel: string
  rangeLabels: readonly string[]
  setChartRange: (value: string) => void
  surface: 'elevated' | 'outlined'
}) {
  const hasSeries = points != null && points.length > 0

  return (
    <Card
      surface={surface}
      className={
        surface === 'outlined'
          ? 'grid gap-3 rounded-2xl p-4 shadow-sm'
          : 'grid gap-3 rounded-2xl p-4'
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {header}
        <Segment
          aria-label={rangeAriaLabel}
          onChange={setChartRange}
          options={rangeLabels.map((label) => ({ label, value: label }))}
          size="sm"
          tone="ink"
          value={chartRange}
        />
      </div>
      {hasSeries ? (
        <TvAreaChart points={points} />
      ) : (
        <div className="flex min-h-51 items-center justify-center rounded-lg">
          <Text as="span" className="text-foreground/40" variant="copy">
            {emptyLabel}
          </Text>
        </div>
      )}
    </Card>
  )
}
