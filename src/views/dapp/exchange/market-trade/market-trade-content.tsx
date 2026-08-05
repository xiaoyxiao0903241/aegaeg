/**
 * 市价交易详情页
 *
 * 概览区展示汇率与结算方式，下方为代币介绍轮播，
 * 以及按代币分组的 FAQ 标签页。
 */
import { type ExchangeTokenKey, exchangeTokenKeys } from '~/app/data'
import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'
import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { useI18n } from '~/i18n/use-i18n'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { FaqList } from '~/shared/components/faq-list'
import { Section } from '~/shared/components/section'
import { Text } from '~/shared/components/text'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'
import { useMarketTradeContentView } from '~/views/dapp/exchange/market-trade/use-market-trade-content-view'

// 代币介绍卡顺序与闪兑一致
const TRADE_ABOUT_CARD_KEYS = ['gagx', 'usd1', 'x', 'agx'] as const

/** 详情页只接收汇率标量，金额输入不触达 FAQ / 代币介绍。 */
export function MarketTradeContent({ exchangePriceLabel }: { exchangePriceLabel: string }) {
  const vm = useMarketTradeContentView(exchangePriceLabel)
  const { t } = vm

  const tiles = [
    { key: 'rate', label: t.exchange.exchangeRate, value: vm.poolRateLabel || '0' },
    { key: 'settlement', label: t.exchange.settlement, value: t.exchange.settlementValue },
  ]

  return (
    <Detail>
      <Section>
        <Section.Title id="exchange-title">{t.exchange.overview}</Section.Title>
        {/* jscpd:ignore-start — 右栏 Tile 页内组合（禁 *OverviewTiles） */}
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
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <Section.Title>{t.exchange.trade.aboutTitle}</Section.Title>
        <TokenAboutCarousel cardKeys={TRADE_ABOUT_CARD_KEYS} />
      </Section>

      <Section>
        <Section.Title>{t.exchange.faq.tabsTitle}</Section.Title>
        <MarketTradeFaqTabs activeToken={vm.faqToken} onSelect={vm.setFaqToken} />
        <FaqList defaultOpenFirst={false} items={vm.faqItems} key={vm.faqToken} variant="dapp" />
      </Section>
    </Detail>
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
      className="flex flex-wrap gap-2"
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
