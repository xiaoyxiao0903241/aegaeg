import { tokenCarouselIcons } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBufferPoolLogs, useBufferPoolSummary } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapBufferPoolLogToRow } from '~/shared/api/map-flow-log-rows'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { Card } from '~/shared/ui/card'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
import { formatReleaseApiOrChainLabel } from '~/views/dapp/release/format-release-api-or-chain-label'
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

function BufferStatCells({
  stats,
}: {
  stats: ReadonlyArray<{ label: string; value: string; approx: string }>
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {stats.map((stat) => (
        <div className="grid gap-0.5" key={stat.label}>
          <Text as="span" className="leading-4" tone="muted-foreground" variant="detail">
            {stat.label}
          </Text>
          <Text as="strong" className="text-sm leading-5 font-semibold" variant="copy">
            <DappCountValue text={stat.value} />
          </Text>
          <Text as="span" className="leading-4 text-foreground/40" variant="detail">
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
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const apiSummaryQuery = useBufferPoolSummary(sessionReady)
  const bufferLogsQuery = useBufferPoolLogs({}, sessionReady)
  const bufferLogRows = bufferLogsQuery.data?.items.map(mapBufferPoolLogToRow) ?? []
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

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading id="release-buffer-title">
          {t.release.buffer.statsTitle}
        </DappContentHeading>
        {/* Figma 数据行 119：min-h-29.75；内容压紧跟稿 */}
        <Card
          as="div"
          className="mb-3 grid min-h-29.75 content-center gap-2 rounded-2xl px-5 py-3"
          surface="elevated"
        >
          <div className="flex items-center gap-2">
            <DappIcon
              alt=""
              className="size-6 shrink-0 rounded-control"
              size="sm"
              src={tokenCarouselIcons.agxIcon}
            />
            <Text as="strong" className="leading-5 font-semibold" variant="copy">
              AGX
            </Text>
          </div>
          <BufferStatCells stats={agxStats} />
        </Card>
        <Card
          as="div"
          className="grid min-h-29.75 content-center gap-2 rounded-2xl px-5 py-3"
          surface="elevated"
        >
          <div className="flex items-center gap-2">
            <DappIcon
              alt=""
              className="size-6 shrink-0 rounded-control"
              size="sm"
              src={tokenCarouselIcons.gagxIcon}
            />
            <Text as="strong" className="leading-5 font-semibold" variant="copy">
              gAGX
            </Text>
          </div>
          <BufferStatCells stats={gagxStats} />
        </Card>
        <Text as="p" className="mt-2" tone="muted-foreground" variant="caption">
          {t.release.buffer.gagxHint}
        </Text>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.buffer.recordsTitle}</DappContentHeading>
        <DappTableCard>
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
        <Text as="p" className="mb-4" tone="muted-foreground" variant="caption">
          {t.release.buffer.mechanismSubtitle}
        </Text>
        {/* Figma fcard 183：min-h-45.75 */}
        <Card as="div" className="min-h-45.75 rounded-2xl p-4" surface="elevated">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.release.buffer.mechanismSteps.map((step) => (
              <li className="rounded-2xl bg-muted p-3 text-center" key={step.title}>
                <Text as="p" className="font-semibold" variant="copy">
                  {step.title}
                </Text>
                <Text as="p" className="mt-1" tone="muted-foreground" variant="caption">
                  {step.body}
                </Text>
              </li>
            ))}
          </ol>
          <ul className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
            {t.release.buffer.mechanismBenefits.map((item) => (
              <li className="flex items-center gap-1.5" key={item}>
                <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                <Text as="span" tone="muted-foreground" variant="caption">
                  {item}
                </Text>
              </li>
            ))}
          </ul>
        </Card>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.release.faq.title}</DappContentHeading>
        <FaqList items={t.release.faq.buffer} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
