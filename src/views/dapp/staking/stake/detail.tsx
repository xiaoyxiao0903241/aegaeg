/**
 * 质押详情页（右栏）
 *
 * 展示协议概览、我的持仓、释放记录、机制说明、趋势图与 FAQ。
 * 未连接钱包时仓位与记录为空态。
 */
import { usePrincipalReleaseDurationDays } from '~/hooks/use-principal-release-duration-days'
import { interpolate } from '~/i18n/interpolate'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import {
  mapFaqWithEpochSchedule,
  mapStepsWithEpochSchedule,
} from '~/views/dapp/shared/epoch-schedule'
import {
  StakingMechanismCard,
  StakingMetricValue,
  StakingTvlChart,
} from '~/views/dapp/staking/primitives'
import { useStakeDetail } from '~/views/dapp/staking/stake/use-stake'
import { useStakingDetail } from '~/views/dapp/staking/use-detail'
import { useEpochScheduleLabels } from '~/web3/staking/use-staking-queries'

export function StakeDetail() {
  const { overviewItems, positionItems, recordRows, recordsLoading } = useStakeDetail()
  const {
    t,
    selectTab,
    chartRange,
    setChartRange,
    chartLoading,
    chartPoints,
    chartValueLabel,
    chartDeltaLabel,
  } = useStakingDetail()
  const epochSchedule = useEpochScheduleLabels()
  const bufferDays = usePrincipalReleaseDurationDays().data ?? 30
  const mechanismSteps = mapStepsWithEpochSchedule(t.staking.stake.mechanismSteps, epochSchedule)
  const faqItems = mapFaqWithEpochSchedule(t.staking.stake.faq, epochSchedule).map((item) => ({
    ...item,
    a: interpolate(item.a, { days: bufferDays }),
  }))

  return (
    <Detail>
      <Section>
        <Section.Title>{t.staking.aside.overview}</Section.Title>
        {/* jscpd:ignore-start — Tile 指标区页内拼装，禁再抽统一包装 */}
        <Grid columns={2}>
          {overviewItems.map((item) => (
            <Tile className="min-w-0" key={item.label}>
              <Tile.Label>{item.label}</Tile.Label>
              <StakingMetricValue value={item.value} />
            </Tile>
          ))}
        </Grid>
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        {/* jscpd:ignore-start — 仓位标题行页内拼装，禁再抽 Section 薄包装 */}
        <div className="flex items-center gap-2.5">
          <Section.Title>{t.staking.aside.positions}</Section.Title>
          <button
            className="inline-flex items-center rounded-full bg-primary/15 px-2.5"
            onClick={() => selectTab('assets')}
            type="button"
          >
            <Text as="span" className="font-semibold" tone="primary" variant="support">
              {t.staking.aside.viewPositions}
            </Text>
          </button>
        </div>
        <Grid columns={6}>
          {positionItems.map((item, index) => (
            <Tile
              className={
                index < 3 ? 'col-span-2 min-w-0 max-dapp:col-span-3' : 'col-span-3 min-w-0'
              }
              key={item.label}
            >
              <Tile.Label>{item.label}</Tile.Label>
              <StakingMetricValue value={item.value} />
            </Tile>
          ))}
        </Grid>
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <Section.Title>{t.staking.aside.recordsTitles.stake}</Section.Title>
        <Table>
          <Table.Body
            colWidths={['10.9375rem', '5rem', '8.75rem', '5.625rem', '1fr']}
            empty={recordsLoading ? '…' : t.staking.aside.recordsEmpty.stake}
            headers={[...t.staking.aside.recordColumns]}
            rows={[...(recordRows ?? [])]}
          />
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.staking.stake.mechanismTitle}</Section.Title>
        <StakingMechanismCard steps={mechanismSteps} />
      </Section>

      {/* jscpd:ignore-start — 趋势图与 FAQ 节页内拼装，禁再抽 Section 薄包装 */}
      <Section>
        <Section.Title>{t.staking.aside.chartTitles.stake}</Section.Title>
        <StakingTvlChart
          chartRange={chartRange}
          deltaLabel={chartDeltaLabel}
          emptyLabel={t.staking.aside.chartEmpty}
          loading={chartLoading}
          points={chartPoints}
          rangeAriaLabel={t.staking.aside.chartRangeAria}
          rangeLabels={t.staking.aside.chartRanges}
          setChartRange={setChartRange}
          surface="elevated"
          valueLabel={chartValueLabel}
        />
      </Section>

      <Section>
        <Section.Title>{t.staking.aside.faq}</Section.Title>
        <Faq defaultOpenFirst={false} items={faqItems} variant="dapp" />
      </Section>
      {/* jscpd:ignore-end */}
    </Detail>
  )
}
