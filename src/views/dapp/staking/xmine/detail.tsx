/**
 * Xmine 详情页（右栏）
 *
 * 展示协议概览、X 价值轮播、我的仓位、释放记录、
 * 机制说明、趋势图与 FAQ。
 * X 价格卡右侧可打开 DexScreener K 线。
 */
import { xmineValueAssets } from '~/shared/assets/dapp'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Icon } from '~/shared/components/icon'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { Tooltip } from '~/shared/components/tooltip'
import { cn } from '~/shared/lib/utils'
import { openAssetsView } from '~/views/dapp/shared/navigation'
import {
  StakingMechanismCard,
  StakingMetricValue,
  StakingTvlChart,
} from '~/views/dapp/staking/primitives'
import { useStakingDetail } from '~/views/dapp/staking/use-detail'
import { StakingXValueCarousel } from '~/views/dapp/staking/xmine/primitives'
import { useXmineDetail } from '~/views/dapp/staking/xmine/use-xmine'

export function XmineDetail() {
  const {
    overviewItems,
    positionItems,
    recordRows,
    recordsLoading,
    recordsPage,
    recordsTotal,
    recordsSummary,
    setRecordsPage,
  } = useXmineDetail()
  const {
    t,
    chartRange,
    setChartRange,
    chartLoading,
    chartPoints,
    chartValueLabel,
    chartDeltaLabel,
  } = useStakingDetail('xmine')
  const xValue = t.staking.aside.xValue

  return (
    <Detail>
      <Section>
        <Section.Title>{t.staking.aside.overview}</Section.Title>
        {/* jscpd:ignore-start — Tile 指标区页内拼装，禁再抽统一包装 */}
        <Grid columns={6}>
          {overviewItems.map((item, index) => (
            <Tile
              className={cn(
                index < 2 ? 'col-span-3 min-w-0' : 'col-span-2 min-w-0 max-dapp:col-span-3',
                item.klineHref ? 'relative pr-12' : null,
              )}
              key={item.label}
            >
              {item.klineHref ? (
                <Text
                  as="a"
                  aria-label={t.staking.xmine.openKlineChart}
                  className="duration-dapp-fast absolute top-1/2 right-3.5 grid size-8.5 -translate-y-1/2 place-items-center rounded-control border border-border bg-card no-underline transition-[border-color,transform] hover:-translate-y-[calc(50%+1px)] hover:border-primary/40"
                  href={item.klineHref}
                  rel="noopener noreferrer"
                  target="_blank"
                  tone="primary"
                >
                  <Icon alt="" src={xmineValueAssets.kline} />
                </Text>
              ) : null}
              <Tile.Label>
                {item.label}
                {item.hint ? <Tooltip.Info content={item.hint} /> : null}
              </Tile.Label>
              <StakingMetricValue value={item.value} />
            </Tile>
          ))}
        </Grid>
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <Section.Title>{xValue.title}</Section.Title>
        <StakingXValueCarousel copy={xValue} />
      </Section>

      <Section>
        {/* jscpd:ignore-start — 仓位标题行页内拼装，禁再抽 Section 薄包装 */}
        <div className="flex items-center gap-2.5">
          <Section.Title>{t.staking.aside.positions}</Section.Title>
          <button
            className="inline-flex items-center rounded-full bg-primary/15 px-2.5"
            onClick={() => openAssetsView('xmine')}
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
                {item.hint ? <Tooltip.Info content={item.hint} /> : null}
              </Tile.Label>
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
            empty={recordsLoading ? '…' : t.staking.aside.recordsEmpty.xmine}
            emphasisColumns={[1]}
            headers={[...t.staking.aside.xmineRecordColumns]}
            mutedColumns={[0]}
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
        <Section.Title>{t.staking.xmine.mechanismTitle}</Section.Title>
        <StakingMechanismCard steps={t.staking.xmine.mechanismSteps} />
      </Section>

      {/* jscpd:ignore-start — 趋势图与 FAQ 节页内拼装，禁再抽 Section 薄包装 */}
      <Section>
        <Section.Title>{t.staking.aside.chartTitles.xmine}</Section.Title>
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
        <Faq defaultOpenFirst={false} items={t.staking.xmine.faq} variant="dapp" />
      </Section>
      {/* jscpd:ignore-end */}
    </Detail>
  )
}
