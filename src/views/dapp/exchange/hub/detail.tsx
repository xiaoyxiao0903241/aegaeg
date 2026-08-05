/**
 * 兑换总览详情页
 *
 * 上部为兑换模式入口卡片（闪兑 / 市价交易 / 销毁 / Turbine），
 * 点击跳转到对应模式；下部为常见问题折叠列表。
 */
import { formatBurnContributionRatioColon } from '~/core/exchange/burn-contribution-swap'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Grid } from '~/shared/components/grid'
import { Section } from '~/shared/components/section'
import { exchangeHubAssets } from '~/shared/config/assets'
import type { ExchangeView } from '~/shared/config/dapp-deep-links'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { useExchangeTradePairStore } from '~/stores/exchange-trade-pair-store'
import { ExchangeProgramCard } from '~/views/dapp/exchange/hub/primitives'
import { readBurnContributionSwapConfig } from '~/web3/exchange/burn-exchange-read'

/**
 * 程序卡片点击目标：0 Trade gAGX → 闪兑 · 1 Turbine → 涡轮
 * 2 Get USD1 → 闪兑 · 3 Get AGX → 市价交易 · 4 Sell X → 市价交易
 * 5 Points → 销毁
 */
const PROGRAM_TARGETS: Array<ExchangeView | null> = [
  'flash',
  'turbine',
  'flash',
  'trade',
  'trade',
  'burn',
]

/** 「出售 X」卡片索引：进入市价交易；X 暂未上架，代币预选延后到手册收录。 */
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

export function HubDetail() {
  const { messages: t } = useI18n()
  const cards = t.exchange.hub.program.cards

  const configQuery = useChainQuery({
    queryKey: queryKeys.chain.burnSwapConfig,
    queryFn: () => readBurnContributionSwapConfig(),
    scope: 'public',
    freshness: 'quote',
  })

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
                ? card.body.replace('{ratio}', contributionRatio)
                : card.body

            return (
              <ExchangeProgramCard
                body={body}
                icon={PROGRAM_ICONS[index]}
                key={`${card.title}:${index}`}
                onClick={
                  target
                    ? () => {
                        // 出售 X：按默认币对打开市价交易；X 暂未上架不做预选
                        if (index === SELL_X_CARD_INDEX) {
                          useExchangeTradePairStore.getState().setSellKey('usd1')
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
