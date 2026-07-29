import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Segment } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { useDappShellStore } from '~/stores/dapp-shell-store'

const PLACEHOLDER = '—'

/** Right-rail shared buckets for stake / bond / xmine — positions deep-link to assets. */
export function StakingDetailAside({
  overviewItems,
  mechanism,
  faq,
  recordsTitle,
  chartTitle,
  showXValueCard = false,
}: {
  overviewItems: Array<{ label: string; value: string }>
  mechanism: string
  faq: Array<{ q: string; a: string }>
  recordsTitle: string
  chartTitle: string
  showXValueCard?: boolean
}) {
  const { messages: t } = useI18n()
  const selectTab = useDappShellStore((state) => state.selectTab)
  const [chartRange, setChartRange] = useState(t.staking.aside.chartRanges[3] ?? '全部')
  const xValue = t.staking.aside.xValue

  return (
    <>
      <DappDetailBlock>
        <DappContentHeading>{t.staking.aside.overview}</DappContentHeading>
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
        <DappContentHeading>{t.staking.aside.positions}</DappContentHeading>
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
        <DappContentHeading>{t.staking.aside.mechanism}</DappContentHeading>
        <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
          {mechanism}
        </Text>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{chartTitle}</DappContentHeading>
        <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Text as="strong" className="font-semibold" variant="copy">
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
        <ul className="m-0 grid list-none gap-3 p-0">
          {faq.map((item) => (
            <li key={item.q}>
              <Text as="p" className="m-0 font-medium" variant="copy">
                {item.q}
              </Text>
              <Text as="p" className="mt-1 mb-0" tone="muted-foreground" variant="detail">
                {item.a}
              </Text>
            </li>
          ))}
        </ul>
      </DappDetailBlock>
    </>
  )
}
