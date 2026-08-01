import { dappAssets } from '~/app/assets'
import { useI18n } from '~/i18n/use-i18n'
import { openRewardsView } from '~/shared/config/dapp-open-views'
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { REWARDS_CARD_CONTRACT } from '~/shared/config/dapp-deep-links'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { useTeamRewardTotal } from '~/hooks/use-api-data'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { Text } from '~/shared/ui/text'
import { WidgetHeader } from '~/shared/ui/widget-header'
import { RewardsModeCard } from '~/views/dapp/rewards/hub/rewards-mode-card'
import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { claimableAmountValue, formatApiDecimalAmount } from '~/views/dapp/rewards/rewards-display'

const CARD_VIEWS = [
  'lucky',
  'referral',
  'participate',
  'cobuild',
  'grant',
  'genesis',
] as const satisfies readonly Exclude<RewardsView, 'hub'>[]

function formatGagxBalance(value: number | null, sessionReady: boolean, signInLabel: string) {
  if (!sessionReady) return { amount: signInLabel, approx: formatApiDecimalAmount(null) }
  if (value == null)
    return { amount: formatApiDecimalAmount(null), approx: formatApiDecimalAmount(null) }
  return {
    amount: `${value.toFixed(4)}gAGX`,
    approx: formatGroupedNumber(value, { digits: 2, prefix: '≈ $' }),
  }
}

export function RewardsHubWidget() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappShell()
  const { data: teamTotal } = useTeamRewardTotal(sessionReady)

  const genesisAmount = sessionReady
    ? claimableAmountValue(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
    : 0

  const amountValue = (view: (typeof CARD_VIEWS)[number]) => {
    if (!sessionReady) return null
    if (view === 'genesis') return genesisAmount
    // Dao Mixed (referral / participate / cobuild): amount from signature at claim — no hub preview.
    return null
  }

  return (
    <>
      <WidgetHeader
        action={<DappPanelToggle />}
        subtitle={t.rewards.intro}
        title={t.rewards.title}
      />
      <DappWidgetStack>
        {CARD_VIEWS.map((view) => {
          const card = t.rewards.cards[view]
          const value = amountValue(view)
          const isGenesis = view === 'genesis'
          const usesClaimableLabel = isGenesis || view === 'grant'
          const balance = isGenesis
            ? {
                amount: sessionReady
                  ? value == null
                    ? formatApiDecimalAmount(null)
                    : formatGroupedNumber(value, { digits: 2, prefix: '$' })
                  : t.rewards.hub.signInForBalance,
                approx: undefined as string | undefined,
              }
            : formatGagxBalance(value, sessionReady, t.rewards.hub.signInForBalance)

          return (
            <RewardsModeCard
              approx={balance.approx}
              badge={isGenesis ? t.rewards.cards.genesis.badge : undefined}
              balanceAmount={balance.amount}
              balanceLabel={
                usesClaimableLabel ? t.rewards.detail.claimable : t.rewards.hub.balanceLabel
              }
              body={card.body}
              claimCta={isGenesis ? t.rewards.hub.enterClaim : undefined}
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
      </DappWidgetStack>
    </>
  )
}
