import { tokenCarouselIcons } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { useDappShell } from '~/app/use-dapp-shell'
import { useTurbineLogs } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { mapTurbineLogToOpsRow } from '~/shared/api/map-flow-log-rows'
import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { FaqList } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'

/** Overview label scalars — unlockAmount draft must not wake Content. */
export type TurbineExchangeContentProps = {
  pendingUnlockLabel: string
  pendingUnlockUsdHint: string
  coolingLabel: string
  coolingUsdHint: string
  totalWithdrawnLabel: string
  totalWithdrawnUsdHint: string
}

export function TurbineExchangeContent({
  pendingUnlockLabel,
  pendingUnlockUsdHint,
  coolingLabel,
  coolingUsdHint,
  totalWithdrawnLabel,
  totalWithdrawnUsdHint,
}: TurbineExchangeContentProps) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const turbineLogsQuery = useTurbineLogs({}, sessionReady)
  const turbineLogRows = turbineLogsQuery.data?.items.map(mapTurbineLogToOpsRow) ?? []
  const turbineLogsLoading = sessionReady && turbineLogsQuery.isLoading
  // Figma 4436:220 — three elevated stats; empty → 0.00 / ≈ $0.00 (never —).
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
    <DappDetailPage>
      <section className="flex flex-col gap-4">
        <DappContentHeading className="pb-0" id="exchange-title">
          {t.exchange.turbine.dataTitle}
        </DappContentHeading>
        {/* Figma H5：三卡竖排 */}
        <OverviewGrid columns={3} stackOnDapp>
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
                <Text as="strong" className="m-0 text-base leading-5 font-semibold" variant="copy">
                  <CountValue text={`${metric.amount} gAGX`} />
                </Text>
              </div>
              <Tile.Note>
                <CountValue text={`≈ ${metric.usd || '0.00'}`} />
              </Tile.Note>
            </Tile>
          ))}
        </OverviewGrid>
      </section>

      <DappDetailBlock>
        {/* 关于标题用 headline leading token */}
        <DappContentHeading className="mb-0 pb-4 text-xl leading-(--type-headline-leading) tracking-tight">
          {t.exchange.turbine.aboutTitle}
        </DappContentHeading>
        {/* Figma 4435:220 about-carousel: gAGX · USD1 · X · gAGX质押 */}
        <TokenAboutCarousel cardKeys={['gagx', 'usd1', 'x', 'gagxStake']} />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.turbine.recordsTitle}</DappContentHeading>
        <Table>
          <Table.Body
            colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
            empty={t.exchange.turbine.recordsEmpty}
            headers={[...t.assets.opsColumns]}
            isLoading={turbineLogsLoading}
            rows={turbineLogRows}
          />
        </Table>
      </DappDetailBlock>

      <DappDetailBlock>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DappContentHeading className="pb-0">
              {t.exchange.turbine.mechanismTitle}
            </DappContentHeading>
            <Text as="p" variant="copy" className="m-0 text-foreground/40">
              {t.exchange.turbine.mechanismIntro}
            </Text>
          </div>
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
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.faq.title}</DappContentHeading>
        <FaqList defaultOpenFirst={false} items={t.exchange.turbine.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
