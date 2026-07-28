import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { MetricGrid } from '~/app/shell/metric-grid'
import { FaqList } from '~/shared/ui/faq-list'
import { Text } from '~/shared/ui/text'
import type { TurbineExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import {
  ExchangeMetricCard,
  ExchangeMetricCardSkeleton,
} from '~/views/dapp/exchange/exchange-detail-primitives'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'

export function TurbineExchangeContent({ turbine }: { turbine: TurbineExchangeState }) {
  const { messages: t } = useI18n()
  const showOverviewSkeleton = turbine.overview.isLoading

  return (
    <DappDetailPage>
      <section>
        <DappContentHeading id="exchange-title">{t.exchange.turbine.dataTitle}</DappContentHeading>
        <MetricGrid columns={2}>
          {showOverviewSkeleton ? (
            <>
              <ExchangeMetricCardSkeleton />
              <ExchangeMetricCardSkeleton />
              <ExchangeMetricCardSkeleton />
              <ExchangeMetricCardSkeleton />
            </>
          ) : (
            <>
              <ExchangeMetricCard
                label={t.exchange.turbine.metrics.pendingUnlock}
                value={`${turbine.overview.pendingUnlockLabel} gAGX`}
              />
              <ExchangeMetricCard
                label={t.exchange.turbine.metrics.cooling}
                value={`${turbine.overview.coolingLabel} gAGX`}
              />
              <ExchangeMetricCard
                label={t.exchange.turbine.metrics.claimable}
                value={`${turbine.overview.claimableLabel} gAGX`}
              />
              <ExchangeMetricCard
                label={t.exchange.turbine.cooldown}
                value={turbine.cooldownHoursLabel}
              />
            </>
          )}
        </MetricGrid>
      </section>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.turbine.aboutTitle}</DappContentHeading>
        <TokenAboutCarousel cardKeys={['gagx', 'agx', 'usd1', 'x']} />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.turbine.recordsTitle}</DappContentHeading>
        <DappTableCard>
          <ResponsiveTable
            colWidths={['210px', '120px', '160px', '1fr']}
            headers={t.exchange.turbine.recordColumns}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={t.exchange.turbine.recordsEmpty} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.turbine.mechanismTitle}</DappContentHeading>
        <div className="grid gap-3">
          {t.exchange.turbine.mechanism.map((item) => (
            <div key={item.title} className="rounded-lg border border-border px-3.5 py-3">
              <Text as="p" variant="detail" className="font-semibold">
                {item.title}
              </Text>
              <Text as="p" variant="copy" tone="muted-foreground" className="mt-1">
                {item.body}
              </Text>
            </div>
          ))}
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.faq.title}</DappContentHeading>
        <FaqList defaultOpenFirst={false} items={t.exchange.turbine.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
