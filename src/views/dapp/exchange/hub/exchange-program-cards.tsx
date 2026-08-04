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
 * Figma hub program grid (PC `4267:212`):
 * 0 Trade gAGX → flash · 1 Turbine → turbine · 2 Get USD1 → flash
 * 3 Get AGX → trade · 4 Sell X → trade（X 选币 DEFER：§7.1 仅 USD1↔AGX，进交易默认对） · 5 Points → burn
 */
const PROGRAM_TARGETS: Array<ExchangeView | null> = [
  'flash',
  'turbine',
  'flash',
  'trade',
  'trade',
  'burn',
]

/** Index of「出售 X」— opens trade; X preselect DEFER until handbook lists X. */
const SELL_X_CARD_INDEX = 4

/** Parallel to i18n cards — `undefined` = text-only leaf. */
const PROGRAM_ICONS: Array<readonly [string] | readonly [string, string] | undefined> = [
  [exchangeHubAssets.programGagx, exchangeHubAssets.programAgx],
  [exchangeHubAssets.programUsd1, exchangeHubAssets.programGagx],
  [exchangeHubAssets.programUsdt, exchangeHubAssets.programUsd1],
  [exchangeHubAssets.programAgx],
  [exchangeHubAssets.programX],
  undefined,
]

/** Index of「获取贡献点数」— body ratio from on-chain `rateBps`, not static 1:6. */
const CONTRIBUTION_CARD_INDEX = 5

/**
 * Exchange hub right-rail tile — Figma `4323:704`.
 * 高度由内容 + pad；同行等高靠父级 grid `items-stretch`（禁 min-h / size-full / h-*）。
 * No onClick → `article`（同视觉）；禁 HTML `disabled`（会毁 elevation）。
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

  // Dual overlap: 轨必须 h-7（稿 coins 28px）；绝对定位不占流，无高则塌 0，父 items-center 失效。
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
  /** 1 = single coin · 2 = overlapping dual · omit = text-only. */
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
        {/* 稿 title 14 / body 13；leading-tight 合成 h70（禁 leading-[…] 任意值） */}
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
                    // Sell X: open trade on handbook default pair; X preselect DEFER (T-D1c).
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
