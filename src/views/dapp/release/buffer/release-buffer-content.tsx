import { useState } from 'react'

import { dappAssets, tokenCarouselIcons } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { DappTablePagination } from '~/app/shell/dapp-table-pagination'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBufferPoolLogs, useBufferPoolSummary } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapBufferPoolLogToRow } from '~/shared/api/map-flow-log-rows'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { FaqList } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { shouldShowTablePagination, tablePageQuery } from '~/shared/lib/table-pagination'
import { formatReleaseApiOrChainLabel } from '~/views/dapp/release/format-release-api-or-chain-label'
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/** Figma `4793:211/217/220/214` 珊瑚描边 icon（22） */
const MECHANISM_STEP_ICONS = [
  dappAssets.releaseBufferMechLock,
  dappAssets.releaseBufferMechWaves,
  dappAssets.releaseBufferMechClock,
  dappAssets.releaseBufferMechTrending,
] as const

function BufferStatCells({
  stats,
}: {
  stats: ReadonlyArray<{ label: string; value: string; approx: string }>
}) {
  // H5 两列换行；PC（dapp）三列跟稿 `4791:3688`
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-3 dapp:grid-cols-3">
      {stats.map((stat) => (
        <div className="grid min-w-0 gap-1" key={stat.label}>
          <Text as="span" className="font-medium text-foreground/70" variant="support">
            {stat.label}
          </Text>
          <Text as="strong" className="font-semibold break-all" variant="detail">
            <CountValue text={stat.value} />
          </Text>
          <Text as="span" className="text-foreground/40" variant="support">
            {stat.approx}
          </Text>
        </div>
      ))}
    </div>
  )
}

