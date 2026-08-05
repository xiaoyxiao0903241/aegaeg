import { OverviewGrid } from '~/app/shell/overview-grid'
import { Tile } from '~/app/shell/tile'
import { useI18n } from '~/i18n/use-i18n'
import { CountValue } from '~/shared/components/count-value'
import { Detail } from '~/shared/components/detail'
import { FaqList } from '~/shared/components/faq-list'
import { Section } from '~/shared/components/section'
import { Text } from '~/shared/components/text'
import { TokenAboutCarousel } from '~/views/dapp/exchange/market-trade/exchange-token-about-carousel'

/** Figma About order: gAGX settle · USD1 · X · gAGX stake voucher (4th ≠ AGX). */
const FLASH_ABOUT_CARD_KEYS = ['gagx', 'usd1', 'x', 'gagxStake'] as const

/** Rate scalar only — amount draft keystrokes must not wake FAQ / About. */
export function FlashExchangeContent({ overviewRateLabel }: { overviewRateLabel: string }) {
  const { messages: t } = useI18n()

  const tiles = [
    { key: 'rate', label: t.exchange.exchangeRate, value: overviewRateLabel || '0' },
    { key: 'settlement', label: t.exchange.settlement, value: t.exchange.flash.settlementValue },
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

      <Section collapsible>
        <Section.Title>{t.exchange.flash.aboutTitle}</Section.Title>
        <TokenAboutCarousel cardKeys={FLASH_ABOUT_CARD_KEYS} />
      </Section>

      <Section>
        <Section.Title>{t.exchange.faq.title}</Section.Title>
        <FaqList items={t.exchange.flash.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
