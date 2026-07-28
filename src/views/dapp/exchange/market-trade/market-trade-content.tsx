import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { exchangeTokenKeys, type ExchangeTokenKey } from '~/app/data'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'
import { MetricGrid } from '~/app/shell/metric-grid'
import { FaqList } from '~/shared/ui/faq-list'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'
import { useExchangeDirectionStore } from '~/stores/exchange-direction-store'
import type { MarketTradeState } from '~/views/dapp/exchange/exchange-session-hosts'
import {
  ExchangeMetricCard,
  ExchangeMetricCardSkeleton,
} from '~/views/dapp/exchange/exchange-detail-primitives'

export function MarketTradeContent({ trade }: { trade: MarketTradeState }) {
  const { messages: t } = useI18n()
  const exchangeDirection = useExchangeDirectionStore((state) => state.direction)
  const poolRateLabel =
    exchangeDirection === 'reverse' ? trade.exchangePriceLabel : trade.exchangePriceLabelInverted
  const poolRateLoading =
    exchangeDirection === 'reverse'
      ? trade.isExchangePriceQuoting
      : trade.isExchangePriceInvertedQuoting
  const [faqToken, setFaqToken] = useState<ExchangeTokenKey>('usd1')
  const faqItems = t.exchange.faq.tabs[faqToken].items

  return (
    <DappDetailPage>
      <section>
        <DappContentHeading id="exchange-title">{t.exchange.overview}</DappContentHeading>
        <MetricGrid columns={2}>
          {poolRateLoading && !poolRateLabel ? (
            <ExchangeMetricCardSkeleton />
          ) : (
            <ExchangeMetricCard label={t.exchange.exchangeRate} value={poolRateLabel ?? '—'} />
          )}
          <ExchangeMetricCard label={t.exchange.settlement} value={t.exchange.settlementValue} />
        </MetricGrid>
      </section>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.tokenAbout.title}</DappContentHeading>
        <TokenAboutCarousel />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.faq.tabsTitle}</DappContentHeading>
        <MarketTradeFaqTabs activeToken={faqToken} onSelect={setFaqToken} />
        <FaqList defaultOpenFirst={false} items={faqItems} key={faqToken} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}

function MarketTradeFaqTabs({
  activeToken,
  onSelect,
}: {
  activeToken: ExchangeTokenKey
  onSelect: (token: ExchangeTokenKey) => void
}) {
  const { messages: t } = useI18n()
  const labels: Record<ExchangeTokenKey, string> = {
    usd1: t.exchange.faq.tabs.usd1.label,
    agx: t.exchange.faq.tabs.agx.label,
    x: t.exchange.faq.tabs.x.label,
  }

  return (
    <DappPillTabs
      ariaLabel={t.exchange.faq.tabsTitle}
      className="mb-3 flex flex-wrap gap-2"
      items={exchangeTokenKeys.map((key) => ({
        active: key === activeToken,
        label: labels[key],
      }))}
      onSelect={(index) => {
        const key = exchangeTokenKeys[index]
        if (key) onSelect(key)
      }}
    />
  )
}
