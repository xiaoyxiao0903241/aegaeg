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
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'

/** Figma flash right `4430:310`: overview/FAQ 18 · About 20. */
const flashSectionTitleClass = 'text-[1.125rem] leading-normal tracking-normal'
const flashAboutTitleClass = 'text-[1.25rem] leading-normal tracking-normal'

export function FlashExchangeContent({ flash }: { flash: FlashExchangeState }) {
  const { messages: t } = useI18n()
  const showRateSkeleton = flash.isExchangePriceQuoting && !flash.overviewRateLabel

  return (
    <DappDetailPage>
      <section>
        <DappContentHeading className={flashSectionTitleClass} id="exchange-title">
          {t.exchange.overview}
        </DappContentHeading>
        <MetricGrid columns={2}>
          {showRateSkeleton ? (
            <ExchangeMetricCardSkeleton className="gap-1.5 p-4" />
          ) : (
            <ExchangeMetricCard
              className="gap-1.5 p-4"
              label={t.exchange.exchangeRate}
              value={flash.overviewRateLabel || '—'}
              valueClassName="text-base leading-[1.25] tracking-[-0.02em]"
            />
          )}
          <ExchangeMetricCard
            className="gap-1.5 p-4"
            label={t.exchange.settlement}
            value={t.exchange.flash.settlementValue}
            valueClassName="text-base leading-[1.25] tracking-[-0.02em]"
          />
        </MetricGrid>
      </section>

      <DappDetailBlock>
        <DappContentHeading className={flashAboutTitleClass}>
          {t.exchange.flash.aboutTitle}
        </DappContentHeading>
        <TokenAboutCarousel cardKeys={['gagx', 'usd1', 'x', 'agx']} />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading className={flashSectionTitleClass}>
          {t.exchange.faq.title}
        </DappContentHeading>
        <FaqList items={t.exchange.flash.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
