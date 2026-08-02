import { type ReactNode } from 'react'

import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { formatCompactUsd, formatSignedPercent } from '~/shared/api/format-display'
import { Card } from '~/shared/ui/card'
import { FaqList } from '~/shared/ui/faq-list'
import { MetricCard } from '~/shared/ui/metric-card'
import { Text } from '~/shared/ui/text'
import { StakingChartCard } from '~/views/dapp/staking/staking-chart-card'
import { useStakingDetailAsideView } from '~/views/dapp/staking/use-staking-detail-aside-view'

function MetricGrid({
  items,
  layout,
}: {
  items: Array<{ label: string; value: ReactNode }>
  layout: 'cards-2' | 'triple-plus'
}) {
  if (layout === 'cards-2') {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <MetricCard
            className="gap-1.5 p-4 [&>*:first-child]:leading-none"
            key={item.label}
            label={item.label}
            value={item.value}
            valueClassName="text-base leading-5 font-semibold tracking-normal"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {items.slice(0, 3).map((item) => (
          <MetricCard
            className="gap-1.5 p-4 [&>*:first-child]:leading-none"
            key={item.label}
            label={item.label}
            value={item.value}
            valueClassName="text-base leading-5 font-semibold tracking-normal"
          />
        ))}
      </div>
      {items.length > 3 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.slice(3).map((item) => (
            <MetricCard
              className="gap-1.5 p-4 [&>*:first-child]:leading-none"
              key={item.label}
              label={item.label}
              value={item.value}
              valueClassName="text-base leading-5 font-semibold tracking-normal"
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

/** Right-rail shared buckets for stake / bond / xmine — positions deep-link to assets. */
export function StakingDetailAside({
  overviewItems,
  overviewLayout = 'list',
  mechanism,
  mechanismTitle,
  mechanismSteps,
  faq,
  recordsTitle,
  recordColumns,
  recordColWidths,
  recordRows,
  recordsEmptyTitle,
  chartTitle,
  showXValueCard = false,
  positionItems,
  positionLayout = 'triple-plus',
}: {
  overviewItems: Array<{ label: string; value: ReactNode }>
  /** Figma stake/bond: 2×2; xmine: 3+2. */
  overviewLayout?: 'list' | 'cards-2' | 'triple-plus'
  mechanism?: string
  mechanismTitle?: string
  mechanismSteps?: Array<{ title: string; body: string }>
  faq: Array<{ q: string; a: string }>
  recordsTitle: string
  recordColumns?: readonly string[]
  recordColWidths?: readonly string[]
  recordRows?: readonly string[][]
  recordsEmptyTitle?: string
  chartTitle: string
  showXValueCard?: boolean
  positionItems?: Array<{ label: string; value: ReactNode }>
  /** Bond Figma: 2×2; stake hub: 3 + remainder. */
  positionLayout?: 'triple-plus' | 'cards-2'
}) {
  const vm = useStakingDetailAsideView()
  const { t, selectTab, chartRange, setChartRange, xValue } = vm
  const tableHeaders = recordColumns ?? vm.defaultRecordColumns
  const tableColWidths = recordColWidths ?? ['10.9375rem', '5rem', '8.75rem', '5.625rem', '1fr']
  const rows = recordRows ?? []
  const emptyTitle = recordsEmptyTitle ?? vm.defaultRecordsEmpty

  return (
    <>
      <DappDetailBlock>
        <DappContentHeading>{t.staking.aside.overview}</DappContentHeading>
        {overviewLayout === 'list' ? (
          <ul className="m-0 grid list-none gap-2 p-0">
            {overviewItems.map((item) => (
              <li className="flex items-center justify-between gap-3" key={item.label}>
                <Text as="span" tone="muted-foreground" variant="detail">
                  {item.label}
                </Text>
                <Text as="strong" className="font-semibold" variant="detail">
                  {item.value}
                </Text>
              </li>
            ))}
          </ul>
        ) : (
          <MetricGrid items={overviewItems} layout={overviewLayout} />
        )}
      </DappDetailBlock>

      {showXValueCard ? (
        <DappDetailBlock>
          <DappContentHeading>{xValue.title}</DappContentHeading>
          <div className="grid gap-5 rounded-md bg-dark p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <DappIcon alt="" className="size-9 rounded-2xl" src={dappAssets.tokenX} />
                <div className="grid gap-1">
                  <Text as="span" className="font-semibold" tone="primary" variant="support">
                    {xValue.supplyLabel}
                  </Text>
                  <Text as="strong" className="font-bold" tone="inverse" variant="figure">
                    {xValue.supplyValue}
                  </Text>
                </div>
              </div>
              <Text
                as="span"
                className="rounded-full bg-primary/20 px-3 py-1.5 font-semibold"
                tone="primary"
                variant="support"
              >
                {xValue.badge}
              </Text>
            </div>
            <div className="grid gap-10 sm:grid-cols-2">
              {xValue.columns.map((col) => (
                <div className="grid gap-2.5" key={col.title}>
                  <div className="flex items-baseline gap-2">
                    <Text as="strong" className="text-xl font-bold" tone="inverse" variant="copy">
                      {col.pct}
                    </Text>
                    <Text as="span" className="font-medium" tone="inverse-muted" variant="copy">
                      {col.title}
                    </Text>
                  </div>
                  <ul className="m-0 grid list-none gap-2 p-0">
                    {col.bullets.map((bullet) => (
                      <li className="flex items-center gap-2" key={bullet}>
                        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
                        <Text as="span" className="text-white/65" variant="copy">
                          {bullet}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </DappDetailBlock>
      ) : null}

      <DappDetailBlock>
        <div className="mb-4 flex items-center gap-2.5">
          <DappContentHeading className="m-0 pb-0">{t.staking.aside.positions}</DappContentHeading>
          <button
            className="rounded-full bg-primary/15 px-2.5 py-0.5"
            onClick={() => selectTab('assets')}
            type="button"
          >
            <Text as="span" className="font-semibold" tone="primary" variant="support">
              {t.staking.aside.viewPositions}
            </Text>
          </button>
        </div>
        {positionItems ? (
          <MetricGrid items={positionItems} layout={positionLayout} />
        ) : (
          <>
            <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
              {t.staking.aside.positionsHint}
            </Text>
            <DappActionButton
              className="mt-3 w-full"
              density="card"
              onClick={() => selectTab('assets')}
              type="button"
              variant="secondary"
            >
              {t.staking.aside.viewPositions}
            </DappActionButton>
          </>
        )}
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{recordsTitle}</DappContentHeading>
        <DappTableCard>
          <ResponsiveTable
            colWidths={[...tableColWidths]}
            headers={[...tableHeaders]}
            rows={[...rows]}
          />
          {rows.length === 0 ? <DappTableEmptyMessage embedded title={emptyTitle} /> : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{mechanismTitle ?? t.staking.aside.mechanism}</DappContentHeading>
        {mechanismSteps && mechanismSteps.length > 0 ? (
          <Card
            className="flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-start sm:gap-0"
            surface="elevated"
          >
            {mechanismSteps.map((step, index) => (
              <div className="grid min-w-0 flex-1 gap-3" key={step.title}>
                <div className="flex w-full items-center">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Text as="span" className="font-semibold" tone="inverse" variant="copy">
                      {index + 1}
                    </Text>
                  </span>
                  {index < mechanismSteps.length - 1 ? (
                    <span
                      aria-hidden
                      className="ml-0 hidden h-0.5 min-w-0 flex-1 bg-border sm:block"
                    />
                  ) : null}
                </div>
                <Text as="strong" className="font-semibold" variant="copy">
                  {step.title}
                </Text>
                <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
                  {step.body}
                </Text>
              </div>
            ))}
          </Card>
        ) : (
          <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
            {mechanism}
          </Text>
        )}
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{chartTitle}</DappContentHeading>
        <StakingChartCard
          chartRange={chartRange}
          emptyLabel={t.staking.aside.chartEmpty}
          header={
            <div className="flex items-center gap-2">
              <Text as="strong" className="text-xl font-semibold" variant="copy">
                {formatCompactUsd(null)}
              </Text>
              <Text as="span" className="text-success" variant="detail">
                {formatSignedPercent(null)}
              </Text>
            </div>
          }
          rangeAriaLabel={t.staking.aside.chartRangeAria}
          rangeLabels={t.staking.aside.chartRanges}
          setChartRange={setChartRange}
          surface="elevated"
        />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.staking.aside.faq}</DappContentHeading>
        <FaqList items={faq} variant="dapp" />
      </DappDetailBlock>
    </>
  )
}
