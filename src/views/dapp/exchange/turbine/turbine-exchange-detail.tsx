/**
 * Turbine 详情页
 *
 * 概览区展示待解锁、冷却中与累计提现三张统计卡，下方为代币
 * 介绍轮播、解锁记录、机制说明与 FAQ。
 */
import { tokenCarouselIcons } from '~/app/assets'
import { Grid } from '~/app/shell/grid'
import { Tile } from '~/app/shell/tile'
import { useDappShell } from '~/app/use-dapp-shell'
import { useTurbineLogs } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { mapTurbineLogToOpsRow } from '~/shared/api/map-flow-log-rows'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { FaqList } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { Section } from '~/shared/components/section'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'

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
  const { sessionReady } = useDappShell()
  const turbineLogsQuery = useTurbineLogs({}, sessionReady)
  const turbineLogRows = turbineLogsQuery.data?.items.map(mapTurbineLogToOpsRow) ?? []
  const turbineLogsLoading = sessionReady && turbineLogsQuery.isLoading
  // 三张概览卡：空态显示 0.00 / ≈ $0.00（不显示 —）
  const overviewMetrics = [
    {
      label: t.exchange.turbine.metrics.pendingUnlock,
      amount: pendingUnlockLabel,
      usd: pendingUnlockUsdHint,
    },
    {
      label: t.exchange.turbine.metrics.cooling,
      amount: coolingLabel,
      usd: coolingUsdHint,
    },
    {
      label: t.exchange.turbine.metrics.totalWithdrawn,
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
              <Tile.Label>{metric.label}</Tile.Label>
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
        {/* 代币介绍轮播顺序：gAGX · USD1 · X · gAGX 质押 */}
        <TokenAboutCarousel cardKeys={['gagx', 'usd1', 'x', 'gagxStake']} />
      </Section>

      <Section>
        <Section.Title>{t.exchange.turbine.recordsTitle}</Section.Title>
        <Table>
          <Table.Body
            colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
            empty={t.exchange.turbine.recordsEmpty}
            headers={[...t.assets.opsColumns]}
            isLoading={turbineLogsLoading}
            rows={turbineLogRows}
          />
        </Table>
      </Section>

      <Section>
        <Section.Title>{t.exchange.turbine.mechanismTitle}</Section.Title>
        <Section.Description>{t.exchange.turbine.mechanismIntro}</Section.Description>
        <div className="grid grid-cols-2 gap-4 max-dapp:grid-cols-1 max-dapp:gap-3">
          {t.exchange.turbine.mechanism.map((item) => (
            <Card
              key={item.title}
              surface="elevated"
              className="flex flex-col gap-2 rounded-2xl border-0 p-4 shadow-card"
            >
              <Text as="p" variant="detail" className="m-0 font-semibold">
                {item.title}
              </Text>
              <Text as="p" variant="copy" className="m-0 text-foreground/70">
                {item.body}
              </Text>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <Section.Title>{t.exchange.faq.title}</Section.Title>
        <FaqList defaultOpenFirst={false} items={t.exchange.turbine.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
