import { dappAssets } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappInfoTooltip } from '~/app/shell/dapp-info-tooltip'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { cn } from '~/shared/lib/utils'
import { Chip } from '~/shared/ui/chip'
import { FaqList } from '~/shared/ui/faq-list'
import { MetricCard } from '~/shared/ui/metric-card'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { useStakingHubContentView } from '~/views/dapp/staking/hub/use-staking-hub-content-view'
import { StakingChartCard } from '~/views/dapp/staking/staking-chart-card'

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
      {src ? <DappIcon alt="" shape="circle" size="lg" src={src} /> : null}
      <span className="min-w-0 wrap-break-word">{value}</span>
      {sub ? (
        <Text as="span" className="shrink-0 wrap-break-word text-foreground/40" variant="copy">
          {sub}
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
        {/* PC 三列；H5 每行两卡（用户锁定）· tile 高跟稿 min-h-18.75 */}
        <div className="grid auto-rows-fr grid-cols-3 gap-2 max-dapp:grid-cols-2">
          {overview.metrics.map((metric) => {
            if (!isHubMetricId(metric.id)) return null
            const chrome = METRIC_CHROME[metric.id]
            const value = metricValue(metric.id)
            const valueClassName =
              chrome.tone === 'accent'
                ? 'text-base leading-5 font-semibold tracking-normal text-primary'
                : 'text-base leading-5 font-semibold tracking-normal'

            return (
              <MetricCard
                className="h-full min-h-18.75 gap-1.5 overflow-visible rounded-2xl p-4 [&>*:first-child]:leading-none!"
                key={metric.id}
                label={
                  <span className="flex items-center gap-1">
                    <span>{metric.label}</span>
                    {metric.hint ? (
                      <DappInfoTooltip className="text-foreground" content={metric.hint} />
                    ) : null}
                  </span>
                }
                value={
                  <MetricValueRow
                    icon={chrome.icon}
                    sub={chrome.hasSub ? metricSub(metric.id) : undefined}
                    value={value}
                  />
                }
                valueClassName={valueClassName}
              />
            )
          })}
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{table.title}</DappContentHeading>
        {/* Figma htab `4371:233`：discrete Chip（≠ Segment）；gap≈9→gap-2；active coral-emphasis */}
        <div aria-label={table.segmentAria} className="mb-3 flex flex-wrap gap-2" role="tablist">
          {tableSegOptions.map((option) => {
            const active = tableSeg === option.value
            return (
              <Chip
                aria-selected={active}
                key={option.value}
                onClick={() => setTableSeg(option.value)}
                role="tab"
                shape="pill"
                size="md"
                tone={active ? 'coral' : 'default'}
                variant={active ? 'soft' : 'outlined'}
                className={cn(
                  'h-7 min-w-0 px-4 text-(length:--type-copy-size) leading-none',
                  active ? 'font-semibold text-coral-emphasis' : 'font-medium',
                )}
              >
                {option.label}
              </Chip>
            )
          })}
        </div>
        <DappTableCard contentClassName="px-4 py-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  {table.columns.map((col) => (
                    <th className="border-b border-border pr-3 pb-3" key={col}>
                      <Text as="span" tone="muted-foreground" variant="detail">
                        {col}
                      </Text>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows
                  .filter((row) => tableSeg === 'stake' || row.id !== 'liquid')
                  .map((row) => {
                    const cells = periodTableRows[row.id]
                    if (!cells) return null
                    return (
                      <tr className="border-b border-border last:border-b-0" key={row.id}>
                        <td className="py-3 pr-3">
                          <Text as="span" variant="detail">
                            {row.period}
                          </Text>
                        </td>
                        <td className="py-3 pr-3">
                          <Text as="span" variant="detail">
                            {cells.baseDaily}
                          </Text>
                        </td>
                        <td className="py-3 pr-3">
                          <Text as="span" variant="detail">
                            {cells.bonus}
                          </Text>
                        </td>
                        <td className="py-3">
                          <Text as="span" className="text-success" variant="detail">
                            {cells.periodYield}
                          </Text>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </DappTableCard>
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
        <StakingChartCard
          chartRange={chartRange}
          emptyLabel={t.staking.aside.chartEmpty}
          header={
            <div className="flex items-center gap-2">
              {/* Figma chart-card `4585:575` h3=20 → text-xl；delta caption 13 → copy */}
              <Text as="strong" className="text-xl/none font-semibold" variant="copy">
                {chartValueLabel}
              </Text>
              <Text as="span" className="text-success" variant="copy">
                {chartDeltaLabel}
              </Text>
            </div>
          }
          points={chartPoints}
          rangeAriaLabel={t.staking.aside.chartRangeAria}
          rangeLabels={t.staking.aside.chartRanges}
          setChartRange={setChartRange}
          surface="elevated"
        />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.staking.hub.faq.title}</DappContentHeading>
        <FaqList items={t.staking.hub.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
