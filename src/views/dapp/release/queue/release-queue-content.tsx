import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { useReleasePoolLogs, useReleasePoolSummary } from '~/hooks/use-api-data'
import { mapReleasePoolLogToRow } from '~/shared/api/map-flow-log-rows'
import { useReleaseQueueSnapshot } from '~/views/dapp/release/use-release-reads'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { tokenCarouselIcons } from '~/app/assets'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export function ReleaseQueueContent() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappShell()
  const queueQuery = useReleaseQueueSnapshot(walletReady)
  const apiSummaryQuery = useReleasePoolSummary(sessionReady)
  const queueLogsQuery = useReleasePoolLogs({}, sessionReady)
  const queueLogRows = queueLogsQuery.data?.items.map(mapReleasePoolLogToRow) ?? []
  const queueLogsLoading = sessionReady && queueLogsQuery.isLoading
  const releasing = queueQuery.data?.totalReleasing ?? 0n
  const claimable = queueQuery.data?.totalClaimable ?? 0n
  const unit = t.release.units.queue
  const dash = t.release.dash
  const api = apiSummaryQuery.data
  const apiPending = sessionReady && apiSummaryQuery.isLoading && api == null

  function formatReleasingLabel(): string {
    if (sessionReady && api?.releasing_amount != null && api.releasing_amount.trim() !== '') {
      const n = Number(api.releasing_amount)
      if (Number.isFinite(n)) return `${formatGroupedNumber(n, { digits: 4 })} ${unit}`
    }
    if (apiPending) return '…'
    return walletReady ? `${formatTokenAmount(releasing, AGX_DECIMALS, 4)} ${unit}` : dash
  }

  function formatReleasedLabel(): string {
    if (sessionReady && api?.released_amount != null && api.released_amount.trim() !== '') {
      const n = Number(api.released_amount)
      if (Number.isFinite(n)) return `${formatGroupedNumber(n, { digits: 4 })} ${unit}`
    }
    if (apiPending) return '…'
    return walletReady ? `${formatTokenAmount(claimable, AGX_DECIMALS, 4)} ${unit}` : dash
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
    if (apiPending) return '…'
    return dash
  }

  const stats = [
    {
      label: t.release.labels.releasing,
      value: formatReleasingLabel(),
      approx: walletReady || sessionReady ? '≈ —' : dash,
    },
    {
      label: t.release.labels.released,
      value: formatReleasedLabel(),
      approx: walletReady || sessionReady ? '≈ —' : dash,
    },
    {
      label: t.release.queue.lifetimeClaimed,
      value: formatLifetimeClaimed(),
      approx: walletReady || sessionReady ? '≈ —' : dash,
    },
  ]

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading id="release-queue-title">
          {t.release.queue.statsTitle}
        </DappContentHeading>
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card
              as="div"
              surface="elevated"
              className="grid gap-1.5 rounded-2xl p-4"
              key={stat.label}
            >
              <Text as="span" className="font-medium" tone="muted-foreground" variant="detail">
                {stat.label}
              </Text>
              <div className="flex items-center gap-2">
                <DappIcon
                  alt=""
                  className="size-[18px] rounded-[10px]"
                  size="sm"
                  src={tokenCarouselIcons.gagxIcon}
                />
                <Text as="strong" className="text-base font-semibold" variant="copy">
                  {stat.value}
                </Text>
              </div>
              <Text as="span" tone="muted-foreground" variant="detail">
                {stat.approx}
              </Text>
            </Card>
          ))}
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.queue.recordsTitle}</DappContentHeading>
        <DappTableCard>
          <ResponsiveTable
            colWidths={['200px', '150px', '180px', '1fr']}
            headers={[...t.release.recordColumns]}
            rows={queueLogRows}
          />
          {queueLogRows.length === 0 ? (
            <DappTableEmptyMessage
              embedded
              title={queueLogsLoading ? '…' : t.release.recordsEmpty}
            />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.faq.title}</DappContentHeading>
        <FaqList items={t.release.faq.queue} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
