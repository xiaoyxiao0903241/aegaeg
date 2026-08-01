import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappIcon } from '~/app/shell/dapp-icon'
import { MetricGrid } from '~/app/shell/metric-grid'
import { FaqList } from '~/shared/ui/faq-list'
import type { FlashExchangeState } from '~/views/dapp/exchange/exchange-session-hosts'
import { ExchangeMetricCard } from '~/views/dapp/exchange/exchange-detail-primitives'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'

/** Figma flash right `4430:310`: overview/FAQ 18 · About 20. */
const flashSectionTitleClass = 'text-[1.125rem] leading-normal tracking-normal'
const flashAboutTitleClass = 'text-[1.25rem] leading-normal tracking-normal'

/** Figma About order: gAGX settle · USD1 · X · gAGX stake voucher (4th ≠ AGX). */
const FLASH_ABOUT_CARD_KEYS = ['gagx', 'usd1', 'x', 'gagxStake'] as const

export function FlashExchangeContent({ flash }: { flash: FlashExchangeState }) {
  const { messages: t } = useI18n()

  return (
    <DappDetailPage>
      <section>
        <DappContentHeading className={flashSectionTitleClass} id="exchange-title">
          {t.exchange.overview}
        </DappContentHeading>
        <MetricGrid columns={2}>
          <ExchangeMetricCard
            className="gap-1.5 p-4"
            label={t.exchange.exchangeRate}
            value={flash.overviewRateLabel || '0'}
            valueClassName="text-base leading-[1.25] tracking-[-0.02em]"
          />
          <ExchangeMetricCard
            className="gap-1.5 p-4"
            label={t.exchange.settlement}
            value={t.exchange.flash.settlementValue}
            valueClassName="text-base leading-[1.25] tracking-[-0.02em]"
          />
        </MetricGrid>
      </section>

      <DappDetailBlock>
        <div className="mb-4 flex items-center justify-between gap-3">
          <DappContentHeading className={`mb-0 pb-0 ${flashAboutTitleClass}`}>
            {t.exchange.flash.aboutTitle}
          </DappContentHeading>
          {/* Figma `4477:412` chevron chrome; no collapse IA → decorative only (R5a). */}
          <DappIcon
            alt=""
            aria-hidden
            className="size-4 opacity-40"
            size="base"
            src={dappAssets.chevron}
          />
        </div>
        <TokenAboutCarousel cardKeys={FLASH_ABOUT_CARD_KEYS} />
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
