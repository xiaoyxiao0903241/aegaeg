/**
 * 闪电兑换详情页
 *
 * 展示汇率与结算方式两张概览卡，下方为代币介绍轮播与 FAQ；
 * 详情页只读，不承载金额输入。
 */
import { useI18n } from '~/i18n/use-i18n'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { Text } from '~/shared/components/text'
import { Tile } from '~/shared/components/tile'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/primitives'

// 代币介绍卡顺序：gAGX 结算 · USD1 · X · gAGX 质押凭证（第 4 张是 gAGX 质押，不是 AGX）
const FLASH_ABOUT_CARD_KEYS = ['gagx', 'usd1', 'x', 'gagxStake'] as const

/** 详情页只接收汇率标量，金额输入不触达 FAQ / 代币介绍，避免每敲一键都刷新。 */
export function FlashExchangeDetail({ overviewRateLabel }: { overviewRateLabel: string }) {
  const { messages: t } = useI18n()

  const tiles = [
    { key: 'rate', label: t.exchange.exchangeRate, value: overviewRateLabel || '0' },
    { key: 'settlement', label: t.exchange.settlement, value: t.exchange.flash.settlementValue },
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

      <Section collapsible>
        <Section.Title>{t.exchange.flash.aboutTitle}</Section.Title>
        <TokenAboutCarousel cardKeys={FLASH_ABOUT_CARD_KEYS} />
      </Section>

      <Section>
        <Section.Title>{t.exchange.faq.title}</Section.Title>
        <Faq items={t.exchange.flash.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
