import { type ExchangeTokenKey, exchangeTokenKeys } from '~/app/data'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { useI18n } from '~/i18n/use-i18n'
import { CountValue } from '~/shared/components/count-value'
import { FaqList } from '~/shared/components/faq-list'
import { Text } from '~/shared/components/text'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'
import { useMarketTradeContentView } from '~/views/dapp/exchange/market-trade/use-market-trade-content-view'

/** Figma PC `4433:220` about carousel order — same as flash. */
const TRADE_ABOUT_CARD_KEYS = ['gagx', 'usd1', 'x', 'agx'] as const

/** Rate scalars only — amount draft keystrokes must not wake FAQ / About. */
export function MarketTradeContent({ exchangePriceLabel }: { exchangePriceLabel: string }) {
  const vm = useMarketTradeContentView(exchangePriceLabel)
  const { t } = vm

  const tiles = [
    { key: 'rate', label: t.exchange.exchangeRate, value: vm.poolRateLabel || '0' },
    { key: 'settlement', label: t.exchange.settlement, value: t.exchange.settlementValue },
  ]

  return (
    <DappDetailPage>
      <section>
        <DappContentHeading id="exchange-title">{t.exchange.overview}</DappContentHeading>
        <OverviewGrid columns={2}>
          {tiles.map((tile) => (
            <Tile key={tile.key}>
              <Tile.Label>{tile.label}</Tile.Label>
              <Text
                as="strong"
                className="text-base/5 font-semibold tracking-normal"
                variant="headline"
              >
                <CountValue text={tile.value} />
              </Text>
            </Tile>
          ))}
        </OverviewGrid>
      </section>

      <DappDetailBlock>
        {/* Figma about 标题 20 / leading 1.2（`4489:222`）；text-xl + headline leading token（禁 leading-[1.2]） */}
        <DappContentHeading className="mb-0 pb-4 text-xl leading-(--type-headline-leading) tracking-tight">
          {t.exchange.trade.aboutTitle}
        </DappContentHeading>
        <TokenAboutCarousel cardKeys={TRADE_ABOUT_CARD_KEYS} />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.faq.tabsTitle}</DappContentHeading>
        <MarketTradeFaqTabs activeToken={vm.faqToken} onSelect={vm.setFaqToken} />
        <FaqList defaultOpenFirst={false} items={vm.faqItems} key={vm.faqToken} variant="dapp" />
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
    trade: t.exchange.faq.tabs.trade.label,
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
