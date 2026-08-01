import type { Time, UTCTimestamp } from 'lightweight-charts'

import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { periodEndDays } from '~/core/staking/build-calc-estimate'
import {
  baseDailyPctFromEpoch,
  buildCalcYieldCurvePoints,
  CALC_MAX_DAYS,
  calcLocalInterest,
} from '~/core/staking/staking-yield-display'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { Card } from '~/shared/ui/card'
import { Chip } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'
import {
  StakingTvAreaChart,
  type StakingTvAreaPoint,
} from '~/views/dapp/staking/staking-tv-area-chart'

const PLACEHOLDER = '0.00'
/** Figma `functional/up` on calc rcard — not token `success` (#2bab6a). */
const YIELD_UP = 'text-[#33d07a]'

function formatUsdOrDash(value: number) {
  if (!Number.isFinite(value)) return PLACEHOLDER
  return formatGroupedNumber(value, { digits: 2, prefix: '$' })
}

function formatPct(value: number) {
  if (!Number.isFinite(value)) return PLACEHOLDER
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

function pickDayAxisLabels(maxDays: number, dayTemplate: string, count = 5): readonly string[] {
  if (maxDays <= 0) return []
  if (count <= 1) return [dayTemplate.replace('{day}', '1')]
  const labels: string[] = []
  for (let i = 0; i < count; i += 1) {
    const day = Math.round(1 + (i / (count - 1)) * (maxDays - 1))
    labels.push(dayTemplate.replace('{day}', String(day)))
  }
  return labels
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
        const investedUsd = result.principal * result.price
        return {
          interestUsd,
          ratePct: investedUsd > 0 ? (interestUsd / investedUsd) * 100 : 0,
        }
      })()
    : null

  const curveEndEstimate = result
    ? (() => {
        const est = calcLocalInterest({
          product: result.product,
          period: result.period,
          principal: result.principal,
          days: CALC_MAX_DAYS,
          epochRebasePct: result.epochRebasePct,
        })
        return est.interest * result.price
      })()
    : null

  const curvePoints: readonly StakingTvAreaPoint[] = result
    ? buildCalcYieldCurvePoints({
        product: result.product,
        period: result.period,
        principal: result.principal,
        price: result.price,
        epochRebasePct: result.epochRebasePct,
        maxDays: CALC_MAX_DAYS,
      }).map((p) => ({
        time: p.day as UTCTimestamp,
        value: p.interestUsd,
      }))
    : []

  const curveAxisLabels = pickDayAxisLabels(CALC_MAX_DAYS, aside.tags.day, 5)

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
    <DappDetailPage>
      <DappDetailBlock>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <DappContentHeading className="m-0">{aside.result}</DappContentHeading>
          {result ? (
            <div className="flex flex-wrap gap-2">
              {/* Figma `bd` 4463:224 — coral-soft / coral-emphasis pill */}
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
          /* Figma `rcard` 4463:230 — elevated（无描边 + shadow-card），禁 outlined */
          <Card className="grid gap-1.5 p-4" surface="elevated">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-1">
                <Text as="span" className="text-[13px] text-foreground/40" variant="copy">
                  {t.staking.calc.result.total}
                </Text>
                <Text
                  as="strong"
                  className={`text-[32px] leading-none font-bold ${YIELD_UP}`}
                  variant="figure"
                >
                  {formatUsdOrDash(result.interestUsd)}
                </Text>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-[rgba(22,185,121,0.12)] px-3 py-1.5">
                <Text as="span" className="text-[12px] text-foreground/40" variant="caption">
                  {t.staking.calc.result.rate}
                </Text>
                <Text
                  as="span"
                  className={`text-[13px] font-semibold ${YIELD_UP}`}
                  variant="support"
                >
                  {formatPct(result.ratePct)}
                </Text>
              </span>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <Text as="span" className="text-[13px] text-foreground/40" variant="copy">
                  {t.staking.calc.result.sellTotal}
                </Text>
                <Text as="strong" className="text-[14px] font-semibold" variant="detail">
                  {formatUsdOrDash(result.sellUsd)}
                </Text>
              </div>
              <div className="flex h-3.5 overflow-hidden rounded-full">
                <span className="bg-[#fadbd1]" style={{ flex: `${100 - sellShare} 0 0` }} />
                <span className="bg-coral-emphasis" style={{ flex: `${sellShare} 0 0` }} />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <Text as="span" className="text-[13px] text-foreground/40" variant="copy">
                  {t.staking.calc.result.invested}
                </Text>
                <Text as="strong" className="text-[14px] font-semibold" variant="detail">
                  {formatUsdOrDash(result.investedUsd)}
                </Text>
              </div>
              <div className="flex h-3.5 overflow-hidden rounded-full">
                <span className="bg-[#dbdee3]" style={{ flex: `${100 - investShare} 0 0` }} />
                <span
                  className="flex items-center justify-center bg-[#33d07a]"
                  style={{ flex: `${Math.max(investShare, 18)} 0 0` }}
                >
                  <Text
                    as="span"
                    className="text-[11px] font-medium text-[#eceef2]"
                    variant="caption"
                  >
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
                  ['released', result.investedUsd, 'bg-[#fadbd1]'],
                  ['netYield', result.interestUsd, 'bg-coral-emphasis'],
                  ['cost', result.investedUsd, 'bg-[#dbdee3]'],
                  ['grossYield', result.interestUsd, 'bg-[#33d07a]'],
                ] as const
              ).map(([key, value, dot]) => (
                <div className="flex items-center gap-1.5" key={key}>
                  <span aria-hidden className={`size-2 rounded-full ${dot}`} />
                  <Text as="span" className="text-[12px] text-foreground/40" variant="caption">
                    {t.staking.calc.result.legend[key]}
                  </Text>
                  <Text as="strong" className="text-[12px] font-semibold" variant="caption">
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
        {/* Figma `ccard` 4463:273 — elevated；曲线 = 本地公式 day 1..720 */}
        <Card className="grid gap-3 p-4" surface="elevated">
          <Text as="p" className="m-0 text-[13px] text-foreground/40" variant="copy">
            {aside.curveHint}
          </Text>
          {curveEndEstimate != null ? (
            <Text as="strong" className="text-[18px] font-semibold" variant="copy">
              {formatUsdOrDash(curveEndEstimate)}
            </Text>
          ) : null}
          {curvePoints.length > 0 ? (
            <StakingTvAreaChart
              axisLabels={curveAxisLabels}
              formatTipDate={(time: Time) => {
                if (typeof time !== 'number') return null
                return aside.tags.day.replace('{day}', String(time))
              }}
              height={170}
              points={curvePoints}
            />
          ) : (
            <div className="flex min-h-50 items-center justify-center rounded-lg">
              <Text as="span" className="text-foreground/40" variant="copy">
                {PLACEHOLDER}
              </Text>
            </div>
          )}
        </Card>
      </DappDetailBlock>
      <DappDetailBlock>
        <DappContentHeading>{aside.nodes}</DappContentHeading>
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
              /* Figma `kc` 4463:289 — elevated */
              <Card className="grid gap-1.5 p-4" key={card.label} surface="elevated">
                <Text as="span" className="text-[12px] text-foreground/70" variant="caption">
                  {index === 2 ? aside.nodeEndLabel.replace('{day}', String(endDays)) : card.label}
                </Text>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Text
                    as="strong"
                    className={
                      index === 0
                        ? 'text-[18px] font-semibold text-coral-emphasis'
                        : index === 2
                          ? `text-[18px] font-semibold ${YIELD_UP}`
                          : 'text-[18px] font-semibold'
                    }
                    variant="copy"
                  >
                    {value}
                  </Text>
                  {hint ? (
                    <Text as="span" className="text-[12px] text-foreground/40" variant="caption">
                      {hint}
                    </Text>
                  ) : null}
                </div>
              </Card>
            )
          })}
        </div>
      </DappDetailBlock>
      <DappDetailBlock>
        <DappContentHeading>{aside.notes}</DappContentHeading>
        {/* Figma `ncard` 4463:303 — elevated */}
        <Card className="grid gap-1.5 p-4" surface="elevated">
          <ul className="m-0 grid list-none gap-1.5 p-0">
            {notesItems.map((item) => (
              <li className="flex items-center gap-2.5" key={item}>
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-coral-emphasis" />
                <Text as="p" className="m-0 text-[13px] text-foreground/70" variant="copy">
                  {item}
                </Text>
              </li>
            ))}
          </ul>
        </Card>
      </DappDetailBlock>
    </DappDetailPage>
  )
}
