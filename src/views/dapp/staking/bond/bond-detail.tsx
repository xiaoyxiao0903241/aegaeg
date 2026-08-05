/**
 * 债券详情页（右栏）
 *
 * 展示协议概览、我的仓位、释放记录、机制说明、趋势图与 FAQ。
 */
import { Grid } from '~/app/shell/grid'
import { Tile } from '~/app/shell/tile'
import { formatCompactUsd, formatSignedPercent } from '~/shared/api/format-display'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import type { BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { useBondDetailAsideView } from '~/views/dapp/staking/bond/use-bond-detail-aside-view'
import { StakingMechanismCard } from '~/views/dapp/staking/staking-mechanism-card'
import { StakingMetricValue } from '~/views/dapp/staking/staking-metric-value'
import { StakingTvlChart } from '~/views/dapp/staking/staking-tvl-chart'
import { useStakingDetailAsideView } from '~/views/dapp/staking/use-staking-detail-aside-view'

export function BondDetail({ kind }: { kind: BondKind }) {
  const { copy, overviewItems, positionItems, recordRows, recordsLoading } =
    useBondDetailAsideView(kind)
  const { t, selectTab, chartRange, setChartRange } = useStakingDetailAsideView()
  const recordsTitle =
    kind === 'lp' ? t.staking.aside.recordsTitles.lpbond : t.staking.aside.recordsTitles.burnbond
  const chartTitle =
    kind === 'lp' ? t.staking.aside.chartTitles.lpbond : t.staking.aside.chartTitles.burnbond
  const recordsEmpty = recordsLoading
    ? '…'
    : kind === 'lp'
      ? t.staking.aside.recordsEmpty.lpbond
      : t.staking.aside.recordsEmpty.burnbond

  return (
    <Detail>
      <Section>
        <Section.Title>{t.staking.aside.overview}</Section.Title>
        {/* jscpd:ignore-start — 右栏指标瓦页内同构 map */}
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
        {/* jscpd:ignore-start — 右栏指标瓦页内同构 map */}
        <Grid columns={2}>
          {positionItems.map((item) => (
            <Tile className="min-w-0" key={item.label}>
              <Tile.Label>{item.label}</Tile.Label>
              <StakingMetricValue value={item.value} />
            </Tile>
          ))}
        </Grid>
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <Section.Title>{recordsTitle}</Section.Title>
        <Table>
          <Table.Body
            colWidths={['8.75rem', '4.375rem', '5.625rem', '4.375rem', '6.875rem', '1fr']}
            empty={recordsEmpty}
            headers={[...t.staking.aside.bondRecordColumns]}
            rows={[...(recordRows ?? [])]}
          />
        </Table>
      </Section>

      <Section>
        <Section.Title>{copy.mechanismTitle}</Section.Title>
        <StakingMechanismCard steps={copy.mechanismSteps} />
      </Section>

      <Section>
        <Section.Title>{chartTitle}</Section.Title>
        <StakingTvlChart
          chartRange={chartRange}
          deltaLabel={formatSignedPercent(null)}
          emptyLabel={t.staking.aside.chartEmpty}
          rangeAriaLabel={t.staking.aside.chartRangeAria}
          rangeLabels={t.staking.aside.chartRanges}
          setChartRange={setChartRange}
          surface="elevated"
          valueLabel={formatCompactUsd(null)}
        />
      </Section>

      <Section>
        <Section.Title>{t.staking.aside.faq}</Section.Title>
        <Faq defaultOpenFirst={false} items={copy.faq} variant="dapp" />
      </Section>
    </Detail>
  )
}
