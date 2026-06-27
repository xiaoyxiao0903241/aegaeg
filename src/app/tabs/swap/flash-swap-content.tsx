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
import { dappDetailSectionGapClass, dappDetailTitleGapClass } from '~/app/dapp-detail-layout'

export function FlashSwapContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const flash = useFlashSwapWidget(sessionReady)
  const usd1About = t.swap.tokenAbout.items.find((item) => item.key === 'usd1')!
  const showRateSkeleton = sessionReady && flash.isExchangePriceQuoting && !flash.overviewRateLabel

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
          {showRateSkeleton ? (
            <MetricCardSkeleton className="gap-1.5 rounded-2xl px-4 py-3.5 shadow-card [&_small]:text-xs [&_small]:leading-[1.5] [&_small]:tracking-[-0.24px] [&_strong]:text-lg [&_strong]:font-semibold [&_strong]:leading-[1.3] [&_strong]:tracking-[-0.54px] max-dapp:min-w-0 max-dapp:rounded-md max-dapp:p-3.5 max-dapp:[&_small]:hidden max-dapp:[&_strong]:text-xs max-dapp:[&_strong]:leading-[1.2] max-dapp:[&_strong]:tracking-[-0.24px]" />
          ) : (
            <MetricCard
              className={cn(
                sessionReady && '[&_small]:hidden',
                'gap-1.5 rounded-2xl px-4 py-3.5 shadow-card [&_small]:text-xs [&_small]:leading-[1.5] [&_small]:tracking-[-0.24px] [&_strong]:text-lg [&_strong]:font-semibold [&_strong]:leading-[1.3] [&_strong]:tracking-[-0.54px] max-dapp:min-w-0 max-dapp:rounded-md max-dapp:p-3.5 max-dapp:[&_small]:hidden max-dapp:[&_strong]:text-xs max-dapp:[&_strong]:leading-[1.2] max-dapp:[&_strong]:tracking-[-0.24px]',
              )}
              label={t.swap.exchangeRate}
              value={sessionReady ? flash.overviewRateLabel || '—' : '--- : ---'}
            />
          )}
          <MetricCard
            className={cn(
              sessionReady && '[&_small]:hidden',
              'gap-1.5 rounded-2xl px-4 py-3.5 shadow-card [&_small]:text-xs [&_small]:leading-[1.5] [&_small]:tracking-[-0.24px] [&_strong]:text-lg [&_strong]:font-semibold [&_strong]:leading-[1.3] [&_strong]:tracking-[-0.54px] max-dapp:min-w-0 max-dapp:rounded-md max-dapp:p-3.5 max-dapp:[&_small]:hidden max-dapp:[&_strong]:text-xs max-dapp:[&_strong]:leading-[1.2] max-dapp:[&_strong]:tracking-[-0.24px]',
            )}
            label={t.swap.settlement}
            value={t.swap.flash.settlementValue}
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
          {t.swap.flash.tokenAboutTitle}
        </h2>
        <TokenAboutCard body={usd1About.body} title={usd1About.title} />
      </section>

      <section className={dappDetailSectionGapClass}>
        <h2
          className={cn(
            'm-0 text-lg font-semibold leading-[1.3] tracking-[-0.04em] text-foreground',
            'max-dapp:text-base max-dapp:tracking-[-0.04em]',
            dappDetailTitleGapClass,
          )}
        >
          {t.swap.faq.title}
        </h2>
        <FaqList defaultOpenFirst={false} items={t.swap.faq.tabs.usd1.items} variant="dapp" />
      </section>
    </DappDetailPage>
  )
}
