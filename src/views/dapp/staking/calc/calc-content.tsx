import { periodEndDays } from '~/core/staking/build-calc-estimate'
import { baseDailyPctFromEpoch, calcLocalInterest } from '~/core/staking/staking-yield-display'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { Card } from '~/shared/components/card'
import { Chip } from '~/shared/components/chip'
import { Detail } from '~/shared/components/detail'
import { Section } from '~/shared/components/section'
import { Text } from '~/shared/components/text'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'
import { StakingCurveChart } from '~/views/dapp/staking/staking-curve-chart'

/**
 * 测算结果详情页（右栏）
 *
 * 展示收益结果：总收益、卖出占比、投入占比、节点卡与曲线图。
 * 未填写表单或结果缺失时展示占位提示。
 */
const PLACEHOLDER = '0.00'
function formatUsdOrDash(value: number) {
  if (!Number.isFinite(value)) return PLACEHOLDER
  return formatGroupedNumber(value, { digits: 2, prefix: '$' })
}

function formatPct(value: number) {
  if (!Number.isFinite(value)) return PLACEHOLDER
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function CalcContent() {
  const { messages: t } = useI18n()
  const aside = t.staking.calc.aside
  const result = useCalcEstimateStore((state) => state.result)

  const productLabel = result ? t.staking.calc.products[result.product] : null
  const periodLabel = result
    ? result.period === 'liquid'
      ? t.staking.stake.periods.liquid
      : result.period === '180'
        ? t.staking.stake.periods.d180
        : result.period === '360'
          ? t.staking.stake.periods.d360
          : result.period === '540'
            ? t.staking.stake.periods.d540
            : result.period
    : null

  const endDays = result ? periodEndDays(result.period, result.days) : 0
  const endEstimate = result
    ? (() => {
        const est = calcLocalInterest({
          product: result.product,
          period: result.period,
          principal: result.principal,
          days: endDays,
          epochRebasePct: result.epochRebasePct,
        })
        const interestUsd = est.interest * result.price
        const investedUsd =
          result.product === 'lpbond' || result.product === 'burnbond'
            ? result.principal
            : result.principal * result.price
        return {
          interestUsd,
          ratePct: investedUsd > 0 ? (interestUsd / investedUsd) * 100 : 0,
        }
      })()
    : null

  const sellShare =
    result && result.sellUsd > 0 ? Math.min(100, (result.interestUsd / result.sellUsd) * 100) : 50
  const investShare =
    result && result.interestUsd + result.investedUsd > 0
      ? Math.min(100, (result.interestUsd / (result.interestUsd + result.investedUsd)) * 100)
      : 50

  const baseDaily = result ? baseDailyPctFromEpoch(result.epochRebasePct) : null
  const notesItems = aside.notesItems.map((item, index) => {
    if (index !== 0) return item
    const daily =
      baseDaily != null
        ? formatGroupedNumber(baseDaily, { digits: 2 })
        : formatGroupedNumber(0, { digits: 2 })
    return item.replaceAll('{daily}', daily)
  })

  return (
    <Detail>
      <Section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Section.Title>{aside.result}</Section.Title>
          {result ? (
            <div className="flex flex-wrap gap-2">
              {(
                [
                  productLabel,
                  periodLabel,
                  aside.tags.day.replace('{day}', String(result.days)),
                ] as const
              ).map((label) =>
                label ? (
                  <Chip
                    className="h-auto min-h-0 cursor-default px-2.5 py-1 text-xs font-semibold hover:scale-100"
                    key={label}
                    shape="pill"
                    size="sm"
                    tabIndex={-1}
                    tone="coral"
                    type="button"
                    variant="soft"
                  >
                    {label}
                  </Chip>
                ) : null,
              )}
            </div>
          ) : null}
        </div>
        {result ? (
          /* 结果卡用 elevated 表面（无描边） */
          <Card className="grid gap-1.5" surface="elevated">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-1">
                <Text as="span" className="text-foreground/40" variant="copy">
                  {t.staking.calc.result.total}
                </Text>
                <Text as="strong" className="text-success" variant="stat">
                  {formatUsdOrDash(result.interestUsd)}
                </Text>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5">
                <Text as="span" className="text-foreground/40" variant="support">
                  {t.staking.calc.result.rate}
                </Text>
                <Text as="span" className="font-semibold text-success" variant="copy">
                  {formatPct(result.ratePct)}
                </Text>
              </span>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <Text as="span" className="text-foreground/40" variant="copy">
                  {t.staking.calc.result.sellTotal}
                </Text>
                <Text as="strong" className="font-semibold" variant="detail">
                  {formatUsdOrDash(result.sellUsd)}
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
                  {t.staking.calc.result.invested}
                </Text>
                <Text as="strong" className="font-semibold" variant="detail">
                  {formatUsdOrDash(result.investedUsd)}
                </Text>
              </div>
              <div className="flex overflow-hidden rounded-full">
                <span className="bg-border" style={{ flex: `${100 - investShare} 0 0` }} />
                <span
                  className="flex items-center justify-center bg-success"
                  style={{ flex: `${Math.max(investShare, 18)} 0 0` }}
                >
                  <Text as="span" className="font-medium text-primary-foreground" variant="caption">
                    {t.staking.calc.result.yieldBar.replace(
                      '{amount}',
                      formatUsdOrDash(result.interestUsd),
                    )}
                  </Text>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {(
                [
                  ['released', result.investedUsd, 'bg-primary-soft'],
                  ['netYield', result.interestUsd, 'bg-coral-emphasis'],
                  ['cost', result.investedUsd, 'bg-border'],
                  ['grossYield', result.interestUsd, 'bg-success'],
                ] as const
              ).map(([key, value, dot]) => (
                <div className="flex items-center gap-1.5" key={key}>
                  <span aria-hidden className={`size-2 rounded-full ${dot}`} />
                  <Text as="span" className="text-foreground/40" variant="support">
                    {t.staking.calc.result.legend[key]}
                  </Text>
                  <Text as="strong" className="font-semibold" variant="support">
                    {formatUsdOrDash(value)}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
            {aside.resultHint}
          </Text>
        )}
      </Section>
      <Section>
        <Section.Title>{aside.curve}</Section.Title>
        <StakingCurveChart />
      </Section>
      <Section>
        <Section.Title>{aside.nodes}</Section.Title>
        <div className="grid gap-4 sm:grid-cols-3">
          {aside.nodeCards.map((card, index) => {
            let value = PLACEHOLDER
            let hint = card.hint
            if (result && index === 0) {
              value = aside.tags.day.replace('{day}', '1')
            } else if (result && index === 1) {
              value = aside.tags.day.replace(
                '{day}',
                String(periodEndDays(result.period, result.days)),
              )
            } else if (result && endEstimate && index === 2) {
              value = formatUsdOrDash(endEstimate.interestUsd)
              hint = formatPct(endEstimate.ratePct)
            }
            return (
              <Card className="grid gap-1.5" key={card.label} surface="elevated">
                <Text as="span" className="text-foreground/70" variant="support">
                  {index === 2 ? aside.nodeEndLabel.replace('{day}', String(endDays)) : card.label}
                </Text>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Text
                    as="strong"
                    className={
                      index === 0
                        ? 'font-semibold text-coral-emphasis'
                        : index === 2
                          ? 'font-semibold text-success'
                          : 'font-semibold'
                    }
                    variant="section"
                  >
                    {value}
                  </Text>
                  {hint ? (
                    <Text as="span" className="text-foreground/40" variant="support">
                      {hint}
                    </Text>
                  ) : null}
                </div>
              </Card>
            )
          })}
        </div>
      </Section>
      <Section>
        <Section.Title>{aside.notes}</Section.Title>
        <Card className="grid gap-1.5" surface="elevated">
          <ul className="m-0 grid list-none gap-1.5 p-0">
            {notesItems.map((item) => (
              <li className="flex items-center gap-2.5" key={item}>
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-coral-emphasis" />
                <Text as="p" className="m-0 text-foreground/70" variant="copy">
                  {item}
                </Text>
              </li>
            ))}
          </ul>
        </Card>
      </Section>
    </Detail>
  )
}
