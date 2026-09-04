/**
 * 缓冲池页
 *
 * 顶部双卡展示 AGX 与 gAGX 的入池、已提取、释放中三组数据；
 * 中部为缓冲记录表，底部为机制步骤与收益说明。
 * gAGX 来自链上分流器快照（与 Dock 同源）。
 */
import { useState } from 'react'

import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useBufferPoolLogs, useBufferPoolSummary } from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { usePrincipalReleaseDurationDays } from '~/hooks/use-principal-release-duration-days'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { tokenCarouselIcons } from '~/shared/assets/dapp'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { formatDecimal, parseApiAmount, toUsd } from '~/shared/presenters/format'
import { mapBufferPoolLogToRow } from '~/shared/presenters/map-flow-log-rows'
import { BufferAssetCard, BufferMechanismCard } from '~/views/dapp/release/buffer/primitives'
import { formatReleaseApiOrChainLabel } from '~/views/dapp/release/shared'
import { useReleaseBufferSnapshot } from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export function BufferDetail() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappHost()
  const priceUsd = useAgxPriceUsd()
  const [recordsPage, setRecordsPage] = useState(1)
  const bufferQuery = useReleaseBufferSnapshot(walletReady)
  const apiSummaryQuery = useBufferPoolSummary(sessionReady)
  const bufferLogsQuery = useBufferPoolLogs(tablePageQuery(recordsPage), sessionReady)
  const bufferLogRows =
    bufferLogsQuery.data?.items.map((item) => mapBufferPoolLogToRow(item, t.flowOps)) ?? []
  const bufferLogsTotal = bufferLogsQuery.data?.total ?? 0
  const bufferLogsLoading = sessionReady && bufferLogsQuery.isLoading
  const amount = bufferQuery.data?.agx.totalAmount ?? ZERO_BI
  const claimed = bufferQuery.data?.agx.totalClaimed ?? ZERO_BI
  const releasing = bufferQuery.data?.agx.totalReleasing ?? ZERO_BI
  const gagxAmount = bufferQuery.data?.gagx.totalAmount ?? ZERO_BI
  const gagxClaimed = bufferQuery.data?.gagx.totalClaimed ?? ZERO_BI
  const gagxReleasing = bufferQuery.data?.gagx.totalReleasing ?? ZERO_BI
  const api = apiSummaryQuery.data
  const chainReady = walletReady && bufferQuery.data != null

  function amountNum(apiRaw: string | undefined, chain: bigint, decimals: number): number | null {
    if (chainReady) return formatTokenAmountToNumber(chain, decimals)
    return sessionReady ? parseApiAmount(apiRaw) : null
  }

  const agxStats = [
    {
      label: t.release.buffer.entered,
      hint: t.release.buffer.hints.enteredAgx,
      value: formatReleaseApiOrChainLabel({
        sessionReady,
        apiRaw: api?.cumulative_amount,
        chainReady,
        chainValue: amount,
        decimals: AGX_DECIMALS,
        unit: 'AGX',
      }),
      approx: formatDecimal(
        toUsd(amountNum(api?.cumulative_amount, amount, AGX_DECIMALS), priceUsd),
        { digits: 2, prefix: '≈ $' },
      ),
    },
    {
      label: t.release.buffer.extracted,
      hint: t.release.buffer.hints.extractedAgx,
      value: formatReleaseApiOrChainLabel({
        sessionReady,
        apiRaw: api?.released_amount,
        chainReady,
        chainValue: claimed,
        decimals: AGX_DECIMALS,
        unit: 'AGX',
      }),
      approx: formatDecimal(
        toUsd(amountNum(api?.released_amount, claimed, AGX_DECIMALS), priceUsd),
        { digits: 2, prefix: '≈ $' },
      ),
    },
    {
      label: t.release.labels.releasing,
      hint: t.release.buffer.hints.releasingAgx,
      value: formatReleaseApiOrChainLabel({
        sessionReady,
        apiRaw: undefined,
        chainReady,
        chainValue: releasing,
        decimals: AGX_DECIMALS,
        unit: 'AGX',
      }),
      approx: formatDecimal(
        toUsd(chainReady ? formatTokenAmountToNumber(releasing, AGX_DECIMALS) : null, priceUsd),
        { digits: 2, prefix: '≈ $' },
      ),
    },
  ]

  const gagxStats = [
    {
      label: t.release.buffer.entered,
      hint: t.release.buffer.hints.enteredGagx,
      value: formatTokenAmount(chainReady ? gagxAmount : null, GAGX_DECIMALS, {
        digits: 4,
        trimZeros: false,
        suffix: ' gAGX',
      }),
      approx: formatDecimal(
        toUsd(chainReady ? formatTokenAmountToNumber(gagxAmount, GAGX_DECIMALS) : null, priceUsd),
        { digits: 2, prefix: '≈ $' },
      ),
    },
    {
      label: t.release.buffer.extracted,
      hint: t.release.buffer.hints.extractedGagx,
      value: formatTokenAmount(chainReady ? gagxClaimed : null, GAGX_DECIMALS, {
        digits: 4,
        trimZeros: false,
        suffix: ' gAGX',
      }),
      approx: formatDecimal(
        toUsd(chainReady ? formatTokenAmountToNumber(gagxClaimed, GAGX_DECIMALS) : null, priceUsd),
        { digits: 2, prefix: '≈ $' },
      ),
    },
    {
      label: t.release.labels.releasing,
      hint: t.release.buffer.hints.releasingGagx,
      value: formatTokenAmount(chainReady ? gagxReleasing : null, GAGX_DECIMALS, {
        digits: 4,
        trimZeros: false,
        suffix: ' gAGX',
      }),
      approx: formatDecimal(
        toUsd(
          chainReady ? formatTokenAmountToNumber(gagxReleasing, GAGX_DECIMALS) : null,
          priceUsd,
        ),
        { digits: 2, prefix: '≈ $' },
      ),
    },
  ]

  const durationQuery = usePrincipalReleaseDurationDays()
  const bufferDays = durationQuery.data ?? 30
  const steps = t.release.buffer.mechanismSteps.map((step) => ({
    ...step,
    title: interpolate(step.title, { days: bufferDays }),
    body: interpolate(step.body, { days: bufferDays }),
  }))

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
            emphasisColumns={[1]}
            empty={t.release.recordsEmpty}
            headers={[...t.release.recordColumns]}
            isLoading={bufferLogsLoading}
            mutedColumns={[0]}
            rows={bufferLogRows}
          />
          <Table.Footer>
            <Table.Pagination
              onPageChange={setRecordsPage}
              page={recordsPage}
              total={bufferLogsTotal}
            />
          </Table.Footer>
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
