import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { swapTokenKeys, type SwapTokenKey } from '~/app/data'
import { DappContentHeading } from '~/app/shell/components/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/components/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/components/dapp-detail-page'
import { DappPillTabs } from '~/app/shell/components/dapp-pill-tabs'
import { MetricGrid } from '~/app/shell/components/metric-grid'
import { FaqList } from '~/shared/ui/faq-list'
import { TokenAboutCarousel } from '~/views/dapp/swap/swap-token-about-carousel'
import { useSwapDirectionStore } from '~/stores/swap-direction-store'
import { useTradeSwapWidgetContext } from '~/views/dapp/swap/trade-swap-widget-context'
import {
  SwapMetricCard,
  SwapMetricCardSkeleton,
} from '~/views/dapp/swap/swap-detail-primitives'

export function TradeSwapContent() {
  const { messages: t } = useI18n()
  const swapDirection = useSwapDirectionStore((state) => state.direction)
  const trade = useTradeSwapWidgetContext()
  const poolRateLabel =
    swapDirection === 'reverse'
      ? trade.exchangePriceLabel
      : trade.exchangePriceLabelInverted
  const poolRateLoading =
    swapDirection === 'reverse'
      ? trade.isExchangePriceQuoting
      : trade.isExchangePriceInvertedQuoting
  const [faqToken, setFaqToken] = useState<SwapTokenKey>('usd1')
  const faqItems = t.swap.faq.tabs[faqToken].items

  return (
    <DappDetailPage>
      <section>
        <DappContentHeading id="swap-title">{t.swap.overview}</DappContentHeading>
        <MetricGrid columns={2}>
          {poolRateLoading && !poolRateLabel ? (
            <SwapMetricCardSkeleton />
          ) : (
            <SwapMetricCard label={t.swap.exchangeRate} value={poolRateLabel ?? '—'} />
          )}
          <SwapMetricCard label={t.swap.settlement} value={t.swap.settlementValue} />
        </MetricGrid>
      </section>

      <DappDetailBlock>
        <DappContentHeading>{t.swap.tokenAbout.title}</DappContentHeading>
        <TokenAboutCarousel />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.swap.faq.tabsTitle}</DappContentHeading>
        <TradeSwapFaqTabs activeToken={faqToken} onSelect={setFaqToken} />
        <FaqList defaultOpenFirst={false} items={faqItems} key={faqToken} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}

function TradeSwapFaqTabs({
  activeToken,
  onSelect,
}: {
  activeToken: SwapTokenKey
  onSelect: (token: SwapTokenKey) => void
}) {
  const { messages: t } = useI18n()
  const labels: Record<SwapTokenKey, string> = {
    usd1: t.swap.faq.tabs.usd1.label,
    agx: t.swap.faq.tabs.agx.label,
    x: t.swap.faq.tabs.x.label,
  }

  return (
    <DappPillTabs
      ariaLabel={t.swap.faq.tabsTitle}
      className="mb-3 flex flex-wrap gap-2"
      items={swapTokenKeys.map((key) => ({
        active: key === activeToken,
        label: labels[key],
      }))}
      onSelect={(index) => onSelect(swapTokenKeys[index])}
    />
  )
}
