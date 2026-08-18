/**
 * Turbine 详情页
 *
 * 概览区展示待解锁、冷却中与累计提现三张统计卡，下方为涡轮
 * 介绍卡、解锁记录、机制说明与 FAQ。
 */
import { useState } from 'react'

import { ZERO_BI } from '~/core/constants'
import { useTurbineLogs } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
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
import { shouldShowTablePagination, tablePageQuery } from '~/shared/lib/table-pagination'
import { mapTurbineLogToOpsRow } from '~/shared/presenters/map-flow-log-rows'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/primitives'
import { TurbineMechanismCard } from '~/views/dapp/exchange/turbine/primitives'
import { readTurbineCooldownDuration } from '~/web3/exchange/turbine-exchange-read'

/** 详情页只接收概览标量，解锁金额输入不触达详情。 */
export type TurbineExchangeDetailProps = {
  pendingUnlockLabel: string
  pendingUnlockUsdHint: string
  coolingLabel: string
  coolingUsdHint: string
  totalWithdrawnLabel: string
  totalWithdrawnUsdHint: string
}

export function TurbineExchangeDetail({
  pendingUnlockLabel,
  pendingUnlockUsdHint,
  coolingLabel,
  coolingUsdHint,
  totalWithdrawnLabel,
  totalWithdrawnUsdHint,
}: TurbineExchangeDetailProps) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappHost()
  const cooldownQuery = useChainQuery({
    queryKey: queryKeys.chain.turbineCooldown,
    queryFn: () => readTurbineCooldownDuration(),
    scope: 'public',
    freshness: 'quote',
  })
  const cooldownSeconds = Number(cooldownQuery.data ?? ZERO_BI)
  const cooldownHours = cooldownSeconds > 0 ? Math.round(cooldownSeconds / 3600) : '—'
  const faqItems = t.exchange.turbine.faq.items.map((item) => ({
    ...item,
    a: interpolate(item.a, { cooldownHours }),
  }))
  const [logsPage, setLogsPage] = useState(1)
  const turbineLogsQuery = useTurbineLogs(tablePageQuery(logsPage), sessionReady)
  const turbineLogRows =
    turbineLogsQuery.data?.items.map((item) => mapTurbineLogToOpsRow(item, t.flowOps)) ?? []
  const turbineLogsTotal = turbineLogsQuery.data?.total ?? 0
  const turbineLogsLoading = sessionReady && turbineLogsQuery.isLoading
  // 三张概览卡：空态显示 0.00 / ≈ $0.00（不显示 —）
  const overviewMetrics = [
    {
      label: t.exchange.turbine.metrics.pendingUnlock,
      hint: t.exchange.turbine.metrics.pendingUnlockHint,
      amount: pendingUnlockLabel,
      usd: pendingUnlockUsdHint,
    },
    {
      label: t.exchange.turbine.metrics.cooling,
      hint: t.exchange.turbine.metrics.coolingHint,
      amount: coolingLabel,
      usd: coolingUsdHint,
    },
    {
      label: t.exchange.turbine.metrics.totalWithdrawn,
      hint: t.exchange.turbine.metrics.totalWithdrawnHint,
      amount: totalWithdrawnLabel,
      usd: totalWithdrawnUsdHint,
    },
  ] as const

  return (
    <Detail>
      <Section>
        <Section.Title id="exchange-title">{t.exchange.turbine.dataTitle}</Section.Title>
        {/* 移动端三卡竖排 */}
        <Grid columns={3} stackOnDapp>
          {overviewMetrics.map((metric) => (
            <Tile key={metric.label}>
              <Tile.Label>
                {metric.label}
                <Tooltip.Info content={metric.hint} />
              </Tile.Label>
              <div className="flex items-center gap-2">
                <Icon
                  alt=""
                  className="size-(--app-icon-rail) shrink-0 rounded-full object-cover"
                  size="rail"
                  src={tokenCarouselIcons.gagxIcon}
                />
                <Text as="strong" className="m-0 text-base/5 font-semibold" variant="copy">
                  <CountValue text={`${metric.amount} gAGX`} />
                </Text>
              </div>
              <Tile.Note>
                <CountValue text={`≈ ${metric.usd || '0.00'}`} />
              </Tile.Note>
            </Tile>
          ))}
        </Grid>
      </Section>

      <Section>
        <Section.Title>{t.exchange.turbine.aboutTitle}</Section.Title>
        <TokenAboutCarousel cardKeys={['turbine']} />
      </Section>

      <Section>
        <Section.Title>{t.exchange.turbine.recordsTitle}</Section.Title>
        <Table>
          <Table.Body
            colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
            emphasisColumns={[1]}
            empty={t.exchange.turbine.recordsEmpty}
            headers={[...t.assets.opsColumns]}
            isLoading={turbineLogsLoading}
            mutedColumns={[0]}
            rows={turbineLogRows}
          />
          {shouldShowTablePagination(turbineLogsTotal) ? (
            <Table.Footer>
              <Table.Pagination
                onPageChange={setLogsPage}
                page={logsPage}
                total={turbineLogsTotal}
              />
            </Table.Footer>
          ) : null}
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.exchange.turbine.mechanismTitle}</Section.Title>
        <Section.Description>{t.exchange.turbine.mechanismIntro}</Section.Description>
        <Grid columns={2} stackOnDapp>
          {t.exchange.turbine.mechanism.map((item) => (
            <TurbineMechanismCard body={item.body} key={item.title} title={item.title} />
          ))}
        </Grid>
      </Section>

      <Section>
        <Section.Title>{t.exchange.faq.title}</Section.Title>
        <Faq defaultOpenFirst={false} items={faqItems} variant="dapp" />
      </Section>
    </Detail>
  )
}
