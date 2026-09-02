/**
 * 释放队列页
 *
 * 顶部三张统计卡展示释放中、已释放与累计领取；
 * 中部为释放记录表，底部为常见问题折叠列表。
 */
import { useState } from 'react'

import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useReleasePoolLogs, useReleasePoolSummary } from '~/hooks/use-api-data'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { tokenCarouselIcons } from '~/shared/assets/dapp'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Icon } from '~/shared/components/icon'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { Tooltip } from '~/shared/components/tooltip'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { formatNumber, formatUsdApprox, parseApiAmount } from '~/shared/presenters/format'
import { mapReleasePoolLogToRow } from '~/shared/presenters/map-flow-log-rows'
import { useReleaseQueueSnapshot } from '~/views/dapp/release/use-release-reads'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export function QueueDetail() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappHost()
  const priceUsd = useAgxPriceUsd()
  const [recordsPage, setRecordsPage] = useState(1)
  const queueQuery = useReleaseQueueSnapshot(walletReady)
  const apiSummaryQuery = useReleasePoolSummary(sessionReady)
  const queueLogsQuery = useReleasePoolLogs(tablePageQuery(recordsPage), sessionReady)
  const queueLogRows =
    queueLogsQuery.data?.items.map((item) => mapReleasePoolLogToRow(item, t.flowOps)) ?? []
  const queueLogsTotal = queueLogsQuery.data?.total ?? 0
  const queueLogsLoading = sessionReady && queueLogsQuery.isLoading
  const releasing = queueQuery.data?.totalReleasing ?? ZERO_BI
  const claimable = queueQuery.data?.totalClaimable ?? ZERO_BI
  const unit = t.release.units.queue
  const api = apiSummaryQuery.data
  const chainReady = walletReady && queueQuery.data != null

  function formatReleasingLabel(): string {
    if (chainReady) return `${formatTokenAmount(releasing, AGX_DECIMALS, 4)} ${unit}`
    return `${formatNumber(0, { digits: 4 })} ${unit}`
  }

  function formatReleasedLabel(): string {
    if (chainReady) return `${formatTokenAmount(claimable, AGX_DECIMALS, 4)} ${unit}`
    // API 可领 ≈ released − claimed；勿直接用累计 released_amount
    const released = sessionReady ? parseApiAmount(api?.released_amount) : null
    const claimed = sessionReady ? parseApiAmount(api?.total_claimed_amount) : null
    if (released != null && claimed != null) {
      return `${formatNumber(Math.max(0, released - claimed), { digits: 4 })} ${unit}`
    }
    return `${formatNumber(0, { digits: 4 })} ${unit}`
  }

  function formatLifetimeClaimed(): string {
    const n = sessionReady ? parseApiAmount(api?.total_claimed_amount) : null
    if (n != null) return `${formatNumber(n, { digits: 4 })} ${unit}`
    // 累计领取没有链上数据源，未加载时显示 0
    return `${formatNumber(0, { digits: 4 })} ${unit}`
  }

  const releasingNum = chainReady ? formatTokenAmountToNumber(releasing, AGX_DECIMALS) : 0
  const releasedNum = (() => {
    if (chainReady) return formatTokenAmountToNumber(claimable, AGX_DECIMALS)
    const released = sessionReady ? parseApiAmount(api?.released_amount) : null
    const claimed = sessionReady ? parseApiAmount(api?.total_claimed_amount) : null
    if (released != null && claimed != null) return Math.max(0, released - claimed)
    return 0
  })()
  const lifetimeApproxNum = (sessionReady ? parseApiAmount(api?.total_claimed_amount) : null) ?? 0

  const stats = [
    {
      label: t.release.labels.releasing,
      hint: t.release.queue.hints.releasing,
      value: formatReleasingLabel(),
      approx: formatUsdApprox(releasingNum, priceUsd),
    },
    {
      label: t.release.labels.released,
      hint: t.release.queue.hints.released,
      value: formatReleasedLabel(),
      approx: formatUsdApprox(releasedNum, priceUsd),
    },
    {
      label: t.release.queue.lifetimeClaimed,
      hint: t.release.queue.hints.lifetimeClaimed,
      value: formatLifetimeClaimed(),
      approx: formatUsdApprox(lifetimeApproxNum, priceUsd),
    },
  ]

  return (
    <Detail>
      <Section>
        <Section.Title id="release-queue-title">{t.release.queue.statsTitle}</Section.Title>
        <Grid columns={3} stackOnDapp>
          {stats.map((stat) => (
            <Tile data-slot-id={`release-queue-stat-${stat.label}`} key={stat.label}>
              <Tile.Label>
                {stat.label}
                <Tooltip.Info content={stat.hint} />
              </Tile.Label>
              <div className="flex min-w-0 items-center gap-2">
                <Icon
                  alt=""
                  className="size-(--app-icon-rail) shrink-0 rounded-md"
                  size="rail"
                  src={tokenCarouselIcons.gagxIcon}
                />
                <Text
                  as="strong"
                  className="min-w-0 font-semibold wrap-break-word"
                  variant="section"
                >
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
            emphasisColumns={[1]}
            empty={t.release.recordsEmpty}
            headers={[...t.release.recordColumns]}
            isLoading={queueLogsLoading}
            mutedColumns={[0]}
            rows={queueLogRows}
          />
          <Table.Footer>
            <Table.Pagination
              onPageChange={setRecordsPage}
              page={recordsPage}
              total={queueLogsTotal}
            />
          </Table.Footer>
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.release.faq.title}</Section.Title>
        <Faq defaultOpenFirst={false} items={t.release.faq.queue} variant="dapp" />
      </Section>
    </Detail>
  )
}
