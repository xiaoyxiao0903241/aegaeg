/**
 * 缓冲池页
 *
 * 顶部双卡展示 AGX 与 gAGX 的入池、已提取、释放中三组数据；
 * 中部为缓冲记录表，底部为机制步骤与收益说明。
 * gAGX 无链上数据源，数值显示为 0。
 */
import { useState } from 'react'

import { tokenCarouselIcons } from '~/app/assets'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBufferPoolLogs, useBufferPoolSummary } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapBufferPoolLogToRow } from '~/shared/api/map-flow-log-rows'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { shouldShowTablePagination, tablePageQuery } from '~/shared/lib/table-pagination'
import { BufferAssetCard } from '~/views/dapp/release/buffer/buffer-asset-card'
import { BufferMechanismCard } from '~/views/dapp/release/buffer/buffer-mechanism-card'
import { formatReleaseApiOrChainLabel } from '~/views/dapp/release/format-release-api-or-chain-label'
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export function ReleaseBufferDetail() {
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
    <Detail>
      <Section>
        <Section.Title id="release-buffer-title">{t.release.buffer.statsTitle}</Section.Title>
        <BufferAssetCard
          iconSrc={tokenCarouselIcons.agxIcon}
          slotId="release-buffer-stat-agx"
          stats={agxStats}
          tokenLabel="AGX"
        />
        <BufferAssetCard
          iconSrc={tokenCarouselIcons.gagxIcon}
          slotId="release-buffer-stat-gagx"
          stats={gagxStats}
          tokenLabel="gAGX"
        />
      </Section>

      <Section>
        <Section.Title>{t.release.buffer.recordsTitle}</Section.Title>
        <Table>
          <Table.Body
            colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
            empty={t.release.recordsEmpty}
            headers={[...t.release.recordColumns]}
            isLoading={bufferLogsLoading}
            rows={bufferLogRows}
          />
          {shouldShowTablePagination(bufferLogsTotal) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={setRecordsPage}
                page={recordsPage}
                total={bufferLogsTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.release.buffer.mechanismTitle}</Section.Title>
        <Section.Description>{t.release.buffer.mechanismSubtitle}</Section.Description>
        <BufferMechanismCard benefits={t.release.buffer.mechanismBenefits} steps={steps} />
      </Section>

      <Section>
        <Section.Title>{t.release.faq.title}</Section.Title>
        <Faq defaultOpenFirst={false} items={t.release.faq.buffer} variant="dapp" />
      </Section>
    </Detail>
  )
}
