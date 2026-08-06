/**
 * Xmine 详情页（右栏）
 *
 * 展示 X 价值说明、协议概览、我的仓位、释放记录、
 * 机制说明、趋势图与 FAQ。
 */
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { formatPercentChange, formatUsd } from '~/shared/presenters/format-display'
import {
  StakingMechanismCard,
  StakingMetricValue,
  StakingTvlChart,
} from '~/views/dapp/staking/primitives'
import { useStakingDetail } from '~/views/dapp/staking/use-detail'
import { StakingXValueCard } from '~/views/dapp/staking/xmine/primitives'
import { useXmineDetail } from '~/views/dapp/staking/xmine/use-xmine'

export function XmineDetail() {
  const { overviewItems, positionItems, recordRows, recordsLoading } = useXmineDetail()
  const { t, selectTab, chartRange, setChartRange } = useStakingDetail()
  const xValue = t.staking.aside.xValue

  return (
    <Detail>
      <Section>
        <Section.Title>{t.staking.aside.overview}</Section.Title>
        {/* jscpd:ignore-start — Tile 指标区页内拼装，禁再抽统一包装 */}
        <Grid columns={6}>
          {overviewItems.map((item, index) => (
            <Tile
              className={
                index < 2 ? 'col-span-3 min-w-0' : 'col-span-2 min-w-0 max-dapp:col-span-3'
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
        <Section.Title>{xValue.title}</Section.Title>
        <StakingXValueCard
          badge={xValue.badge}
          columns={xValue.columns}
          supplyLabel={xValue.supplyLabel}
          supplyValue={xValue.supplyValue}
        />
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
        <Section.Title>{t.staking.aside.recordsTitles.xmine}</Section.Title>
        <Table>
          <Table.Body
            colWidths={['10.9375rem', '6.25rem', '8.75rem', '1fr']}
            empty={recordsLoading ? '…' : t.staking.aside.recordsEmpty.xmine}
            headers={[...t.staking.aside.xmineRecordColumns]}
            rows={[...(recordRows ?? [])]}
          />
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.staking.xmine.mechanismTitle}</Section.Title>
        <StakingMechanismCard steps={t.staking.xmine.mechanismSteps} />
      </Section>

      {/* jscpd:ignore-start — 趋势图与 FAQ 节页内拼装，禁再抽 Section 薄包装 */}
      <Section>
        <Section.Title>{t.staking.aside.chartTitles.xmine}</Section.Title>
        <StakingTvlChart
          chartRange={chartRange}
          deltaLabel={formatPercentChange(null)}
          emptyLabel={t.staking.aside.chartEmpty}
          rangeAriaLabel={t.staking.aside.chartRangeAria}
          rangeLabels={t.staking.aside.chartRanges}
          setChartRange={setChartRange}
          surface="elevated"
          valueLabel={formatUsd(null)}
        />
      </Section>

      <Section>
        <Section.Title>{t.staking.aside.faq}</Section.Title>
        <Faq defaultOpenFirst={false} items={t.staking.xmine.faq} variant="dapp" />
      </Section>
      {/* jscpd:ignore-end */}
    </Detail>
  )
}
