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
import { formatDecimal, parseApiAmount, toUsd } from '~/shared/presenters/format'
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

  const unitSuffix = ` ${unit}`

  function formatReleasingLabel(): string {
    return formatTokenAmount(chainReady ? queueQuery.data?.totalReleasing : null, AGX_DECIMALS, {
      digits: 4,
      trimZeros: false,
      suffix: unitSuffix,
    })
  }

  function formatReleasedLabel(): string {
    if (chainReady) {
      return formatTokenAmount(queueQuery.data?.totalClaimable, AGX_DECIMALS, {
        digits: 4,
        trimZeros: false,
        suffix: unitSuffix,
      })
    }
    // API 可领 ≈ released − claimed；勿直接用累计 released_amount
    const released = sessionReady ? parseApiAmount(api?.released_amount) : null
    const claimed = sessionReady ? parseApiAmount(api?.total_claimed_amount) : null
    return formatDecimal(
      released != null && claimed != null ? Math.max(0, released - claimed) : null,
      { digits: 4, suffix: unitSuffix },
    )
  }

  function formatLifetimeClaimed(): string {
    return formatDecimal(sessionReady ? parseApiAmount(api?.total_claimed_amount) : null, {
      digits: 4,
      suffix: unitSuffix,
    })
  }

  const releasingNum = chainReady ? formatTokenAmountToNumber(releasing, AGX_DECIMALS) : null
  const releasedNum = (() => {
    if (chainReady) return formatTokenAmountToNumber(claimable, AGX_DECIMALS)
    const released = sessionReady ? parseApiAmount(api?.released_amount) : null
    const claimed = sessionReady ? parseApiAmount(api?.total_claimed_amount) : null
    if (released != null && claimed != null) return Math.max(0, released - claimed)
    return null
  })()
  const lifetimeApproxNum = sessionReady ? parseApiAmount(api?.total_claimed_amount) : null

  const stats = [
    {
      label: t.release.labels.releasing,
      hint: t.release.queue.hints.releasing,
      value: formatReleasingLabel(),
      approx: formatDecimal(toUsd(releasingNum, priceUsd), { digits: 2, prefix: '≈ $' }),
    },
    {
      label: t.release.labels.released,
      hint: t.release.queue.hints.released,
      value: formatReleasedLabel(),
      approx: formatDecimal(toUsd(releasedNum, priceUsd), { digits: 2, prefix: '≈ $' }),
    },
    {
      label: t.release.queue.lifetimeClaimed,
      hint: t.release.queue.hints.lifetimeClaimed,
      value: formatLifetimeClaimed(),
      approx: formatDecimal(toUsd(lifetimeApproxNum, priceUsd), { digits: 2, prefix: '≈ $' }),
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
