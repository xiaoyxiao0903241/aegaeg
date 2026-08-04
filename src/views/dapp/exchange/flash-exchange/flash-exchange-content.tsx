import { dappAssets } from '~/app/assets'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { MetricGrid } from '~/app/shell/metric-grid'
import { useI18n } from '~/i18n/use-i18n'
import { FaqList } from '~/shared/components/faq-list'
import { Icon } from '~/shared/components/icon'
import { ExchangeMetricCard } from '~/views/dapp/exchange/exchange-detail-primitives'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'

/** Figma About order: gAGX settle · USD1 · X · gAGX stake voucher (4th ≠ AGX). */
const FLASH_ABOUT_CARD_KEYS = ['gagx', 'usd1', 'x', 'gagxStake'] as const

/** Rate scalar only — amount draft keystrokes must not wake FAQ / About. */
export function FlashExchangeContent({ overviewRateLabel }: { overviewRateLabel: string }) {
  const { messages: t } = useI18n()

  return (
    <DappDetailPage>
      <section>
        <DappContentHeading id="exchange-title">{t.exchange.overview}</DappContentHeading>
        <MetricGrid columns={2}>
          <ExchangeMetricCard label={t.exchange.exchangeRate} value={overviewRateLabel || '0'} />
          <ExchangeMetricCard
            label={t.exchange.settlement}
            value={t.exchange.flash.settlementValue}
          />
        </MetricGrid>
      </section>

      <DappDetailBlock>
        <div className="mb-4 flex items-center justify-between gap-3">
          {/* Figma `4477:411` 关于 = 20 / leading 1.2；用 text-xl + headline leading token（禁 leading-[1.2]） */}
          <DappContentHeading className="mb-0 pb-0 text-xl leading-(--type-headline-leading) tracking-tight">
            {t.exchange.flash.aboutTitle}
          </DappContentHeading>
          {/* Figma `4477:412` chevron chrome; no collapse IA → decorative only (R5a). */}
          <Icon alt="" aria-hidden className="opacity-40" size="base" src={dappAssets.chevron} />
        </div>
        <TokenAboutCarousel cardKeys={FLASH_ABOUT_CARD_KEYS} />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.faq.title}</DappContentHeading>
        <FaqList items={t.exchange.flash.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
