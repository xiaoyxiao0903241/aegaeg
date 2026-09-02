/**
 * 兑换总览详情页
 *
 * 上部为兑换模式入口卡片（闪兑 / 市价交易 / 销毁 / Turbine），
 * 点击跳转到对应模式；下部为常见问题折叠列表。
 */
import { formatBurnContributionRatioColon } from '~/core/exchange/burn-contribution-swap'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { exchangeHubAssets } from '~/shared/assets/dapp'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import type { ExchangeView } from '~/shared/config/dapp-deep-links'
import { useExchangeFlashPairStore } from '~/stores/exchange-flash-pair-store'
import { useExchangeTradePairStore } from '~/stores/exchange-trade-pair-store'
import { ExchangeProgramCard } from '~/views/dapp/exchange/hub/primitives'
import { openExchangeView } from '~/views/dapp/shared/navigation'
import { useBurnSwapConfigQuery } from '~/web3/exchange/use-burn-swap-config'

/**
 * 程序卡片点击目标：0 Trade gAGX → 闪兑 · 1 Turbine → 涡轮
 * 2 Get USD1 → 闪兑 · 3 Get AGX → 市价（预选 USD1→AGX）
 * 4 Sell X → 市价（预选 X→AGX） · 5 Points → 销毁
 */
const PROGRAM_TARGETS: Array<ExchangeView | null> = [
  'flash',
  'turbine',
  'flash',
  'trade',
  'trade',
  'burn',
]

/** 「交易 gAGX」/「获取 USD1」预选闪兑对；「获取 AGX」/「出售 X」预选市价对。 */
const TRADE_GAGX_CARD_INDEX = 0
const GET_USD1_CARD_INDEX = 2
const GET_AGX_CARD_INDEX = 3
const SELL_X_CARD_INDEX = 4

/** 与 i18n 卡片一一对应；undefined 表示纯文字卡片。 */
const PROGRAM_ICONS: Array<readonly [string] | readonly [string, string] | undefined> = [
  [exchangeHubAssets.programGagx, exchangeHubAssets.programAgx],
  [exchangeHubAssets.programUsd1, exchangeHubAssets.programGagx],
  [exchangeHubAssets.programUsdt, exchangeHubAssets.programUsd1],
  [exchangeHubAssets.programAgx],
  [exchangeHubAssets.programX],
  undefined,
]

/** 「获取贡献点数」卡片索引：比例取自链上 rateBps，非静态 1:6。 */
const CONTRIBUTION_CARD_INDEX = 5

export function ExchangeHubDetail() {
  const { messages: t } = useI18n()
  const cards = t.exchange.hub.program.cards

  const configQuery = useBurnSwapConfigQuery({ enabled: true })

  const contributionRatio =
    configQuery.data === undefined
      ? '—'
      : formatBurnContributionRatioColon(configQuery.data.rateBps)

  return (
    <Detail>
      <Section>
        <Section.Title>{t.exchange.hub.program.title}</Section.Title>
        <Grid columns={2} stackOnDapp>
          {cards.map((card, index) => {
            const target = PROGRAM_TARGETS[index] ?? null
            const body =
              index === CONTRIBUTION_CARD_INDEX
                ? interpolate(card.body, { ratio: contributionRatio })
                : card.body

            return (
              <ExchangeProgramCard
                body={body}
                icon={PROGRAM_ICONS[index]}
                key={`${card.title}:${index}`}
                onClick={
                  target
                    ? () => {
                        if (index === GET_USD1_CARD_INDEX) {
                          useExchangeFlashPairStore.getState().setPairId('usdt')
                        } else if (index === TRADE_GAGX_CARD_INDEX) {
                          useExchangeFlashPairStore.getState().setPairId('gagx')
                        } else if (index === GET_AGX_CARD_INDEX) {
                          useExchangeTradePairStore.getState().setSellKey('usd1')
                        } else if (index === SELL_X_CARD_INDEX) {
                          useExchangeTradePairStore.getState().setSellKey('x')
                        }
                        openExchangeView(target)
                      }
                    : undefined
                }
                title={card.title}
              />
            )
          })}
        </Grid>
      </Section>

      <Section>
        <Section.Title>{t.exchange.faq.title}</Section.Title>
        <Faq defaultOpenFirst={false} items={t.exchange.hub.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
