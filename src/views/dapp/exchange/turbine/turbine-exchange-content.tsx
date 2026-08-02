import { tokenCarouselIcons } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { useDappShell } from '~/app/use-dapp-shell'
import { useTurbineLogs } from '~/hooks/use-api-data'
import { useI18n } from '~/i18n/use-i18n'
import { mapTurbineLogToOpsRow } from '~/shared/api/map-flow-log-rows'
import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
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
        <div className={cn('grid grid-cols-3 gap-4', 'max-dapp:grid-cols-1 max-dapp:gap-3')}>
          {overviewMetrics.map((metric) => (
            <Card
              key={metric.label}
              surface="elevated"
              // Figma `4436:223` stat：p16 · 三行；稿高 100（禁任意 px；用间距收 Δ）
              className="flex h-25 flex-col justify-between rounded-md border-0 p-4 shadow-card"
            >
              <Text as="p" variant="support" tone="muted-foreground" className="m-0 font-medium">
                {metric.label}
              </Text>
              <div className="flex items-center gap-2">
                <DappIcon
                  alt=""
                  className="size-(--app-icon-rail) shrink-0 rounded-full object-cover"
                  size="rail"
                  src={tokenCarouselIcons.gagxIcon}
                />
                <Text as="strong" variant="copy" className="m-0 text-base leading-5 font-semibold">
                  <DappCountValue text={`${metric.amount} gAGX`} />
                </Text>
              </div>
              <Text as="p" variant="support" className="m-0 text-black/40">
                <DappCountValue text={`≈ ${metric.usd || '0.00'}`} />
              </Text>
            </Card>
          ))}
        </div>
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
        <DappTableCard>
          <ResponsiveTable
            colWidths={['12.5rem', '9.375rem', '11.25rem', '1fr']}
            headers={[...t.assets.opsColumns]}
            isLoading={turbineLogsLoading}
            rows={turbineLogRows}
          />
          {!turbineLogsLoading && turbineLogRows.length === 0 ? (
            <DappTableEmptyMessage embedded title={t.exchange.turbine.recordsEmpty} />
          ) : null}
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DappContentHeading className="pb-0">
              {t.exchange.turbine.mechanismTitle}
            </DappContentHeading>
            <Text as="p" variant="copy" className="m-0 text-black/40">
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
