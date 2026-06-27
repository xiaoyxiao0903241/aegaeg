import { useState } from 'react'
import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { swapTokenKeys, type SwapTokenKey } from '~/app/data'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { DappPillTabs } from '~/app/components/dapp-pill-tabs'
import { MetricCard } from '~/app/components/dapp-card'
import { MetricCardSkeleton } from '~/app/components/dapp-skeleton'
import { MetricGrid } from '~/app/components/metric-grid'
import { FaqList } from '~/components/faq-list'
import { TokenAboutCarousel } from '~/app/components/swap-token-about-carousel'
import { useSwapDirectionStore } from '~/stores/swap-direction-store'
import { useDappShell } from '~/app/dapp-shell-context'
import { usePairSpotRate } from '~/hooks/use-pair-spot-rate'
import {
  swapDetailBlockGapClass,
  swapDetailSectionTitleClass,
  swapMetricCardClass,
} from '~/app/tabs/swap/swap-layout-tokens'

export function TradeSwapContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const swapDirection = useSwapDirectionStore((state) => state.direction)
  const { rateLabel: poolRateLabel, isLoading: poolRateLoading } = usePairSpotRate(
    sessionReady,
    swapDirection,
  )
  const [faqToken, setFaqToken] = useState<SwapTokenKey>('usd1')
  const faqItems = t.swap.faq.tabs[faqToken].items

  return (
    <DappDetailPage>
      <section>
        <h2 className={swapDetailSectionTitleClass} id="swap-title">
          {t.swap.overview}
        </h2>
        <MetricGrid columns={2}>
          {sessionReady && poolRateLoading && !poolRateLabel ? (
            <MetricCardSkeleton className={swapMetricCardClass} />
          ) : (
            <MetricCard
              className={cn(sessionReady && '[&_small]:hidden', swapMetricCardClass)}
              label={t.swap.exchangeRate}
              value={sessionReady ? poolRateLabel ?? '—' : '--- : ---'}
            />
          )}
          <MetricCard
            className={cn(sessionReady && '[&_small]:hidden', swapMetricCardClass)}
            label={t.swap.settlement}
            value={t.swap.settlementValue}
          />
        </MetricGrid>
      </section>

      <section className={swapDetailBlockGapClass}>
        <h2 className={swapDetailSectionTitleClass}>{t.swap.tokenAbout.title}</h2>
        <TokenAboutCarousel />
      </section>

      <section className={swapDetailBlockGapClass}>
        <h2 className={swapDetailSectionTitleClass}>{t.swap.faq.tabsTitle}</h2>
        <TradeSwapFaqTabs activeToken={faqToken} onSelect={setFaqToken} />
        <FaqList defaultOpenFirst={false} items={faqItems} key={faqToken} variant="dapp" />
      </section>
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
