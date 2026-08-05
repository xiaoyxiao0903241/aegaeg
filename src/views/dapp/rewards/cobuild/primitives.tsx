/** Cobuild mode UI 零件。 */
/**
 * 共建等级进度卡
 *
 * 上方对比当前档与下一档；下方三列展示升级要求与完成徽章。
 */
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import type { CobuildTierReq } from '~/views/dapp/rewards/cobuild/use-cobuild'
import { NON_NUMERIC_EMPTY } from '~/views/dapp/rewards/shared'

export function CobuildTierCard({
  achievedLabel,
  nextLabel,
  nextRate,
  nextValue,
  currentLabel,
  currentRate,
  currentValue,
  reqs,
}: {
  achievedLabel: string
  currentLabel: string
  currentRate: string
  currentValue: string
  nextLabel: string
  nextRate: string
  nextValue: string
  reqs: ReadonlyArray<CobuildTierReq>
}) {
  return (
    <Card surface="elevated" className="flex flex-col gap-4.5 overflow-visible rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-1">
          <Text as="p" className="leading-none text-foreground/40" variant="copy">
            {currentLabel}
          </Text>
          <div className="flex items-center gap-2.5">
            <Text
              as="p"
              className="leading-none font-semibold"
              variant={currentRate !== NON_NUMERIC_EMPTY ? 'figure' : 'headline'}
            >
              {currentValue}
            </Text>
            {currentRate !== NON_NUMERIC_EMPTY ? (
              <Text
                as="span"
                className="rounded-full bg-primary-soft px-2 py-0.5 leading-none font-semibold text-primary"
                variant="caption"
              >
                {currentRate}
              </Text>
            ) : null}
          </div>
        </div>
        <div className="grid gap-1 text-right">
          <Text as="p" className="leading-none text-foreground/40" variant="copy">
            {nextLabel}
          </Text>
          <div className="flex items-center justify-end gap-2">
            <Text as="p" className="leading-none font-semibold" variant="headline">
              {nextValue}
            </Text>
            {nextRate !== NON_NUMERIC_EMPTY ? (
              <Text
                as="span"
                className="leading-none font-semibold text-foreground/40"
                variant="caption"
              >
                {nextRate}
              </Text>
            ) : null}
          </div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {reqs.map((req) => (
          <div
            className="flex flex-col gap-1.5 rounded-control bg-muted px-4 py-3.5"
            key={req.label}
          >
            <div className="flex items-center justify-between gap-2">
              <Text as="p" className="leading-none text-foreground/40" variant="caption">
                {req.label}
              </Text>
              {req.badge.kind === 'achieved' ? (
                <Text
                  as="span"
                  className="rounded-full bg-success-soft px-2 py-0.5 leading-none font-semibold text-success"
                  variant="caption"
                >
                  {achievedLabel}
                </Text>
              ) : req.badge.kind === 'pct' ? (
                <Text
                  as="span"
                  className="rounded-full bg-primary-soft px-2 py-0.5 leading-none font-semibold text-primary"
                  variant="caption"
                >
                  {req.badge.value}
                </Text>
              ) : null}
            </div>
            <div className="flex items-baseline gap-1.5">
              <Text as="p" className="leading-none font-semibold" variant="headline">
                {req.value}
              </Text>
              <Text as="p" className="leading-none text-foreground/40" variant="caption">
                {req.target}
              </Text>
            </div>
            <Text as="p" className="leading-none text-foreground/40" variant="caption">
              {req.hint}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  )
}
