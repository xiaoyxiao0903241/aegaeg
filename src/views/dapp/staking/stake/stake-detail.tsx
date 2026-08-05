/**
 * 质押详情页（右栏）
 *
 * 展示协议概览、我的持仓、释放记录、机制说明、趋势图与 FAQ。
 * 未连接钱包时仓位与记录为空态。
 */
import { type ReactNode } from 'react'

import { Grid } from '~/app/shell/grid'
import { Tile } from '~/app/shell/tile'
import { formatCompactUsd, formatSignedPercent } from '~/shared/api/format-display'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { useStakeDetailAsideView } from '~/views/dapp/staking/stake/use-stake-detail-aside-view'
import { StakingMechanismCard } from '~/views/dapp/staking/staking-mechanism-card'
import { StakingTvlChart } from '~/views/dapp/staking/staking-tvl-chart'
import { useStakingDetailAsideView } from '~/views/dapp/staking/use-staking-detail-aside-view'

function MetricValue({ value }: { value: ReactNode }) {
  return (
    <Text
      as="strong"
      className="block min-w-0 text-base/5 font-semibold tracking-normal"
      variant="headline"
    >
      {typeof value === 'string' ? <CountValue text={value} /> : value}
    </Text>
  )
}

export function StakeDetail() {
  const { overviewItems, positionItems, recordRows, recordsLoading } = useStakeDetailAsideView()
  const { t, selectTab, chartRange, setChartRange } = useStakingDetailAsideView()

  return (
    <Detail>
      <Section>
        <Section.Title>{t.staking.aside.overview}</Section.Title>
        {/* jscpd:ignore-start — 右栏指标瓦页内同构 map */}
        <Grid columns={2}>
          {overviewItems.map((item) => (
            <Tile className="min-w-0" key={item.label}>
              <Tile.Label>{item.label}</Tile.Label>
              <MetricValue value={item.value} />
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
        <Grid columns={6}>
          {positionItems.map((item, index) => (
            <Tile
              className={cn('min-w-0', index < 3 ? 'col-span-2 max-dapp:col-span-3' : 'col-span-3')}
              key={item.label}
            >
              <Tile.Label>{item.label}</Tile.Label>
              <MetricValue value={item.value} />
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
        <StakingMechanismCard steps={t.staking.stake.mechanismSteps} />
      </Section>

      <Section>
        <Section.Title>{t.staking.aside.chartTitles.stake}</Section.Title>
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
        <Faq defaultOpenFirst={false} items={t.staking.stake.faq} variant="dapp" />
      </Section>
    </Detail>
  )
}