export function ReleaseBufferContent() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappShell()
  const priceUsd = useAgxPriceUsd()
  const [recordsPage, setRecordsPage] = useState(1)
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const apiSummaryQuery = useBufferPoolSummary(sessionReady)
  const bufferLogsQuery = useBufferPoolLogs(tablePageQuery(recordsPage), sessionReady)
  const bufferLogRows = bufferLogsQuery.data?.items.map(mapBufferPoolLogToRow) ?? []
  const bufferLogsTotal = bufferLogsQuery.data?.total ?? 0
  const bufferLogsLoading = sessionReady && bufferLogsQuery.isLoading
  const amount = bufferQuery.data?.totalAmount ?? 0n
  const claimed = bufferQuery.data?.totalClaimed ?? 0n
  const releasing = bufferQuery.data?.totalReleasing ?? 0n
  const api = apiSummaryQuery.data

  function amountNum(apiRaw: string | undefined, chain: bigint): number {
    if (sessionReady && apiRaw != null && apiRaw.trim() !== '') {
      const n = Number(apiRaw)
      if (Number.isFinite(n)) return n
    }
    return walletReady ? formatTokenAmountToNumber(chain, AGX_DECIMALS) : 0
  }

  const agxStats = [
    {
      label: t.release.buffer.entered,
      value: formatReleaseApiOrChainLabel({
        sessionReady,
        apiRaw: api?.cumulative_amount,
        chainReady: walletReady,
        chainValue: amount,
        decimals: AGX_DECIMALS,
        unit: 'AGX',
      }),
      approx: formatApproxUsd(amountNum(api?.cumulative_amount, amount), priceUsd),
    },
    {
      label: t.release.buffer.extracted,
      value: formatReleaseApiOrChainLabel({
        sessionReady,
        apiRaw: api?.released_amount,
        chainReady: walletReady,
        chainValue: claimed,
        decimals: AGX_DECIMALS,
        unit: 'AGX',
      }),
      approx: formatApproxUsd(amountNum(api?.released_amount, claimed), priceUsd),
    },
    {
      label: t.release.labels.releasing,
      value: formatReleaseApiOrChainLabel({
        sessionReady,
        apiRaw: api?.releasing_amount,
        chainReady: walletReady,
        chainValue: releasing,
        decimals: AGX_DECIMALS,
        unit: 'AGX',
      }),
      approx: formatApproxUsd(amountNum(api?.releasing_amount, releasing), priceUsd),
    },
  ]

  const gagxZero = `${formatGroupedNumber(0, { digits: 4 })} gAGX`
  const gagxZeroApprox = formatApproxUsd(0, null)
  const gagxStats = [
    { label: t.release.buffer.entered, value: gagxZero, approx: gagxZeroApprox },
    { label: t.release.buffer.extracted, value: gagxZero, approx: gagxZeroApprox },
    { label: t.release.labels.releasing, value: gagxZero, approx: gagxZeroApprox },
  ]

  const steps = t.release.buffer.mechanismSteps

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading id="release-buffer-title">
          {t.release.buffer.statsTitle}
        </DappContentHeading>
        {/* Figma `4791:3688`：px20 py16 gap8 · 黑圆 24 + 字 16 · 三列 w160 */}
        <Card
          as="div"
          className="mb-3 grid min-h-29.75 content-center gap-2 rounded-2xl px-5 py-3"
          data-slot-id="release-buffer-stat-agx"
          surface="elevated"
        >
          <div className="flex items-center gap-2">
            <span className="grid size-(--app-icon-token) shrink-0 place-items-center overflow-hidden rounded-full bg-black">
              <Icon
                alt=""
                className="size-(--app-icon-lg)"
                size="lg"
                src={tokenCarouselIcons.agxIcon}
              />
            </span>
            <Text as="strong" className="font-semibold" variant="headline">
              AGX
            </Text>
          </div>
          <BufferStatCells stats={agxStats} />
        </Card>
        <Card
          as="div"
          className="grid min-h-29.75 content-center gap-2 rounded-2xl px-5 py-3"
          data-slot-id="release-buffer-stat-gagx"
          surface="elevated"
        >
          <div className="flex items-center gap-2">
            <span className="grid size-(--app-icon-token) shrink-0 place-items-center overflow-hidden rounded-full bg-black">
              <Icon
                alt=""
                className="size-(--app-icon-lg)"
                size="lg"
                src={tokenCarouselIcons.gagxIcon}
              />
            </span>
            <Text as="strong" className="font-semibold" variant="headline">
              gAGX
            </Text>
          </div>
          <BufferStatCells stats={gagxStats} />
        </Card>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.buffer.recordsTitle}</DappContentHeading>
        <DappTableCard
          footer={
            shouldShowTablePagination(bufferLogsTotal) ? (
              <DappTablePagination
                embedded
                onPageChange={setRecordsPage}
                page={recordsPage}
                total={bufferLogsTotal}
              />
            ) : undefined
          }
        >
          <ResponsiveTable
            colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
            headers={[...t.release.recordColumns]}
            isLoading={bufferLogsLoading}
            rows={bufferLogRows}
          />
          {!bufferLogsLoading && bufferLogRows.length === 0 ? (
            <DappTableEmptyMessage embedded title={t.release.recordsEmpty} />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.buffer.mechanismTitle}</DappContentHeading>
        <Text as="p" className="mb-4 text-foreground/40" variant="copy">
          {t.release.buffer.mechanismSubtitle}
        </Text>
        {/* Figma `4470:331`：四灰底 step 卡 140 + 箭头 + strip（非 ProcessSteps / 非 Lucide） */}
        <Card
          as="div"
          className="grid gap-2 rounded-2xl p-4"
          data-slot-id="release-buffer-mechanism"
          surface="elevated"
        >
          <div
            className="flex flex-col gap-3 lg:flex-row lg:items-center"
            data-slot-id="release-buffer-mech-stages"
          >
            {steps.map((step, index) => {
              const iconSrc = MECHANISM_STEP_ICONS[index] ?? MECHANISM_STEP_ICONS[0]
              const isLast = index >= steps.length - 1
              return (
                <div className="contents" key={`${step.title}-${step.body}`}>
                  <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-muted p-4 lg:w-35 lg:shrink-0">
                    <span
                      className="grid size-11 place-items-center rounded-full"
                      data-slot-id={`release-buffer-mech-icon-${index}`}
                    >
                      <img alt="" className="size-5.5" src={iconSrc} />
                    </span>
                    <Text as="p" className="m-0 text-center font-medium" variant="copy">
                      {step.title}
                    </Text>
                    <Text as="p" className="m-0 text-center font-medium" variant="copy">
                      {step.body}
                    </Text>
                  </div>
                  {!isLast ? (
                    <span
                      className="hidden h-6 shrink-0 items-center justify-center lg:flex lg:flex-1"
                      data-slot-id={`release-buffer-mech-conn-${index}`}
                    >
                      <img
                        alt=""
                        className="h-2.5 w-3.25"
                        data-slot-id={`release-buffer-mech-arrow-${index}`}
                        src={dappAssets.releaseBufferMechArrow}
                      />
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
          <ul
            className="m-0 flex list-none flex-wrap items-center justify-between gap-2 px-4 py-2.5"
            data-slot-id="release-buffer-mech-strip"
          >
            {t.release.buffer.mechanismBenefits.map((item) => (
              <li className="flex items-center gap-1.5" key={item}>
                <img alt="" className="size-3 shrink-0" src={dappAssets.releaseBufferMechCheck} />
                <Text as="span" className="font-medium text-foreground/70" variant="support">
                  {item}
                </Text>
              </li>
            ))}
          </ul>
        </Card>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.faq.title}</DappContentHeading>
        <FaqList defaultOpenFirst={false} items={t.release.faq.buffer} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
