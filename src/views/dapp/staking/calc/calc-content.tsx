import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import {
  calcStakingEstimate,
  defaultAprForBondPeriod,
  defaultAprForStakePeriod,
} from '~/core/staking/calc-staking-yield'
import type { BondPeriod, StakePeriod } from '~/core/staking/staking-period'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'
import { formatGroupedNumber } from '~/shared/api/format-display'

const PLACEHOLDER = '0.00'
const XMINE_APR = 0.1

function formatUsdOrDash(value: number) {
  if (!Number.isFinite(value)) return PLACEHOLDER
  return formatGroupedNumber(value, { digits: 2, prefix: '$' })
}

function formatPct(value: number) {
  if (!Number.isFinite(value)) return PLACEHOLDER
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/** Locked periods use tenure; liquid/unknown use the slider day count (no invented 540). */
function periodEndDays(period: string, sliderDays: number): number {
  if (period === '180') return 180
  if (period === '360') return 360
  if (period === '540') return 540
  return sliderDays
}

function aprFor(product: string, period: string): number {
  if (product === 'xmine') return XMINE_APR
  if (product === 'stake') return defaultAprForStakePeriod(period as StakePeriod)
  return defaultAprForBondPeriod(period as BondPeriod)
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
        const est = calcStakingEstimate({
          principal: result.principal,
          apr: aprFor(result.product, result.period),
          days: endDays,
        })
        const interestUsd = est.interest * result.price
        const investedUsd = result.principal * result.price
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

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <DappContentHeading className="m-0">{aside.result}</DappContentHeading>
          {result ? (
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[12px] font-semibold text-primary">
                {productLabel}
              </span>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[12px] font-semibold text-primary">
                {periodLabel}
              </span>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[12px] font-semibold text-primary">
                {aside.tags.day.replace('{day}', String(result.days))}
              </span>
            </div>
          ) : null}
        </div>
        {result ? (
          <Card surface="outlined" className="grid gap-3 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-1">
                <Text as="span" tone="muted-foreground" variant="detail">
                  {t.staking.calc.result.total}
                </Text>
                <Text as="strong" className="text-[28px] font-bold text-success" variant="copy">
                  {formatUsdOrDash(result.interestUsd)}
                </Text>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-success/15 px-3 py-1.5 text-[12px] font-semibold text-success">
                <Text as="span" className="font-medium" tone="muted-foreground" variant="detail">
                  {t.staking.calc.result.rate}
                </Text>
                {formatPct(result.ratePct)}
              </span>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <Text as="span" tone="muted-foreground" variant="detail">
                  {t.staking.calc.result.sellTotal}
                </Text>
                <Text as="strong" className="font-semibold" variant="detail">
                  {formatUsdOrDash(result.sellUsd)}
                </Text>
              </div>
              <div className="flex h-3.5 overflow-hidden rounded-full">
                <span className="bg-primary/25" style={{ flex: `${100 - sellShare} 0 0` }} />
                <span className="bg-primary" style={{ flex: `${sellShare} 0 0` }} />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <Text as="span" tone="muted-foreground" variant="detail">
                  {t.staking.calc.result.invested}
                </Text>
                <Text as="strong" className="font-semibold" variant="detail">
                  {formatUsdOrDash(result.investedUsd)}
                </Text>
              </div>
              <div className="flex h-3.5 overflow-hidden rounded-full">
                <span className="bg-muted" style={{ flex: `${100 - investShare} 0 0` }} />
                <span
                  className="flex items-center justify-center bg-success text-[11px] font-medium text-white"
                  style={{ flex: `${Math.max(investShare, 18)} 0 0` }}
                >
                  {t.staking.calc.result.yieldBar.replace(
                    '{amount}',
                    formatUsdOrDash(result.interestUsd),
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {(
                [
                  ['released', result.investedUsd],
                  ['netYield', result.interestUsd],
                  ['cost', result.investedUsd],
                  ['grossYield', result.interestUsd],
                ] as const
              ).map(([key, value]) => (
                <div className="flex items-center gap-1.5" key={key}>
                  <span
                    aria-hidden
                    className={
                      key === 'released'
                        ? 'size-2 rounded-full bg-primary/30'
                        : key === 'netYield'
                          ? 'size-2 rounded-full bg-primary'
                          : key === 'cost'
                            ? 'size-2 rounded-full bg-muted-foreground/40'
                            : 'size-2 rounded-full bg-success'
                    }
                  />
                  <Text as="span" tone="muted-foreground" variant="detail">
                    {t.staking.calc.result.legend[key]}
                  </Text>
                  <Text as="strong" className="font-semibold" variant="detail">
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
      </DappDetailBlock>
      <DappDetailBlock>
        <DappContentHeading>{aside.curve}</DappContentHeading>
        <Text as="p" className="mb-3" tone="muted-foreground" variant="detail">
          {aside.curveHint}
        </Text>
        {endEstimate ? (
          <Text as="strong" className="mb-2 block text-lg font-semibold" variant="copy">
            {formatUsdOrDash(endEstimate.interestUsd)}
          </Text>
        ) : null}
        <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border">
          <Text as="span" tone="muted-foreground" variant="copy">
            {PLACEHOLDER}
          </Text>
        </div>
      </DappDetailBlock>
      <DappDetailBlock>
        <DappContentHeading>{aside.nodes}</DappContentHeading>
        <div className="grid gap-3 sm:grid-cols-3">
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
              <Card
                className="grid gap-1.5 rounded-2xl p-4 shadow-sm"
                key={card.label}
                surface="outlined"
              >
                <Text as="span" tone="muted-foreground" variant="detail">
                  {index === 2 ? aside.nodeEndLabel.replace('{day}', String(endDays)) : card.label}
                </Text>
                <Text
                  as="strong"
                  className={
                    index === 2 ? 'font-semibold text-success' : 'font-semibold text-primary'
                  }
                  variant="copy"
                >
                  {value}
                </Text>
                {hint ? (
                  <Text as="span" tone="muted-foreground" variant="detail">
                    {hint}
                  </Text>
                ) : null}
              </Card>
            )
          })}
        </div>
      </DappDetailBlock>
      <DappDetailBlock>
        <DappContentHeading>{aside.notes}</DappContentHeading>
        <ul className="m-0 grid list-none gap-2 p-0">
          {aside.notesItems.map((item) => (
            <li className="flex gap-2.5" key={item}>
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <Text as="p" className="m-0" tone="muted-foreground" variant="detail">
                {item}
              </Text>
            </li>
          ))}
        </ul>
      </DappDetailBlock>
    </DappDetailPage>
  )
}
