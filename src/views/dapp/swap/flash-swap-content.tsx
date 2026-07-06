import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { MetricGrid } from '~/app/components/metric-grid'
import { FaqList } from '~/components/faq-list'
import { dappDetailSectionGapClass } from '~/app/dapp-detail-layout'
import { useFlashSwapWidgetContext } from '~/views/dapp/swap/flash-swap-widget-context'
import {
  SwapMetricCard,
  SwapMetricCardSkeleton,
} from '~/views/dapp/swap/swap-detail-primitives'
import { TokenAboutCard } from '~/views/dapp/swap/token-about-card'

export function FlashSwapContent() {
  const { messages: t } = useI18n()
  const flash = useFlashSwapWidgetContext()
  const usd1About = t.swap.tokenAbout.items.find((item) => item.key === 'usd1')!
  const showRateSkeleton = flash.isExchangePriceQuoting && !flash.overviewRateLabel

  return (
    <DappDetailPage>
      <section>
        <DappContentHeading id="swap-title">{t.swap.overview}</DappContentHeading>
        <MetricGrid columns={2}>
          {showRateSkeleton ? (
            <SwapMetricCardSkeleton />
          ) : (
            <SwapMetricCard label={t.swap.exchangeRate} value={flash.overviewRateLabel || '—'} />
          )}
          <SwapMetricCard label={t.swap.settlement} value={t.swap.flash.settlementValue} />
        </MetricGrid>
      </section>

      <section className={dappDetailSectionGapClass}>
        <DappContentHeading>{t.swap.flash.tokenAboutTitle}</DappContentHeading>
        <TokenAboutCard body={usd1About.body} title={usd1About.title} />
      </section>

      <section className={dappDetailSectionGapClass}>
        <DappContentHeading>{t.swap.faq.title}</DappContentHeading>
        <FaqList defaultOpenFirst={false} items={t.swap.faq.tabs.usd1.items} variant="dapp" />
      </section>
    </DappDetailPage>
  )
}
