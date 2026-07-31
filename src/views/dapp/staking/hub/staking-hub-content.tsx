import { dappAssets } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappInfoTooltip } from '~/app/shell/dapp-info-tooltip'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { FaqList } from '~/shared/ui/faq-list'
import { Card } from '~/shared/ui/card'
import { MetricCard } from '~/shared/ui/metric-card'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { useStakingHubContentView } from '~/views/dapp/staking/hub/use-staking-hub-content-view'

/** Figma hub right column `4371:225`: section titles body-lg 18. */
const hubSectionTitleClass = 'text-[1.125rem] leading-normal tracking-normal'

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
    <span className="flex min-w-0 items-center gap-1.5">
      {src ? <DappIcon alt="" className="size-[18px] shrink-0 rounded-full" src={src} /> : null}
      <span>{value}</span>
      {sub ? (
        <Text
          as="span"
          className="text-[13px] leading-normal"
          tone="muted-foreground"
          variant="support"
        >
          {sub}
        </Text>
      ) : null}
    </span>
  )
}

function isHubMetricId(id: string): id is HubMetricId {
  return id in METRIC_CHROME
}

/** Hub right rail: overview grid + period table + chart chrome + FAQ (dynamic figures may be —). */
export function StakingHubContent() {
  const {
    t,
    tableSeg,
    setTableSeg,
    chartMetric,
    setChartMetric,
    chartRange,
    setChartRange,
    agxPriceLabel,
    stakersLabel,
    overview,
    table,
    chart,
    placeholder: PLACEHOLDER,
  } = useStakingHubContentView()

  function metricValue(id: HubMetricId): string {
    if (id === 'price') return agxPriceLabel
    if (id === 'stakers') return stakersLabel
    return PLACEHOLDER
  }

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading className={hubSectionTitleClass}>{overview.title}</DappContentHeading>
        <div className="grid grid-cols-3 gap-2">
          {overview.metrics.map((metric) => {
            if (!isHubMetricId(metric.id)) return null
            const chrome = METRIC_CHROME[metric.id]
            const value = metricValue(metric.id)
            const valueClassName =
              chrome.tone === 'accent'
                ? 'text-base font-semibold tracking-normal text-primary'
                : 'text-base font-semibold tracking-normal'

            return (
              <MetricCard
                className="min-h-[75px] gap-1.5 p-4"
                key={metric.id}
                label={
                  <span className="flex items-center gap-1">
                    <span>{metric.label}</span>
                    {metric.hint ? (
                      <DappInfoTooltip className="size-3 [&_svg]:size-3" content={metric.hint} />
                    ) : null}
                  </span>
                }
                value={
                  <MetricValueRow
                    icon={chrome.icon}
                    sub={chrome.hasSub ? `≈ ${PLACEHOLDER}` : undefined}
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
        <DappContentHeading className={hubSectionTitleClass}>{table.title}</DappContentHeading>
        <Segment
          aria-label={table.segmentAria}
          className="mb-3 w-fit"
          onChange={setTableSeg}
          options={[
            { label: table.segs.stake, value: 'stake' },
            { label: table.segs.lpbond, value: 'lpbond' },
            { label: table.segs.burnbond, value: 'burnbond' },
          ]}
          tone="coral"
          value={tableSeg}
        />
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
                  .map((row) => (
                    <tr className="border-b border-border last:border-b-0" key={row.id}>
                      <td className="py-3 pr-3">
                        <Text as="span" variant="detail">
                          {row.period}
                        </Text>
                      </td>
                      <td className="py-3 pr-3">
                        <Text as="span" variant="detail">
                          {PLACEHOLDER}
                        </Text>
                      </td>
                      <td className="py-3 pr-3">
                        <Text as="span" variant="detail">
                          {PLACEHOLDER}
                        </Text>
                      </td>
                      <td className="py-3">
                        <Text as="span" className="text-success" variant="detail">
                          {PLACEHOLDER}
                        </Text>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading className={hubSectionTitleClass}>{chart.title}</DappContentHeading>
        <Segment
          aria-label={chart.metricAria}
          className="mb-3 w-fit"
          onChange={setChartMetric}
          options={[
            { label: chart.metricTabs.tvl, value: 'tvl' },
            { label: chart.metricTabs.mcap, value: 'mcap' },
          ]}
          tone="coral"
          value={chartMetric}
        />
        <Card surface="elevated" className="grid gap-3 rounded-2xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Text as="strong" className="text-xl font-semibold" variant="copy">
                {PLACEHOLDER}
              </Text>
              <Text as="span" className="text-success" variant="detail">
                {PLACEHOLDER}
              </Text>
            </div>
            <Segment
              aria-label={t.staking.aside.chartRangeAria}
              onChange={setChartRange}
              options={t.staking.aside.chartRanges.map((label) => ({ label, value: label }))}
              tone="ink"
              value={chartRange}
            />
          </div>
          <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border">
            <Text as="span" tone="muted-foreground" variant="copy">
              {PLACEHOLDER}
            </Text>
          </div>
        </Card>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading className={hubSectionTitleClass}>
          {t.staking.hub.faq.title}
        </DappContentHeading>
        <FaqList items={t.staking.hub.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
