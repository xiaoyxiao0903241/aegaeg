import { useState } from 'react'

import { tokenCarouselIcons } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { DappTablePagination } from '~/app/shell/dapp-table-pagination'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useReleasePoolLogs, useReleasePoolSummary } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapReleasePoolLogToRow } from '~/shared/api/map-flow-log-rows'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { FaqList } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { shouldShowTablePagination, tablePageQuery } from '~/shared/lib/table-pagination'
import { useReleaseQueueSnapshot } from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export function ReleaseQueueContent() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappShell()
  const priceUsd = useAgxPriceUsd()
  const [recordsPage, setRecordsPage] = useState(1)
  const queueQuery = useReleaseQueueSnapshot(walletReady)
  const apiSummaryQuery = useReleasePoolSummary(sessionReady)
  const queueLogsQuery = useReleasePoolLogs(tablePageQuery(recordsPage), sessionReady)
  const queueLogRows = queueLogsQuery.data?.items.map(mapReleasePoolLogToRow) ?? []
  const queueLogsTotal = queueLogsQuery.data?.total ?? 0
  const queueLogsLoading = sessionReady && queueLogsQuery.isLoading
  const releasing = queueQuery.data?.totalReleasing ?? 0n
  const claimable = queueQuery.data?.totalClaimable ?? 0n
  const unit = t.release.units.queue
  const api = apiSummaryQuery.data

  function parseApiOrChain(apiRaw: string | undefined, chain: bigint): number {
    if (sessionReady && apiRaw != null && apiRaw.trim() !== '') {
      const n = Number(apiRaw)
      if (Number.isFinite(n)) return n
    }
    return formatTokenAmountToNumber(chain, AGX_DECIMALS)
  }

  function formatReleasingLabel(): string {
    if (sessionReady && api?.releasing_amount != null && api.releasing_amount.trim() !== '') {
      const n = Number(api.releasing_amount)
      if (Number.isFinite(n)) return `${formatGroupedNumber(n, { digits: 4 })} ${unit}`
    }
    return `${formatTokenAmount(releasing, AGX_DECIMALS, 4)} ${unit}`
  }

  function formatReleasedLabel(): string {
    if (sessionReady && api?.released_amount != null && api.released_amount.trim() !== '') {
      const n = Number(api.released_amount)
      if (Number.isFinite(n)) return `${formatGroupedNumber(n, { digits: 4 })} ${unit}`
    }
    return `${formatTokenAmount(claimable, AGX_DECIMALS, 4)} ${unit}`
  }

  function formatLifetimeClaimed(): string {
    if (
      sessionReady &&
      api?.total_claimed_amount != null &&
      api.total_claimed_amount.trim() !== ''
    ) {
      const n = Number(api.total_claimed_amount)
      if (Number.isFinite(n)) return `${formatGroupedNumber(n, { digits: 4 })} ${unit}`
    }
    /** 无 lifetime 链上源 → 空态 0 */
    return `${formatGroupedNumber(0, { digits: 4 })} ${unit}`
  }

  const releasingNum = parseApiOrChain(api?.releasing_amount, releasing)
  const releasedNum = parseApiOrChain(api?.released_amount, claimable)
  const lifetimeNum =
    sessionReady && api?.total_claimed_amount != null && api.total_claimed_amount.trim() !== ''
      ? Number(api.total_claimed_amount)
      : 0
  const lifetimeApproxNum = Number.isFinite(lifetimeNum) ? lifetimeNum : 0

  const stats = [
    {
      label: t.release.labels.releasing,
      value: formatReleasingLabel(),
      approx: formatApproxUsd(releasingNum, priceUsd),
    },
    {
      label: t.release.labels.released,
      value: formatReleasedLabel(),
      approx: formatApproxUsd(releasedNum, priceUsd),
    },
    {
      label: t.release.queue.lifetimeClaimed,
      value: formatLifetimeClaimed(),
      approx: formatApproxUsd(lifetimeApproxNum, priceUsd),
    },
  ]

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading id="release-queue-title">
          {t.release.queue.statsTitle}
        </DappContentHeading>
        <div className="grid gap-4 dapp:grid-cols-3">
          {stats.map((stat) => (
            <Card
              as="div"
              className="grid gap-2 rounded-2xl px-5 py-4"
              data-slot-id={`release-queue-stat-${stat.label}`}
              key={stat.label}
              surface="elevated"
            >
              <Text as="span" className="font-medium text-foreground/40" variant="caption">
                {stat.label}
              </Text>
              <div className="flex items-center gap-2">
                <Icon
                  alt=""
                  className="size-(--app-icon-rail) shrink-0 rounded-md"
                  size="rail"
                  src={tokenCarouselIcons.gagxIcon}
                />
                <Text as="strong" className="font-semibold" variant="section">
                  <CountValue text={stat.value} />
                </Text>
              </div>
              <Text as="span" className="text-foreground/40" variant="caption">
                {stat.approx}
              </Text>
            </Card>
          ))}
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.queue.recordsTitle}</DappContentHeading>
        <DappTableCard
          footer={
            shouldShowTablePagination(queueLogsTotal) ? (
              <DappTablePagination
                embedded
                onPageChange={setRecordsPage}
                page={recordsPage}
                total={queueLogsTotal}
              />
            ) : undefined
          }
        >
          <ResponsiveTable
            colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
            headers={[...t.release.recordColumns]}
            isLoading={queueLogsLoading}
            rows={queueLogRows}
          />
          {!queueLogsLoading && queueLogRows.length === 0 ? (
            <DappTableEmptyMessage embedded title={t.release.recordsEmpty} />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.faq.title}</DappContentHeading>
        <FaqList defaultOpenFirst={false} items={t.release.faq.queue} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
