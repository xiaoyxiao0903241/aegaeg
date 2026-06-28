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
import { dappDetailSectionGapClass, dappDetailTitleGapClass } from '~/app/dapp-detail-layout'

export function TradeSwapContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const swapDirection = useSwapDirectionStore((state) => state.direction)
  const { rateLabel: poolRateLabel, isLoading: poolRateLoading } = usePairSpotRate(
    true,
    swapDirection,
  )
  const [faqToken, setFaqToken] = useState<SwapTokenKey>('usd1')
  const faqItems = t.swap.faq.tabs[faqToken].items

  return (
    <DappDetailPage>
      <section>
        <h2
          className={cn(
            'm-0 text-lg font-semibold leading-[1.3] tracking-[-0.04em] text-foreground',
            'max-dapp:text-base max-dapp:tracking-[-0.04em]',
            dappDetailTitleGapClass,
          )}
          id="swap-title"
        >
          {t.swap.overview}
        </h2>
        <MetricGrid columns={2}>
          {poolRateLoading && !poolRateLabel ? (
            <MetricCardSkeleton className="gap-1.5 rounded-md px-4 py-3.5 shadow-card [&_small]:text-xs [&_small]:leading-[1.5] [&_small]:tracking-[-0.24px] [&_strong]:text-lg [&_strong]:font-semibold [&_strong]:leading-[1.3] [&_strong]:tracking-[-0.54px] max-dapp:min-w-0 max-dapp:p-3.5 max-dapp:[&_small]:hidden max-dapp:[&_strong]:text-xs max-dapp:[&_strong]:leading-[1.2] max-dapp:[&_strong]:tracking-[-0.24px]" />
          ) : (
            <MetricCard
              className={cn(
                sessionReady && '[&_small]:hidden',
                'gap-1.5 rounded-md px-4 py-3.5 shadow-card [&_small]:text-xs [&_small]:leading-[1.5] [&_small]:tracking-[-0.24px] [&_strong]:text-lg [&_strong]:font-semibold [&_strong]:leading-[1.3] [&_strong]:tracking-[-0.54px] max-dapp:min-w-0 max-dapp:p-3.5 max-dapp:[&_small]:hidden max-dapp:[&_strong]:text-xs max-dapp:[&_strong]:leading-[1.2] max-dapp:[&_strong]:tracking-[-0.24px]',
              )}
              label={t.swap.exchangeRate}
              value={poolRateLabel ?? '—'}
            />
          )}
          <MetricCard
            className={cn(
              sessionReady && '[&_small]:hidden',
              'gap-1.5 rounded-md px-4 py-3.5 shadow-card [&_small]:text-xs [&_small]:leading-[1.5] [&_small]:tracking-[-0.24px] [&_strong]:text-lg [&_strong]:font-semibold [&_strong]:leading-[1.3] [&_strong]:tracking-[-0.54px] max-dapp:min-w-0 max-dapp:p-3.5 max-dapp:[&_small]:hidden max-dapp:[&_strong]:text-xs max-dapp:[&_strong]:leading-[1.2] max-dapp:[&_strong]:tracking-[-0.24px]',
            )}
            label={t.swap.settlement}
            value={t.swap.settlementValue}
          />
        </MetricGrid>
      </section>

      <section className={dappDetailSectionGapClass}>
        <h2
          className={cn(
            'm-0 text-lg font-semibold leading-[1.3] tracking-[-0.04em] text-foreground',
            'max-dapp:text-base max-dapp:tracking-[-0.04em]',
            dappDetailTitleGapClass,
          )}
        >
          {t.swap.tokenAbout.title}
        </h2>
        <TokenAboutCarousel />
      </section>

      <section className={dappDetailSectionGapClass}>
        <h2
          className={cn(
            'm-0 text-lg font-semibold leading-[1.3] tracking-[-0.04em] text-foreground',
            'max-dapp:text-base max-dapp:tracking-[-0.04em]',
            dappDetailTitleGapClass,
          )}
        >
          {t.swap.faq.tabsTitle}
        </h2>
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
