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

  const genesisAmount = sessionReady
    ? claimableAmountValue(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
    : 0
  const referralAmount = sessionReady ? Number(communityFundTotal?.unlocked_claimable ?? 0) : 0

  const amountLabel = (view: (typeof CARD_VIEWS)[number]) => {
    if (!sessionReady) return t.rewards.hub.signInForBalance
    if (view === 'genesis') return `${formatUsd(genesisAmount, 2)}`
    if (view === 'referral')
      return `${formatUsd(Number.isFinite(referralAmount) ? referralAmount : 0, 2)}`
    return t.rewards.hub.balancePlaceholder
  }

  return (
    <>
      <WidgetHeader
        action={<ExchangePanelToggle />}
        subtitle={t.rewards.intro}
        title={t.rewards.title}
      />
      <ExchangeWidgetBody>
        {CARD_VIEWS.map((view) => {
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
