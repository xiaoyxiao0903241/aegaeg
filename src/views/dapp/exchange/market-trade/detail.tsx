/**
 * 市价交易详情页
 *
 * 概览区展示汇率与结算方式，下方为代币介绍轮播，
 * 以及按代币分组的 FAQ 标签页。
 */
import { Grid } from '~/app/shell/grid'
import { Tile } from '~/app/shell/tile'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Section } from '~/shared/components/section'
import { Text } from '~/shared/components/text'
import {
  MarketTradeFaqTabs,
  TokenAboutCarousel,
} from '~/views/dapp/exchange/market-trade/primitives'
import { useMarketTradeDetail } from '~/views/dapp/exchange/market-trade/use-market-trade'

// 代币介绍卡顺序与闪兑一致
const TRADE_ABOUT_CARD_KEYS = ['gagx', 'usd1', 'x', 'agx'] as const

/** 详情页只接收汇率标量，金额输入不触达 FAQ / 代币介绍。 */
export function MarketTradeDetail({ exchangePriceLabel }: { exchangePriceLabel: string }) {
  const vm = useMarketTradeDetail(exchangePriceLabel)
  const { t } = vm

  const tiles = [
    { key: 'rate', label: t.exchange.exchangeRate, value: vm.poolRateLabel || '0' },
    { key: 'settlement', label: t.exchange.settlement, value: t.exchange.settlementValue },
  ]

  return (
    <Detail>
      <Section>
        <Section.Title id="exchange-title">{t.exchange.overview}</Section.Title>
        {/* jscpd:ignore-start — 右栏 Tile 页内组合 */}
        <Grid columns={2}>
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
        </Grid>
        {/* jscpd:ignore-end */}
      </Section>

      <Section>
        <Section.Title>{t.exchange.trade.aboutTitle}</Section.Title>
        <TokenAboutCarousel cardKeys={TRADE_ABOUT_CARD_KEYS} />
      </Section>

      <Section>
        <Section.Title>{t.exchange.faq.tabsTitle}</Section.Title>
        <MarketTradeFaqTabs activeToken={vm.faqToken} onSelect={vm.setFaqToken} />
        <Faq defaultOpenFirst={false} items={vm.faqItems} key={vm.faqToken} variant="dapp" />
      </Section>
    </Detail>
  )
}
