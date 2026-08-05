/**
 * 收益计算器结果卡
 *
 * 展示总收益、收益率徽章、卖出/投入进度条与图例。
 */
import { formatGroupedNumber } from '~/shared/api/format-display'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'

const PLACEHOLDER = '0.00'

export function formatUsd(value: number) {
  if (!Number.isFinite(value)) return PLACEHOLDER
  return formatGroupedNumber(value, { digits: 2, prefix: '$' })
}

export function formatPct(value: number) {
  if (!Number.isFinite(value)) return PLACEHOLDER
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

type CalcResultCardProps = {
  interestUsd: number
  ratePct: number
  sellUsd: number
  investedUsd: number
  sellShare: number
  investShare: number
  labels: {
    total: string
    rate: string
    sellTotal: string
    invested: string
    yieldBar: string
    legend: {
      released: string
      netYield: string
      cost: string
      grossYield: string
    }
  }
}

export function CalcResultCard({
  interestUsd,
  ratePct,
  sellUsd,
  investedUsd,
  sellShare,
  investShare,
  labels,
}: CalcResultCardProps) {
  return (
    <Card className="grid gap-1.5" surface="elevated">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <Text as="span" className="text-foreground/40" variant="copy">
            {labels.total}
          </Text>
          <Text as="strong" className="text-success" variant="stat">
            {formatUsd(interestUsd)}
          </Text>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5">
          <Text as="span" className="text-foreground/40" variant="support">
            {labels.rate}
          </Text>
          <Text as="span" className="font-semibold text-success" variant="copy">
            {formatPct(ratePct)}
          </Text>
        </span>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <Text as="span" className="text-foreground/40" variant="copy">
            {labels.sellTotal}
          </Text>
          <Text as="strong" className="font-semibold" variant="detail">
            {formatUsd(sellUsd)}
          </Text>
        </div>
        <div className="flex overflow-hidden rounded-full">
          <span className="bg-primary-soft" style={{ flex: `${100 - sellShare} 0 0` }} />
          <span className="bg-coral-emphasis" style={{ flex: `${sellShare} 0 0` }} />
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <Text as="span" className="text-foreground/40" variant="copy">
            {labels.invested}
          </Text>
          <Text as="strong" className="font-semibold" variant="detail">
            {formatUsd(investedUsd)}
          </Text>
        </div>
        <div className="flex overflow-hidden rounded-full">
          <span className="bg-border" style={{ flex: `${100 - investShare} 0 0` }} />
          <span
            className="flex items-center justify-center bg-success"
            style={{ flex: `${Math.max(investShare, 18)} 0 0` }}
          >
            <Text as="span" className="font-medium text-primary-foreground" variant="caption">
              {labels.yieldBar.replace('{amount}', formatUsd(interestUsd))}
            </Text>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {(
          [
            ['released', investedUsd, 'bg-primary-soft'],
            ['netYield', interestUsd, 'bg-coral-emphasis'],
            ['cost', investedUsd, 'bg-border'],
            ['grossYield', interestUsd, 'bg-success'],
          ] as const
        ).map(([key, value, dot]) => (
          <div className="flex items-center gap-1.5" key={key}>
            <span aria-hidden className={`size-2 rounded-full ${dot}`} />
            <Text as="span" className="text-foreground/40" variant="support">
              {labels.legend[key]}
            </Text>
            <Text as="strong" className="font-semibold" variant="support">
              {formatUsd(value)}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  )
}
