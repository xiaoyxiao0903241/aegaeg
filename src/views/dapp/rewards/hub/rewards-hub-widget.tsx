import { useState } from 'react'
import { dappAssets } from '~/app/assets'
import { useI18n } from '~/i18n/use-i18n'
import { openRewardsView } from '~/shared/config/open-rewards-view'
import type { RewardsView } from '~/shared/config/rewards-deep-link'
import { REWARDS_CARD_CONTRACT } from '~/shared/config/rewards-deep-link'
import { formatUsd } from '~/shared/api/format-display'
import { useCommunityFundTotal, useTeamRewardTotal } from '~/hooks/use-api-data'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { Text } from '~/shared/ui/text'
import { WidgetHeader } from '~/shared/ui/widget-header'
import { ExchangeModeCard } from '~/views/dapp/exchange/hub/exchange-mode-card'
import {
  ExchangePanelToggle,
  ExchangeWidgetBody,
} from '~/views/dapp/exchange/exchange-widget-composites'
import { claimableAmountValue } from '~/views/dapp/rewards/rewards-display'
import { cn } from '~/shared/lib/utils'

const CARD_VIEWS = [
  'lucky',
  'referral',
  'participate',
  'cobuild',
  'grant',
  'genesis',
] as const satisfies readonly Exclude<RewardsView, 'hub'>[]

export function RewardsHubWidget() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappShell()
  const { data: teamTotal } = useTeamRewardTotal(sessionReady)
  const { data: communityFundTotal } = useCommunityFundTotal(sessionReady)
  const [hideZero, setHideZero] = useState(true)

  const genesisAmount = sessionReady
    ? claimableAmountValue(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
    : 0
  const referralAmount = sessionReady ? Number(communityFundTotal?.unlocked_claimable ?? 0) : 0

  const amountValue = (view: (typeof CARD_VIEWS)[number]) => {
    if (!sessionReady) return null
    if (view === 'genesis') return genesisAmount
    if (view === 'referral') return Number.isFinite(referralAmount) ? referralAmount : 0
    return null
  }

  const amountLabel = (view: (typeof CARD_VIEWS)[number]) => {
    if (!sessionReady) return t.rewards.hub.signInForBalance
    const value = amountValue(view)
    if (value == null) return t.rewards.hub.balancePlaceholder
    return `${formatUsd(value, 2)}`
  }

  const visible = CARD_VIEWS.filter((view) => {
    if (!hideZero || !sessionReady) return true
    const value = amountValue(view)
    // Unknown balances (—) stay visible; only hide known zeros.
    if (value == null) return true
    return value > 0
  })

  return (
    <>
      <WidgetHeader
        action={<ExchangePanelToggle />}
        subtitle={t.rewards.intro}
        title={t.rewards.title}
      />
      <ExchangeWidgetBody>
        <button
          aria-checked={hideZero}
          className="flex items-center gap-2 self-start rounded-lg px-2.5 py-2 text-left text-[13px] tracking-[-0.26px] text-foreground transition-colors hover:bg-muted"
          onClick={() => setHideZero((value) => !value)}
          role="checkbox"
          type="button"
        >
          <span
            aria-hidden
            className={cn(
              'grid size-[15px] shrink-0 place-items-center rounded-[4px] border-[1.5px]',
              hideZero ? 'border-primary bg-primary' : 'border-foreground/30 bg-transparent',
            )}
          >
            <svg
              className={cn('size-[9px]', hideZero ? 'opacity-100' : 'opacity-0')}
              fill="none"
              viewBox="0 0 10 10"
            >
              <path
                d="M1.5 5.5L4 8L8.5 2.5"
                stroke="#ffffff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </span>
          {t.rewards.hub.hideZero}
        </button>

        {visible.map((view) => {
          const card = t.rewards.cards[view]
          return (
            <ExchangeModeCard
              badge={view === 'genesis' ? t.rewards.cards.genesis.badge : undefined}
              body={`${card.body}\n${t.rewards.hub.balanceLabel}: ${amountLabel(view)}`}
              icon={dappAssets.rewards}
              key={`${view}:${REWARDS_CARD_CONTRACT[view]}`}
              onClick={() => openRewardsView(view)}
              title={card.title}
            />
          )
        })}

        {sessionReady && hideZero && visible.length === 0 ? (
          <Text as="p" tone="muted-foreground" variant="copy">
            {t.rewards.hub.hideZeroEmpty}
          </Text>
        ) : null}

        {!walletReady ? (
          <DappWidgetConnectPromo />
        ) : !sessionReady ? (
          <Text as="p" tone="muted-foreground" variant="copy">
            {t.rewards.hub.sessionHint}
          </Text>
        ) : null}
      </ExchangeWidgetBody>
    </>
  )
}
