import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { FaqList } from '~/shared/ui/faq-list'
import { MetricCard } from '~/shared/ui/metric-card'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { cn } from '~/shared/lib/utils'

const PLACEHOLDER = '—'

/** Right-rail shared buckets for stake / bond / xmine — positions deep-link to assets. */
export function StakingDetailAside({
  overviewItems,
  overviewLayout = 'list',
  mechanism,
  mechanismTitle,
  mechanismSteps,
  faq,
  recordsTitle,
  chartTitle,
  showXValueCard = false,
  positionItems,
}: {
  overviewItems: Array<{ label: string; value: string }>
  /** Figma stake: 2×2 elevated cards; bond/xmine keep compact list until their leaf tickets. */
  overviewLayout?: 'list' | 'cards'
  mechanism?: string
  mechanismTitle?: string
  mechanismSteps?: Array<{ title: string; body: string }>
  faq: Array<{ q: string; a: string }>
  recordsTitle: string
  chartTitle: string
  showXValueCard?: boolean
  positionItems?: Array<{ label: string; value: string }>
}) {
  const { messages: t } = useI18n()
  const selectTab = useDappShellStore((state) => state.selectTab)
  const [chartRange, setChartRange] = useState(t.staking.aside.chartRanges[3] ?? '全部')
  const xValue = t.staking.aside.xValue

  return (
    <>
      <DappDetailBlock>
        <DappContentHeading>{t.staking.aside.overview}</DappContentHeading>
        {overviewLayout === 'cards' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {overviewItems.map((item) => (
              <MetricCard
                className="gap-1.5 p-4"
                key={item.label}
                label={item.label}
                value={item.value}
                valueClassName="text-base font-semibold tracking-normal"
              />
            ))}
          </div>
        ) : (
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
        )}
      </DappDetailBlock>

      {showXValueCard ? (
        <DappDetailBlock>
          <DappContentHeading>{xValue.title}</DappContentHeading>
          <div className="grid gap-4 rounded-[22px] bg-dark px-6 py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="grid gap-1">
                <Text as="span" tone="primary" variant="detail">
                  {xValue.supplyLabel}
                </Text>
                <Text as="strong" className="text-[22px] font-bold" tone="inverse" variant="copy">
                  {xValue.supplyValue}
                </Text>
              </div>
              <span className="rounded-full bg-primary/20 px-3 py-1.5 text-[12px] font-semibold text-primary">
                {xValue.badge}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {xValue.columns.map((col) => (
                <div className="grid gap-2" key={col.title}>
                  <div className="flex items-baseline gap-2">
                    <Text
                      as="strong"
                      className="text-[20px] font-bold"
                      tone="inverse"
                      variant="copy"
                    >
                      {col.pct}
                    </Text>
                    <Text as="span" tone="inverse-muted" variant="detail">
                      {col.title}
                    </Text>
                  </div>
                  <ul className="m-0 grid list-none gap-1.5 p-0">
                    {col.bullets.map((bullet) => (
                      <li className="flex items-center gap-2" key={bullet}>
                        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
                        <Text as="span" tone="inverse-muted" variant="detail">
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
          <DappContentHeading className="m-0">{t.staking.aside.positions}</DappContentHeading>
          <button
            className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[12px] font-semibold text-primary"
            onClick={() => selectTab('assets')}
            type="button"
          >
            {t.staking.aside.viewPositions}
          </button>
        </div>
        {positionItems ? (
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {positionItems.slice(0, 3).map((item) => (
                <MetricCard
                  className="gap-1.5 p-4"
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  valueClassName="text-base font-semibold tracking-normal"
                />
              ))}
            </div>
            {positionItems.length > 3 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {positionItems.slice(3).map((item) => (
                  <MetricCard
                    className="gap-1.5 p-4"
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    valueClassName="text-base font-semibold tracking-normal"
                  />
                ))}
              </div>
            ) : null}
          </div>
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
            colWidths={['175px', '80px', '140px', '90px', '1fr']}
            headers={[...t.staking.aside.recordColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={t.staking.aside.recordsEmpty} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{mechanismTitle ?? t.staking.aside.mechanism}</DappContentHeading>
        {mechanismSteps && mechanismSteps.length > 0 ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-start">
            {mechanismSteps.map((step, index) => (
              <div className="grid min-w-0 flex-1 gap-3" key={step.title}>
                <div className="flex items-center gap-0">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-white">
                    {index + 1}
                  </span>
                  {index < mechanismSteps.length - 1 ? (
                    <span
                      aria-hidden
                      className={cn('ml-0 hidden h-0.5 flex-1 bg-border sm:block')}
                    />
                  ) : null}
                </div>
                <Text as="strong" className="font-semibold" variant="copy">
                  {step.title}
                </Text>
                <Text as="p" className="m-0" tone="muted-foreground" variant="detail">
                  {step.body}
                </Text>
              </div>
            ))}
          </div>
        ) : (
          <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
            {mechanism}
          </Text>
        )}
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{chartTitle}</DappContentHeading>
        <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Text as="strong" className="text-xl font-semibold" variant="copy">
              {PLACEHOLDER}
            </Text>
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
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.staking.aside.faq}</DappContentHeading>
        <FaqList items={faq} variant="dapp" />
      </DappDetailBlock>
    </>
  )
}
