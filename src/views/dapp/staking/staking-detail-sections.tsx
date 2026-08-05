import { type ReactNode } from 'react'

import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { formatCompactUsd, formatSignedPercent } from '~/shared/api/format-display'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { FaqList } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { List } from '~/shared/components/list'
import { Section } from '~/shared/components/section'
import { Steps } from '~/shared/components/steps'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { StakingTvlChart } from '~/views/dapp/staking/staking-tvl-chart'
import { useStakingDetailAsideView } from '~/views/dapp/staking/use-staking-detail-aside-view'

/**
 * 右栏指标排布（概览 / 仓位共用）
 *
 * - cards-2：两列均分
 * - triple-plus：首行三卡，其余两卡
 * - pair-plus：首行两卡，其余三卡
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
              className="block min-w-0 text-base/5 font-semibold tracking-normal"
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
            className="block min-w-0 text-base/5 font-semibold tracking-normal"
            variant="headline"
          >
            {typeof item.value === 'string' ? <CountValue text={item.value} /> : item.value}
          </Text>
        </Tile>
      ))}
    </OverviewGrid>
  )
}

type MetricItem = { label: string; value: ReactNode }

/**
 * 概览区块：默认列表，或按 layout 参数切换卡片网格排布。
 */
export function StakingOverviewSection({
  overviewItems,
  overviewLayout = 'list',
}: {
  overviewItems: MetricItem[]
  /** 概览排布：stake/bond 用两列，xmine 用首行两卡。 */
  overviewLayout?: 'list' | 'cards-2' | 'triple-plus' | 'pair-plus'
}) {
  const { t } = useStakingDetailAsideView()

  return (
    <Section>
      <Section.Title>{t.staking.aside.overview}</Section.Title>
      {overviewLayout === 'list' ? (
        <List
          items={overviewItems.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
        />
      ) : (
        <AsideMetricLayout items={overviewItems} layout={overviewLayout} />
      )}
    </Section>
  )
}

/**
 * X 价值说明区块，深色底双栏数据（Xmine 详情专用）。
 */
export function StakingXValueSection() {
  const { xValue } = useStakingDetailAsideView()

  return (
    <Section>
      <Section.Title>{xValue.title}</Section.Title>
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
        {/* H5 双栏并排、顶对齐；窄列内百分比与标题上下排（横排放不下） */}
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
                <Text as="span" className="min-w-0 font-medium" tone="inverse-muted" variant="copy">
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
    </Section>
  )
}

/**
 * 我的仓位区块：卡片网格，附跳转资产页按钮。
 */
export function StakingPositionsSection({
  positionItems,
  positionLayout = 'triple-plus',
}: {
  positionItems?: MetricItem[]
  /** 仓位排布：bond 用两列，stake 用首行三卡。 */
  positionLayout?: 'triple-plus' | 'cards-2'
}) {
  const { t, selectTab } = useStakingDetailAsideView()

  return (
    <Section>
      <div className="flex items-center gap-2.5">
        <Section.Title>{t.staking.aside.positions}</Section.Title>
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
    </Section>
  )
}

/**
 * 操作记录表区块：列定义 / 空态文案可覆盖。
 */
export function StakingRecordsSection({
  recordsTitle,
  recordColumns,
  recordColWidths,
  recordRows,
  recordsEmptyTitle,
}: {
  recordsTitle: string
  recordColumns?: readonly string[]
  recordColWidths?: readonly string[]
  recordRows?: readonly string[][]
  recordsEmptyTitle?: string
}) {
  const vm = useStakingDetailAsideView()
  const tableHeaders = recordColumns ?? vm.defaultRecordColumns
  const tableColWidths = recordColWidths ?? ['10.9375rem', '5rem', '8.75rem', '5.625rem', '1fr']
  const rows = recordRows ?? []
  const emptyTitle = recordsEmptyTitle ?? vm.defaultRecordsEmpty

  return (
    <Section>
      <Section.Title>{recordsTitle}</Section.Title>
      <Table>
        <Table.Body
          colWidths={[...tableColWidths]}
          empty={emptyTitle}
          headers={[...tableHeaders]}
          rows={[...rows]}
        />
      </Table>
    </Section>
  )
}

/**
 * 机制说明区块：有步骤时展示步骤卡，否则展示纯文案。
 */
export function StakingMechanismSection({
  mechanism,
  mechanismTitle,
  mechanismSteps,
}: {
  mechanism?: string
  mechanismTitle?: string
  mechanismSteps?: Array<{ title: string; body: string }>
}) {
  const { t } = useStakingDetailAsideView()

  return (
    <Section>
      <Section.Title>{mechanismTitle ?? t.staking.aside.mechanism}</Section.Title>
      {mechanismSteps && mechanismSteps.length > 0 ? (
        <Card className="rounded-2xl p-6" surface="elevated">
          <Steps align="start">
            {mechanismSteps.map((step) => (
              <Steps.Item body={step.body} key={step.title} title={step.title} />
            ))}
          </Steps>
        </Card>
      ) : (
        <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
          {mechanism}
        </Text>
      )}
    </Section>
  )
}

/**
 * 趋势图区块：数据源未接通时展示空态图。
 */
export function StakingChartSection({ chartTitle }: { chartTitle: string }) {
  const { t, chartRange, setChartRange } = useStakingDetailAsideView()

  return (
    <Section>
      <Section.Title>{chartTitle}</Section.Title>
      <StakingTvlChart
        chartRange={chartRange}
        deltaLabel={formatSignedPercent(null)}
        emptyLabel={t.staking.aside.chartEmpty}
        rangeAriaLabel={t.staking.aside.chartRangeAria}
        rangeLabels={t.staking.aside.chartRanges}
        setChartRange={setChartRange}
        surface="elevated"
        valueLabel={formatCompactUsd(null)}
      />
    </Section>
  )
}

/**
 * FAQ 区块，默认折叠。
 */
export function StakingFaqSection({ faq }: { faq: Array<{ q: string; a: string }> }) {
  const { t } = useStakingDetailAsideView()

  return (
    <Section>
      <Section.Title>{t.staking.aside.faq}</Section.Title>
      <FaqList defaultOpenFirst={false} items={faq} variant="dapp" />
    </Section>
  )
}
