import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { FaqList } from '~/shared/ui/faq-list'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import type { TurbineExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { ExchangeMetricCardSkeleton } from '~/views/dapp/exchange/exchange-detail-primitives'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { DappIcon } from '~/app/shell/dapp-icon'
import { dappAssets } from '~/app/assets'
import { cn } from '~/shared/lib/utils'

export function TurbineExchangeContent({ turbine }: { turbine: TurbineExchangeState }) {
  const { messages: t } = useI18n()
  const showOverviewSkeleton = turbine.overview.isLoading
  // Figma 4436:220 — three elevated stats; empty → 0.00 / ≈ $0.00 (never —).
  const overviewMetrics = [
    {
      label: t.exchange.turbine.metrics.pendingUnlock,
      amount: turbine.overview.pendingUnlockLabel,
      usd: turbine.overview.pendingUnlockUsdHint,
    },
    {
      label: t.exchange.turbine.metrics.cooling,
      amount: turbine.overview.coolingLabel,
      usd: turbine.overview.coolingUsdHint,
    },
    {
      label: t.exchange.turbine.metrics.totalWithdrawn,
      amount: turbine.overview.totalWithdrawnLabel,
      usd: turbine.overview.totalWithdrawnUsdHint,
    },
  ] as const

  return (
    <DappDetailPage>
      <section className="flex flex-col gap-4">
        <DappContentHeading className="pb-0" id="exchange-title">
          {t.exchange.turbine.dataTitle}
        </DappContentHeading>
        <div className={cn('grid grid-cols-3 gap-4', 'max-dapp:grid-cols-1 max-dapp:gap-3')}>
          {showOverviewSkeleton ? (
            <>
              <ExchangeMetricCardSkeleton className="gap-2 rounded-2xl p-4" />
              <ExchangeMetricCardSkeleton className="gap-2 rounded-2xl p-4" />
              <ExchangeMetricCardSkeleton className="gap-2 rounded-2xl p-4" />
            </>
          ) : (
            overviewMetrics.map((metric) => (
              <Card
                key={metric.label}
                surface="elevated"
                className="flex flex-col gap-2 rounded-2xl border-0 p-4 shadow-card"
              >
                <Text as="p" variant="support" tone="muted-foreground" className="m-0 font-medium">
                  {metric.label}
                </Text>
                <div className="flex items-center gap-2">
                  <DappIcon
                    alt=""
                    className="size-[22px] shrink-0 rounded-full object-cover"
                    size="token"
                    src={dappAssets.tokenGagx}
                  />
                  <Text as="strong" variant="copy" className="m-0 text-base font-semibold">
                    {metric.amount} gAGX
                  </Text>
                </div>
                {metric.usd ? (
                  <Text as="p" variant="support" className="m-0 text-black/40">
                    ≈ {metric.usd}
                  </Text>
                ) : null}
              </Card>
            ))
          )}
        </div>
      </section>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.turbine.aboutTitle}</DappContentHeading>
        {/* Figma 4435:220 about-carousel: gAGX · USD1 · X · gAGX质押 */}
        <TokenAboutCarousel cardKeys={['gagx', 'usd1', 'x', 'gagxStake']} />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.turbine.recordsTitle}</DappContentHeading>
        <DappTableCard>
          {/* Indexer DEFER: empty only (no header row) until history feed exists. */}
          <DappTableEmptyMessage embedded title={t.exchange.turbine.recordsEmpty} />
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
                <Text as="p" variant="copy" tone="muted-foreground" className="m-0">
                  {item.body}
                </Text>
              </Card>
            ))}
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.faq.title}</DappContentHeading>
        <FaqList items={t.exchange.turbine.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
