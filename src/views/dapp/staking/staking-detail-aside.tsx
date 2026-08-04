import { type ReactNode } from 'react'

import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappProcessSteps } from '~/app/shell/dapp-process-steps'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { formatCompactUsd, formatSignedPercent } from '~/shared/api/format-display'
import { CountValue } from '~/shared/components/count-value'
import { FaqList } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { StakingChartCard } from '~/views/dapp/staking/staking-chart-card'
import { useStakingDetailAsideView } from '~/views/dapp/staking/use-staking-detail-aside-view'

/**
 * 右栏指标排布 — 跟各帧稿面，不抽万能仓位组件。
 * - cards-2：概览/仓位 2×2（OverviewGrid）
 * - triple-plus：6 列 span — PC 上三(span2)下二(span3)；H5 一律 span3=每行两卡
 * - pair-plus：Xmine 概览 — PC 上二(span3)下三(span2)；H5 一律 span3
 * gap SSOT = OverviewGrid；span 仅子项 `col-span-*`。
 */
function AsideMetricLayout({
  items,
  layout,
}: {
  items: Array<{ label: string; value: ReactNode }>
  layout: 'cards-2' | 'triple-plus' | 'pair-plus'
}) {
  if (layout === 'triple-plus' || layout === 'pair-plus') {
    const pairFirst = layout === 'pair-plus'
    return (
      <OverviewGrid columns={6}>
        {items.map((item, index) => (
          <Tile
            className={cn(
              'min-w-0',
              pairFirst
                ? index < 2
                  ? 'col-span-3'
                  : 'col-span-2 max-dapp:col-span-3'
                : index < 3
                  ? 'col-span-2 max-dapp:col-span-3'
                  : 'col-span-3',
            )}
            key={item.label}
          >
            <Tile.Label>{item.label}</Tile.Label>
            <Text
              as="strong"
              className="block min-w-0 text-base leading-5 font-semibold tracking-normal"
              variant="headline"
            >
              {typeof item.value === 'string' ? <CountValue text={item.value} /> : item.value}
            </Text>
          </Tile>
        ))}
      </OverviewGrid>
    )
  }
  return (
    <OverviewGrid columns={2}>
      {items.map((item) => (
        <Tile className="min-w-0" key={item.label}>
          <Tile.Label>{item.label}</Tile.Label>
          <Text
            as="strong"
            className="block min-w-0 text-base leading-5 font-semibold tracking-normal"
            variant="headline"
          >
            {typeof item.value === 'string' ? <CountValue text={item.value} /> : item.value}
          </Text>
        </Tile>
      ))}
    </OverviewGrid>
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
  /** Figma stake/bond: 2×2；xmine 概览: pair-plus（2+3）。 */
  overviewLayout?: 'list' | 'cards-2' | 'triple-plus' | 'pair-plus'
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
  /** Bond Figma: 2×2; stake: 3 + remainder. */
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
          <AsideMetricLayout items={overviewItems} layout={overviewLayout} />
        )}
      </DappDetailBlock>

      {showXValueCard ? (
        <DappDetailBlock>
          <DappContentHeading>{xValue.title}</DappContentHeading>
          <div className="grid gap-5 rounded-md bg-dark p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Icon alt="" className="size-9 rounded-2xl" src={dappAssets.tokenX} />
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
            {/* H5 `4665:1656`：双栏并排 + 顶对齐；窄列 %/标题上下排（稿横排放不下，产品纠偏） */}
            <div className="grid grid-cols-2 items-start gap-10">
              {xValue.columns.map((col) => (
                <div className="grid min-w-0 content-start gap-2.5" key={col.title}>
                  <div className="flex flex-col items-start gap-1 dapp:flex-row dapp:items-baseline dapp:gap-2">
                    <Text
                      as="strong"
                      className="shrink-0 text-xl font-bold"
                      tone="inverse"
                      variant="copy"
                    >
                      {col.pct}
                    </Text>
                    <Text
                      as="span"
                      className="min-w-0 font-medium"
                      tone="inverse-muted"
                      variant="copy"
                    >
                      {col.title}
                    </Text>
                  </div>
                  <ul className="m-0 grid list-none gap-2 p-0">
                    {col.bullets.map((bullet) => (
                      <li className="flex items-start gap-2" key={bullet}>
                        <span
                          aria-hidden
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                        />
                        <Text as="span" className="min-w-0 text-white/65" variant="copy">
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
            className="inline-flex items-center rounded-full bg-primary/15 px-2.5"
            onClick={() => selectTab('assets')}
            type="button"
          >
            <Text as="span" className="font-semibold" tone="primary" variant="support">
              {t.staking.aside.viewPositions}
            </Text>
          </button>
        </div>
        {positionItems ? (
          <AsideMetricLayout items={positionItems} layout={positionLayout} />
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
        <Table>
          <Table.Body
            colWidths={[...tableColWidths]}
            empty={emptyTitle}
            headers={[...tableHeaders]}
            rows={[...rows]}
          />
        </Table>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{mechanismTitle ?? t.staking.aside.mechanism}</DappContentHeading>
        {mechanismSteps && mechanismSteps.length > 0 ? (
          <DappProcessSteps items={mechanismSteps} />
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
              {/* 无 TVL 历史源 — 头值占位 */}
              <Text as="strong" className="text-xl font-semibold" variant="copy">
                {formatCompactUsd(null)}
              </Text>
              <Text as="span" className="font-semibold text-success" variant="detail">
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
        <FaqList defaultOpenFirst={false} items={faq} variant="dapp" />
      </DappDetailBlock>
    </>
  )
}
