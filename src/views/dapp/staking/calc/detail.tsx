/**
 * 测算结果详情页（右栏）
 *
 * 展示收益结果：总收益、卖出占比、投入占比、节点卡与曲线图。
 * 结果未就绪时骨架对齐结果卡、曲线金额与节点主值。
 */
import { baseDailyPctFromEpoch } from '~/core/staking/staking-yield'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { Chip } from '~/shared/components/chip'
import { Detail } from '~/shared/components/detail'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { Skeleton } from '~/shared/components/skeleton'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { Tooltip } from '~/shared/components/tooltip'
import { formatNumber } from '~/shared/presenters/format'
import { useCalcEstimateStore } from '~/stores/calc-estimate-store'
import {
  CalcNotesCard,
  CalcResultCard,
  CalcResultCardSkeleton,
} from '~/views/dapp/staking/calc/primitives'
import { StakingCurveChart } from '~/views/dapp/staking/primitives'

const PLACEHOLDER = '0.00'

export function CalcDetail() {
  const { messages: t } = useI18n()
  const aside = t.staking.calc.aside
  const result = useCalcEstimateStore((state) => state.result)
  const rates = useCalcEstimateStore((state) => state.rates)
  const formProduct = useCalcEstimateStore((state) => state.product)
  const formPeriod = useCalcEstimateStore((state) => state.period)
  const formDays = useCalcEstimateStore((state) => state.days)

  const shownProduct = result?.product ?? formProduct
  const shownPeriod = result?.period ?? formPeriod
  const shownDays = result?.days ?? formDays
  const productLabel = t.staking.calc.products[shownProduct]
  const periodLabel =
    shownPeriod === 'liquid'
      ? t.staking.stake.periods.liquid
      : shownPeriod === '180'
        ? t.staking.stake.periods.d180
        : shownPeriod === '360'
          ? t.staking.stake.periods.d360
          : shownPeriod === '540'
            ? t.staking.stake.periods.d540
            : shownPeriod

  const baseDaily = result
    ? baseDailyPctFromEpoch(result.epochRebasePct, result.epochsPerDay)
    : baseDailyPctFromEpoch(rates?.epochRebasePct ?? null, rates?.epochsPerDay ?? null)
  const notesItems = aside.notesItems.map((item, index) => {
    if (index !== 0) return item
    const daily =
      baseDaily != null ? formatNumber(baseDaily, { digits: 2 }) : formatNumber(0, { digits: 2 })
    return item.replaceAll('{daily}', daily)
  })

  return (
    <Detail>
      <Section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Section.Title>{aside.result}</Section.Title>
          {productLabel ? (
            <div className="flex flex-wrap gap-2">
              {(
                [
                  productLabel,
                  periodLabel,
                  interpolate(aside.tags.day, { day: shownDays }),
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
            investedUsd={result.investedUsd}
            labels={t.staking.calc.result}
            netYieldHint={
              result.product === 'xmine'
                ? t.staking.calc.result.legend.netYieldHintXmine
                : t.staking.calc.result.legend.netYieldHint
            }
            profitUsd={result.profitUsd}
            ratePct={result.ratePct}
            releasedUsd={result.releasedUsd}
            rewardsUsd={result.interestUsd}
            sellUsd={result.sellUsd}
          />
        ) : (
          <CalcResultCardSkeleton
            labels={t.staking.calc.result}
            netYieldHint={
              formProduct === 'xmine'
                ? t.staking.calc.result.legend.netYieldHintXmine
                : t.staking.calc.result.legend.netYieldHint
            }
          />
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
            const hint = 'hint' in card ? card.hint : undefined
            if (result == null) {
              return (
                <Tile key={card.label}>
                  <Tile.Label>
                    {card.label}
                    {hint ? <Tooltip.Info content={hint} /> : null}
                  </Tile.Label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Skeleton className="h-7 w-16" />
                    {'note' in card ? <Skeleton className="h-3.5 w-12" /> : null}
                  </div>
                </Tile>
              )
            }
            let value = PLACEHOLDER
            let note = 'note' in card ? card.note : undefined
            if (index === 0) {
              value =
                result.breakEvenDay != null
                  ? interpolate(aside.tags.day, { day: result.breakEvenDay })
                  : PLACEHOLDER
            } else if (index === 1) {
              value = interpolate(aside.tags.day, { day: result.fullReleaseDay })
            } else if (index === 2) {
              value = formatNumber(result.holdProfitUsd, { digits: 2, prefix: '$' })
              note = `${result.holdRatePct >= 0 ? '+' : ''}${formatNumber(result.holdRatePct, { digits: 2 })}%`
            }
            return (
              <Tile key={card.label}>
                <Tile.Label>
                  {index === 2
                    ? interpolate(aside.nodeEndLabel, { day: result.holdDay })
                    : card.label}
                  {hint ? <Tooltip.Info content={hint} /> : null}
                </Tile.Label>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Text
                    as="strong"
                    className={
                      index === 0
                        ? 'font-semibold text-coral-emphasis'
                        : index === 2
                          ? result.holdProfitUsd < 0
                            ? 'font-semibold text-destructive'
                            : 'font-semibold text-success'
                          : 'font-semibold'
                    }
                    variant="section"
                  >
                    {value}
                  </Text>
                  {note ? (
                    <Text as="span" className="text-foreground/40" variant="support">
                      {note}
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
