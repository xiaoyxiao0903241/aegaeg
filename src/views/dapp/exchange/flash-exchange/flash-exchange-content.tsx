import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { MetricGrid } from '~/app/shell/metric-grid'
import { FaqList } from '~/shared/ui/faq-list'
import type { FlashExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import {
  ExchangeMetricCard,
  ExchangeMetricCardSkeleton,
} from '~/views/dapp/exchange/exchange-detail-primitives'
import { TokenAboutCard } from '~/views/dapp/exchange/flash-exchange/exchange-token-about-card'

export function FlashExchangeContent({ flash }: { flash: FlashExchangeState }) {
  const { messages: t } = useI18n()
  const usd1About = t.exchange.tokenAbout.items.find((item) => item.key === 'usd1')!
  const showRateSkeleton = flash.isExchangePriceQuoting && !flash.overviewRateLabel

  return (
    <DappDetailPage>
      <section>
        <DappContentHeading id="exchange-title">{t.exchange.overview}</DappContentHeading>
        <MetricGrid columns={2}>
          {showRateSkeleton ? (
            <ExchangeMetricCardSkeleton />
          ) : (
            <ExchangeMetricCard
              label={t.exchange.exchangeRate}
              value={flash.overviewRateLabel || '—'}
            />
          )}
          <ExchangeMetricCard
            label={t.exchange.settlement}
            value={t.exchange.flash.settlementValue}
          />
        </MetricGrid>
      </section>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.flash.tokenAboutTitle}</DappContentHeading>
        <TokenAboutCard body={usd1About.body} title={usd1About.title} />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.faq.title}</DappContentHeading>
        <FaqList defaultOpenFirst={false} items={t.exchange.faq.tabs.usd1.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
