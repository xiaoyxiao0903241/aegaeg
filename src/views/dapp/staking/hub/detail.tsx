import { ChipTabs } from '~/shared/components/chip-tabs'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { Segment } from '~/shared/components/segment'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { Tooltip } from '~/shared/components/tooltip'
import { HubMetricValueRow } from '~/views/dapp/staking/hub/primitives'
import { useStakingHubDetail } from '~/views/dapp/staking/hub/use-hub'
import { StakingTvlChart } from '~/views/dapp/staking/primitives'

type MetricTone = 'default' | 'accent'
type MetricIcon = 'agx' | 'usd1' | null
type HubMetricId =
  'tvl' | 'mcap' | 'circulating' | 'treasury' | 'price' | 'burned' | 'rebase' | 'runway' | 'stakers'

const METRIC_CHROME: Record<HubMetricId, { tone: MetricTone; icon: MetricIcon; hasSub: boolean }> =
  {
    tvl: { tone: 'default', icon: 'agx', hasSub: true },
    mcap: { tone: 'default', icon: null, hasSub: false },
    circulating: { tone: 'default', icon: 'agx', hasSub: false },
    treasury: { tone: 'default', icon: 'usd1', hasSub: true },
    price: { tone: 'default', icon: 'agx', hasSub: false },
    burned: { tone: 'default', icon: 'agx', hasSub: false },
    rebase: { tone: 'accent', icon: null, hasSub: false },
    runway: { tone: 'accent', icon: null, hasSub: false },
    stakers: { tone: 'default', icon: null, hasSub: false },
  }

function isHubMetricId(id: string): id is HubMetricId {
  return id in METRIC_CHROME
}

/**
 * 质押总览详情页（右栏）
 *
 * 依次展示协议概览指标卡、周期收益率表、TVL / 市值趋势图与 FAQ。
 * 周期表与图表支持 Tab / 时间范围切换；
 * 未连接钱包或数据未就绪时部分数值以 0 或占位展示。
 */
export function StakingHubDetail() {
  const {
    t,
    tableSeg,
    setTableSeg,
    chartMetric,
    setChartMetric,
    chartRange,
    setChartRange,
    labels,
    periodTableRows,
    chartLoading,
    chartPoints,
    chartValueLabel,
    chartDeltaLabel,
    overview,
    table,
    chart,
  } = useStakingHubDetail()

  const tableSegOptions = [
    { label: table.segs.stake, value: 'stake' },
    { label: table.segs.lpbond, value: 'lpbond' },
    { label: table.segs.burnbond, value: 'burnbond' },
  ] as const

  function metricValue(id: HubMetricId): string {
    return labels[id]
  }

  function metricSub(id: HubMetricId): string | undefined {
    if (id === 'tvl') return labels.tvlUsdSub
    if (id === 'treasury') return labels.treasuryUsdSub
    return undefined
  }

  return (
    <Detail>
      <Section>
        <Section.Title>{overview.title}</Section.Title>
        <Grid columns={3}>
          {overview.metrics.map((metric) => {
            if (!isHubMetricId(metric.id)) return null
            const chrome = METRIC_CHROME[metric.id]
            const value = metricValue(metric.id)
            const valueClassName =
              chrome.tone === 'accent'
                ? 'text-base leading-5 font-semibold tracking-normal text-primary'
                : 'text-base leading-5 font-semibold tracking-normal'

            return (
              <Tile className="overflow-visible" key={metric.id}>
                <Tile.Label>
                  {metric.label}
                  {metric.hint ? (
                    <Tooltip.Info className="text-foreground" content={metric.hint} />
                  ) : null}
                </Tile.Label>
                <Text as="strong" className={valueClassName} variant="headline">
                  <HubMetricValueRow
                    icon={chrome.icon}
                    sub={chrome.hasSub ? metricSub(metric.id) : undefined}
                    value={value}
                  />
                </Text>
              </Tile>
            )
          })}
        </Grid>
      </Section>

      <Section>
        <Section.Title>{table.title}</Section.Title>
        {/* 周期筛选：复用通用 ChipTabs，不用 Segment */}
        <ChipTabs
          activeTone="coral"
          ariaLabel={table.segmentAria}
          className="mb-3"
          items={tableSegOptions.map((option) => ({
            active: tableSeg === option.value,
            label: option.label,
          }))}
          onSelect={(index) => {
            const next = tableSegOptions[index]
            if (next) setTableSeg(next.value)
          }}
        />
        <Table>
          <Table.Body
            headers={[...table.columns]}
            positiveColumns={[3]}
            rows={table.rows
              .filter((row) => tableSeg === 'stake' || row.id !== 'liquid')
              .flatMap((row) => {
                const cells = periodTableRows[row.id]
                if (!cells) return []
                return [[row.period, cells.baseDaily, cells.bonus, cells.periodYield]]
              })}
          />
        </Table>
      </Section>

      <Section>
        <Section.Title>{chart.title}</Section.Title>
        {/* 指标切换：小尺寸 Segment，高度用标准刻度 */}
        <Segment
          aria-label={chart.metricAria}
          className="mb-3 h-8 w-fit"
          onChange={setChartMetric}
          options={[
            { label: chart.metricTabs.tvl, value: 'tvl' },
            { label: chart.metricTabs.mcap, value: 'mcap' },
          ]}
          size="sm"
          tone="coral"
          value={chartMetric}
        />
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
        <Section.Title>{t.staking.hub.faq.title}</Section.Title>
        <Faq items={t.staking.hub.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
