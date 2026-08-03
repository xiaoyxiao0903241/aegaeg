import { keepPreviousData } from '@tanstack/react-query'

import { dappAssets } from '~/app/assets'
import { DappPanelToggle } from '~/app/shell/dapp-panel-toggle'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useMarketAllowanceSummary, useTeamRewardTotal } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { REWARDS_CARD_CONTRACT } from '~/shared/config/dapp-deep-links'
import { openRewardsView } from '~/shared/config/dapp-open-views'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { Text } from '~/shared/ui/text'
import { WidgetHeader } from '~/shared/ui/widget-header'
import { RewardsModeCard } from '~/views/dapp/rewards/hub/rewards-mode-card'
import { claimableAmountValue } from '~/views/dapp/rewards/rewards-display'
import { readLuckyClaimSnapshot } from '~/web3/rewards/rewards-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

const CARD_VIEWS = [
  'lucky',
  'referral',
  'participate',
  'cobuild',
  'grant',
  'genesis',
] as const satisfies readonly Exclude<RewardsView, 'hub'>[]

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/** Figma：参与/共建/发展 icon 24；其余 20。 */
const CARD_ICONS = {
  lucky: { src: dappAssets.rewardsHubLucky, className: undefined },
  referral: { src: dappAssets.rewardsHubReferral, className: undefined },
  participate: { src: dappAssets.rewardsHubParticipate, className: 'size-6' },
  cobuild: { src: dappAssets.rewardsHubCobuild, className: 'size-6' },
  grant: { src: dappAssets.rewardsHubGrant, className: 'size-6' },
  genesis: { src: dappAssets.rewardsHubGenesis, className: undefined },
} as const

function formatGagxBalance(value: number | null, ready: boolean, priceUsd: number | null) {
  // 无数据稿：0.0000gAGX / ≈ $0.00（未登录同空态；登录提示在 Widget 底栏）
  if (!ready || value == null) {
    return {
      amount: `${formatGroupedNumber(0, { digits: 4 })}gAGX`,
      approx: formatApproxUsd(0, null),
    }
  }
  return {
    amount: `${value.toFixed(4)}gAGX`,
    approx: formatApproxUsd(value, priceUsd),
  }
}

export function RewardsHubWidget() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappShell()
  const account = useActiveAccount()
  const priceUsd = useAgxPriceUsd()
  const { data: teamTotal } = useTeamRewardTotal(sessionReady)
  const grantSummary = useMarketAllowanceSummary(sessionReady)
  const luckyQuery = useChainQuery({
    queryKey: queryKeys.chain.rewardsLuckyClaim,
    queryFn: (address) => readLuckyClaimSnapshot(address as Address),
    enabled: Boolean(account?.address),
    placeholderData: keepPreviousData,
  })

  const genesisAmount = sessionReady
    ? claimableAmountValue(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
    : 0

  const grantAmount = (() => {
    if (!sessionReady) return null
    const raw = grantSummary.data?.unlocked_claimable
    if (raw == null || raw.trim() === '') return null
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  })()

  const luckyAmount = (() => {
    if (!walletReady) return null
    const snap = luckyQuery.data
    if (snap == null) return null
    if (!snap.claimable || snap.rewardAmount <= 0n) return 0
    return formatTokenAmountToNumber(snap.rewardAmount, AGX_DECIMALS)
  })()

  const amountValue = (view: (typeof CARD_VIEWS)[number]) => {
    if (!sessionReady && view !== 'lucky') return null
    if (view === 'genesis') return genesisAmount
    if (view === 'grant') return grantAmount
    if (view === 'lucky') return luckyAmount
    // referral / participate / cobuild：可领额来自签名（推荐=CommunityFund 简单签；共建=Dao Mixed），Hub 无预览 → 诚实空态
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
          const icon = CARD_ICONS[view]
          const balance = isGenesis
            ? {
                amount:
                  sessionReady && value != null
                    ? formatGroupedNumber(value, { digits: 2, prefix: '$' })
                    : formatGroupedNumber(0, { digits: 2, prefix: '$' }),
                approx: undefined as string | undefined,
              }
            : formatGagxBalance(value, view === 'lucky' ? walletReady : sessionReady, priceUsd)

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
              claimIcon={isGenesis ? dappAssets.rewardsHubEnterClaim : undefined}
              icon={icon.src}
              iconClassName={icon.className}
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
