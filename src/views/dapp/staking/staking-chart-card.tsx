import { type ReactNode } from 'react'

import { Card } from '~/shared/ui/card'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'

/** Staking TVL/range chart shell — range chrome live; plot area placeholder until handbook source. */
export function StakingChartCard({
  chartRange,
  header,
  placeholder,
  rangeAriaLabel,
  rangeLabels,
  setChartRange,
  surface,
}: {
  chartRange: string
  header: ReactNode
  placeholder: string
  rangeAriaLabel: string
  rangeLabels: readonly string[]
  setChartRange: (value: string) => void
  surface: 'elevated' | 'outlined'
}) {
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
          tone="ink"
          value={chartRange}
        />
      </div>
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border">
        <Text as="span" tone="muted-foreground" variant="copy">
          {placeholder}
        </Text>
      </div>
    </Card>
  )
}
