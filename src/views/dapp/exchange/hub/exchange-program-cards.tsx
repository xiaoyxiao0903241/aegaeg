import { tv } from 'tailwind-variants'

import { exchangeHubAssets } from '~/app/assets'
import { formatBurnContributionRatioColon } from '~/core/exchange/burn-contribution-swap'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import type { ExchangeView } from '~/shared/config/dapp-deep-links'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { cn } from '~/shared/lib/utils'
import { useExchangeTradePairStore } from '~/stores/exchange-trade-pair-store'
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

/**
 * 兑换 Hub 程序卡片
 *
 * 无点击行为时渲染为 article（视觉一致）；禁用不用 HTML disabled，
 * 以免破坏悬浮抬升样式。
 */
const exchangeProgramCard = tv({
  // p-0：清 elevated 默认 pad，改由 px/py
  base: 'flex w-full p-0 px-4 py-3 text-left',
  variants: {
    hasIcon: {
      true: 'items-center justify-between gap-2',
      false: 'flex-col items-start justify-center gap-1.5',
    },
    interactive: {
      true: 'duration-dapp-fast cursor-pointer transition-[transform,box-shadow] ease-out hover:scale-[1.008] active:scale-[0.992]',
      false: null,
    },
  },
})

function ProgramCoinIcon({ icon }: { icon: readonly [string] | readonly [string, string] }) {
  if (icon.length === 1) {
    return (
      <img
        alt=""
        className="size-7 shrink-0 rounded-md object-cover"
        height={28}
        src={icon[0]}
        width={28}
      />
    )
  }

  // 双币叠加需外层固定高度：绝对定位不占文档流，否则高度塌成 0
  return (
    <span className="relative flex h-7 w-13 shrink-0 items-center">
      <img
        alt=""
        className="absolute top-0 left-0.5 size-7 rounded-md object-cover"
        height={28}
        src={icon[0]}
        width={28}
      />
      <img
        alt=""
        className="absolute top-0 left-6 size-7 rounded-md object-cover"
        height={28}
        src={icon[1]}
        width={28}
      />
    </span>
  )
}

function ExchangeProgramCard({
  body,
  icon,
  onClick,
  title,
}: {
  body: string
  /** 1 个为单币图 · 2 个为叠加双币 · 不传为纯文字。 */
  icon?: readonly [string] | readonly [string, string]
  onClick?: () => void
  title: string
}) {
  const interactive = Boolean(onClick)

  return (
    <Card
      as={interactive ? 'button' : 'article'}
      surface="elevated"
      className={cn(exchangeProgramCard({ hasIcon: Boolean(icon), interactive }))}
      {...(interactive ? { onClick, type: 'button' as const } : {})}
    >
      <Card.Content className={cn('grid min-w-0 gap-1.5 text-left', icon && 'flex-1')}>
        <Text as="strong" className="leading-tight font-semibold wrap-break-word" variant="detail">
          {title}
        </Text>
        <Text as="span" className="leading-tight wrap-break-word text-foreground/40" variant="copy">
          {body}
        </Text>
      </Card.Content>
      {icon ? <ProgramCoinIcon icon={icon} /> : null}
    </Card>
  )
}

/**
 * 兑换 Hub 程序入口卡片网格
 *
 * 六张卡片来自 i18n 文案，点击跳转到对应兑换模式；
 * 「获取贡献点数」卡片的比例用链上配置实时替换。
 */
export function ExchangeProgramCards() {
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
    <div className="grid gap-2 dapp:grid-cols-2 dapp:gap-x-2.5">
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
    </div>
  )
}
