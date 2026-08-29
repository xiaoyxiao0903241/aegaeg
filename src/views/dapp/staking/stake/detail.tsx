/**
 * 质押详情页（右栏）
 *
 * 展示协议概览、我的持仓、释放记录、机制说明、趋势图与 FAQ。
 * 未连接钱包时仓位与记录为空态。
 */
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { Tooltip } from '~/shared/components/tooltip'
import { mapStepsWithEpochSchedule, withEpochSchedule } from '~/views/dapp/shared/epoch-schedule'
import { openAssetsView } from '~/views/dapp/shared/navigation'
import {
  StakingMechanismCard,
  StakingMetricValue,
  StakingTvlChart,
} from '~/views/dapp/staking/primitives'
import { useStakeDetail } from '~/views/dapp/staking/stake/use-stake'
import { useStakingDetail } from '~/views/dapp/staking/use-detail'
import { useEpochScheduleLabels } from '~/web3/staking/use-staking-queries'

export function StakeDetail() {
  const {
    overviewItems,
    positionItems,
    recordRows,
    recordsLoading,
    recordsPage,
    recordsTotal,
    recordsSummary,
    setRecordsPage,
  } = useStakeDetail()
  const {
    t,
    chartRange,
    setChartRange,
    chartLoading,
    chartPoints,
    chartValueLabel,
    chartDeltaLabel,
  } = useStakingDetail('stake')
  const epochSchedule = useEpochScheduleLabels()
  const mechanismSteps = mapStepsWithEpochSchedule(t.staking.stake.mechanismSteps, epochSchedule)

  return (
    <Detail>
      <Section>
        <Section.Title>{t.staking.aside.overview}</Section.Title>
        {/* jscpd:ignore-start — Tile 指标区页内拼装，禁再抽统一包装 */}
        <Grid columns={2}>
          {overviewItems.map((item) => (
            <Tile className="min-w-0" key={item.label}>
              <Tile.Label>
                {item.label}
                {item.hint ? (
                  <Tooltip.Info content={withEpochSchedule(item.hint, epochSchedule)} />
                ) : null}
              </Tile.Label>
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
            onClick={() => openAssetsView('stake')}
            type="button"
          >
            <Text as="span" className="font-semibold" tone="primary" variant="support">
              {t.staking.aside.viewPositions}
            </Text>
          </button>
        </div>
        <Grid columns={6} stackOnDapp>
          {positionItems.map((item, index) => (
            <Tile
              className={
                index < 3 ? 'col-span-2 min-w-0 max-dapp:col-span-3' : 'col-span-3 min-w-0'
              }
              key={item.label}
            >
              <Tile.Label>
                {item.label}
                {item.hint ? (
                  <Tooltip.Info content={withEpochSchedule(item.hint, epochSchedule)} />
                ) : null}
              </Tile.Label>
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
            empty={recordsLoading ? '…' : t.staking.aside.recordsEmpty.stake}
            headers={[...t.staking.aside.recordColumns]}
            mutedColumns={[0]}
            primaryColumns={[3]}
            rows={[...(recordRows ?? [])]}
          />
          {/* jscpd:ignore-start — 记录表底栏页内拼装，禁再抽 Section 薄包装 */}
          <Table.Footer>
            <Table.Pagination
              onPageChange={setRecordsPage}
              page={recordsPage}
              summary={recordsSummary}
              total={recordsTotal}
            />
          </Table.Footer>
          {/* jscpd:ignore-end */}
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
        <Faq defaultOpenFirst={false} items={t.staking.stake.faq} variant="dapp" />
      </Section>
      {/* jscpd:ignore-end */}
    </Detail>
  )
}
