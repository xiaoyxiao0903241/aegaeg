import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { MetricCard } from '~/app/components/dapp-card'
import { MetricCardSkeleton } from '~/app/components/dapp-skeleton'
import { MetricGrid } from '~/app/components/metric-grid'
import { FaqList } from '~/components/faq-list'
import { useDappShell } from '~/app/dapp-shell-context'
import { useFlashSwapWidget } from '~/hooks/use-flash-swap-widget'
import { TokenAboutCard } from '~/app/tabs/swap/token-about-card'
import {
  swapDetailBlockGapClass,
  swapDetailSectionTitleClass,
  swapMetricCardClass,
} from '~/app/tabs/swap/swap-layout-tokens'

export function FlashSwapContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const flash = useFlashSwapWidget(sessionReady)
  const usd1About = t.swap.tokenAbout.items.find((item) => item.key === 'usd1')!
  const showRateSkeleton = sessionReady && flash.isExchangePriceQuoting && !flash.overviewRateLabel

  return (
    <DappDetailPage>
      <section>
        <h2 className={swapDetailSectionTitleClass} id="swap-title">
          {t.swap.overview}
        </h2>
        <MetricGrid columns={2}>
          {showRateSkeleton ? (
            <MetricCardSkeleton className={swapMetricCardClass} />
          ) : (
            <MetricCard
              className={cn(sessionReady && '[&_small]:hidden', swapMetricCardClass)}
              label={t.swap.exchangeRate}
              value={sessionReady ? flash.overviewRateLabel || '—' : '--- : ---'}
            />
          )}
          <MetricCard
            className={cn(sessionReady && '[&_small]:hidden', swapMetricCardClass)}
            label={t.swap.settlement}
            value={t.swap.flash.settlementValue}
          />
        </MetricGrid>
      </section>

      <section className={swapDetailBlockGapClass}>
        <h2 className={swapDetailSectionTitleClass}>{t.swap.flash.tokenAboutTitle}</h2>
        <TokenAboutCard body={usd1About.body} title={usd1About.title} />
      </section>

      <section className={swapDetailBlockGapClass}>
        <h2 className={swapDetailSectionTitleClass}>{t.swap.faq.title}</h2>
        <FaqList defaultOpenFirst={false} items={t.swap.faq.tabs.usd1.items} variant="dapp" />
      </section>
    </DappDetailPage>
  )
}
