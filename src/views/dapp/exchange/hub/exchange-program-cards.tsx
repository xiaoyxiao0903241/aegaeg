import { tv } from 'tailwind-variants'

import { exchangeHubAssets } from '~/app/assets'
import { formatBurnContributionRatioColon } from '~/core/exchange/burn-contribution-swap'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { ExchangeView } from '~/shared/config/dapp-deep-links'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
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
  [exchangeHubAssets.programPancake],
  [exchangeHubAssets.programX],
  undefined,
]

/** Index of「获取贡献点数」— body ratio from on-chain `rateBps`, not static 1:6. */
const CONTRIBUTION_CARD_INDEX = 5

/**
 * Exchange hub right-rail tile — Figma `4323:704` (elevated, h70).
 * Chrome is identical; optional `icon` URLs are the only structural fork.
 * No onClick → `article` (same visual); never HTML `disabled` (global dims + strips shadow).
 */
const exchangeProgramCard = tv({
  base: 'flex h-[70px] w-full px-4 py-3.5 text-left',
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

  return (
    <span className="relative flex h-7 w-[53px] shrink-0 items-center">
      <img
        alt=""
        className="absolute top-0 left-[2px] size-7 rounded-md object-cover"
        height={28}
        src={icon[0]}
        width={28}
      />
      <img
        alt=""
        className="absolute top-0 left-[25px] size-7 rounded-md object-cover"
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
        <Text as="strong" className="text-[14px] leading-normal font-semibold" variant="copy">
          {title}
        </Text>
        <Text as="span" className="leading-normal text-foreground/40" variant="support">
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
      ? '0'
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
