/**
 * 共建奖右栏零件：等级进度卡。
 */
import { Check } from 'lucide-react'

import { StatusBadge } from '~/shared/components/badge'
import { Card } from '~/shared/components/card'
import { ProgressBar } from '~/shared/components/progress-bar'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import type { CobuildTierReq } from '~/views/dapp/rewards/cobuild/use-cobuild'
import { NON_NUMERIC_EMPTY } from '~/views/dapp/rewards/shared'

function reqBarPct(req: CobuildTierReq): number {
  if (req.badge.kind === 'achieved') return 100
  if (req.badge.kind === 'pct') {
    const n = Number.parseInt(req.badge.value, 10)
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0
  }
  return 0
}

/**
 * 共建等级进度卡
 *
 * 当前/下一档同一行；下方为晋升条件进度条与徽章。
 * 未达成用主色；已达成用复投蓝。
 */
export function CobuildTierCard({
  achievedLabel,
  nextLabel,
  nextRate,
  nextValue,
  currentLabel,
  currentRate,
  currentValue,
  hasNext,
  maxLabel,
  progressCount,
  progressTitle,
  reqs,
}: {
  achievedLabel: string
  currentLabel: string
  currentRate: string
  currentValue: string
  hasNext: boolean
  maxLabel: string
  nextLabel: string
  nextRate: string
  nextValue: string
  progressCount: string
  progressTitle: string
  reqs: ReadonlyArray<CobuildTierReq>
}) {
  return (
    <Card surface="elevated" className="flex flex-col gap-4.5 overflow-visible rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3.5">
        <span className="inline-flex flex-wrap items-baseline gap-2.5">
          <Text as="span" className="leading-none text-foreground/50" variant="copy">
            {currentLabel}
          </Text>
          <Text as="strong" className="leading-none font-semibold" variant="figure">
            {currentValue}
          </Text>
          {currentRate !== NON_NUMERIC_EMPTY ? (
            <StatusBadge className="font-semibold" size="compact" tone="pending">
              {currentRate}
            </StatusBadge>
          ) : null}
        </span>
        {hasNext ? (
          <span className="inline-flex flex-wrap items-baseline justify-end gap-2">
            <Text as="span" className="leading-none text-foreground/50" variant="copy">
              {nextLabel}
            </Text>
            <Text as="strong" className="leading-none font-semibold" variant="headline">
              {nextValue}
            </Text>
            {nextRate !== NON_NUMERIC_EMPTY ? (
              <Text
                as="span"
                className="leading-none font-semibold text-foreground/45"
                variant="caption"
              >
                {nextRate}
              </Text>
            ) : null}
          </span>
        ) : (
          <StatusBadge className="font-semibold" size="compact" tone="muted">
            {maxLabel}
          </StatusBadge>
        )}
      </div>
      {hasNext && reqs.length > 0 ? (
        <div className="grid gap-3 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-3">
            <Text as="p" className="leading-none font-semibold" variant="copy">
              {progressTitle}
            </Text>
            <Text as="p" className="leading-none text-foreground/45" variant="caption">
              {progressCount}
            </Text>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {reqs.map((req) => {
              const achieved = req.badge.kind === 'achieved'
              return (
                <article
                  className={cn(
                    'relative grid content-start gap-2.5 rounded-sm border p-4',
                    achieved ? 'border-claim/25 bg-claim/4' : 'border-border bg-card',
                  )}
                  key={req.label}
                >
                  <span className="flex items-center justify-between gap-2">
                    <Text as="p" className="leading-none text-foreground/50" variant="caption">
                      {req.label}
                    </Text>
                    {achieved ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-claim/14 px-2 py-0.5">
                        <Check aria-hidden className="size-2.25 text-claim" strokeWidth={2.5} />
                        <Text
                          as="span"
                          className="leading-none font-semibold"
                          tone="claim"
                          variant="caption"
                        >
                          {achievedLabel}
                        </Text>
                      </span>
                    ) : req.badge.kind === 'pct' ? (
                      <StatusBadge className="font-semibold" size="compact" tone="pending">
                        {req.badge.value}
                      </StatusBadge>
                    ) : null}
                  </span>
                  <span className="inline-flex items-baseline gap-1.5">
                    <Text
                      as="strong"
                      className="leading-none font-semibold wrap-break-word"
                      variant="headline"
                    >
                      {req.value}
                    </Text>
                    <Text as="span" className="leading-none text-foreground/40" variant="caption">
                      {req.target}
                    </Text>
                  </span>
                  <span className="grid gap-1.5">
                    <ProgressBar
                      label={req.label}
                      tone={achieved ? 'claim' : 'primary'}
                      value={reqBarPct(req)}
                    />
                    <Text as="p" className="leading-none text-foreground/40" variant="caption">
                      {req.hint}
                    </Text>
                  </span>
                </article>
              )
            })}
          </div>
        </div>
      ) : null}
    </Card>
  )
}
