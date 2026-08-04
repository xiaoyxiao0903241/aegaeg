import { dappAssets } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { CountValue } from '~/shared/components/count-value'
import { FaqList } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { Segment } from '~/shared/components/segment'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { useStakingHubContentView } from '~/views/dapp/staking/hub/use-staking-hub-content-view'
import { StakingTvlChart } from '~/views/dapp/staking/staking-tvl-chart'

/** Figma hub right column — section titles use Text `section` token. */
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

function MetricValueRow({ icon, sub, value }: { icon: MetricIcon; sub?: string; value: string }) {
  const src = icon === 'agx' ? dappAssets.tokenAgx : icon === 'usd1' ? dappAssets.tokenUsd1 : null

  return (
    <span className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
      {src ? <Icon alt="" shape="circle" size="lg" src={src} /> : null}
      <span className="min-w-0 wrap-break-word">
        <CountValue text={value} />
      </span>
      {sub ? (
        <Text as="span" className="shrink-0 wrap-break-word text-foreground/40" variant="copy">
          <CountValue text={sub} />
        </Text>
      ) : null}
    </span>
  )
}

function isHubMetricId(id: string): id is HubMetricId {
  return id in METRIC_CHROME
}

/** Hub right rail: overview grid + period table + chart chrome + FAQ. */
export function StakingHubContent() {
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
    chartPoints,
    chartValueLabel,
    chartDeltaLabel,
    overview,
    table,
    chart,
  } = useStakingHubContentView()

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
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{overview.title}</DappContentHeading>
        {/* PC 三列；H5 每行两卡；同行等高靠 OverviewGrid stretch */}
        <OverviewGrid columns={3}>
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
                  <MetricValueRow
                    icon={chrome.icon}
                    sub={chrome.hasSub ? metricSub(metric.id) : undefined}
                    value={value}
                  />
                </Text>
              </Tile>
            )
          })}
        </OverviewGrid>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{table.title}</DappContentHeading>
        {/* Figma htab `4371:233` → 通用 DappPillTabs（≠ Segment） */}
        <DappPillTabs
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
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{chart.title}</DappContentHeading>
        {/* Figma metric-tabs `4585:44` 轨高 32 — `h-8` 标准刻度；size sm 对齐 pad/thumb */}
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
          points={chartPoints}
          rangeAriaLabel={t.staking.aside.chartRangeAria}
          rangeLabels={t.staking.aside.chartRanges}
          setChartRange={setChartRange}
          surface="elevated"
          valueLabel={chartValueLabel}
        />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.staking.hub.faq.title}</DappContentHeading>
        <FaqList items={t.staking.hub.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
