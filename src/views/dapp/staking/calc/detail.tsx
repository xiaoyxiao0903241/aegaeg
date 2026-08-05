/**
 * 测算结果详情页（右栏）
 *
 * 展示收益结果：总收益、卖出占比、投入占比、节点卡与曲线图。
 * 未填写表单或结果缺失时展示占位提示。
 */
import { periodEndDays } from '~/core/staking/build-calc-estimate'
import { baseDailyPctFromEpoch, calcLocalInterest } from '~/core/staking/staking-yield-display'
import { useI18n } from '~/i18n/use-i18n'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { Chip } from '~/shared/components/chip'
import { Detail } from '~/shared/components/detail'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'
import {
  CalcNotesCard,
  CalcResultCard,
  formatPct,
  formatUsd,
} from '~/views/dapp/staking/calc/primitives'
import { StakingCurveChart } from '~/views/dapp/staking/primitives'

const PLACEHOLDER = '0.00'

export function CalcDetail() {
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
          <CalcResultCard
            interestUsd={result.interestUsd}
            investedUsd={result.investedUsd}
            investShare={investShare}
            labels={t.staking.calc.result}
            ratePct={result.ratePct}
            sellShare={sellShare}
            sellUsd={result.sellUsd}
          />
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
        <Grid columns={3}>
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
              value = formatUsd(endEstimate.interestUsd)
              hint = formatPct(endEstimate.ratePct)
            }
            return (
              <Tile key={card.label}>
                <Tile.Label>
                  {index === 2 ? aside.nodeEndLabel.replace('{day}', String(endDays)) : card.label}
                </Tile.Label>
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
              </Tile>
            )
          })}
        </Grid>
      </Section>
      <Section>
        <Section.Title>{aside.notes}</Section.Title>
        <CalcNotesCard items={notesItems} />
      </Section>
    </Detail>
  )
}
