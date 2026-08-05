/**
 * 释放队列页
 *
 * 顶部三张统计卡展示释放中、已释放与累计领取；
 * 中部为释放记录表，底部为常见问题折叠列表。
 */
import { useState } from 'react'

import { tokenCarouselIcons } from '~/app/assets'
import { Grid } from '~/app/shell/grid'
import { Tile } from '~/app/shell/tile'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useReleasePoolLogs, useReleasePoolSummary } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapReleasePoolLogToRow } from '~/shared/api/map-flow-log-rows'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { FaqList } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { shouldShowTablePagination, tablePageQuery } from '~/shared/lib/table-pagination'
import { useReleaseQueueSnapshot } from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export function ReleaseQueueDetail() {
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
    /** 累计领取无链上数据源：空态显示 0 */
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
    <Detail>
      <Section>
        <Section.Title id="release-queue-title">{t.release.queue.statsTitle}</Section.Title>
        <Grid columns={3}>
          {stats.map((stat) => (
            <Tile data-slot-id={`release-queue-stat-${stat.label}`} key={stat.label}>
              <Tile.Label>{stat.label}</Tile.Label>
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
              <Tile.Note>{stat.approx}</Tile.Note>
            </Tile>
          ))}
        </Grid>
      </Section>

      <Section>
        <Section.Title>{t.release.queue.recordsTitle}</Section.Title>
        <Table>
          <Table.Body
            colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
            empty={t.release.recordsEmpty}
            headers={[...t.release.recordColumns]}
            isLoading={queueLogsLoading}
            rows={queueLogRows}
          />
          {shouldShowTablePagination(queueLogsTotal) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={setRecordsPage}
                page={recordsPage}
                total={queueLogsTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.release.faq.title}</Section.Title>
        <FaqList defaultOpenFirst={false} items={t.release.faq.queue} variant="dapp" />
      </Section>
    </Detail>
  )
}
