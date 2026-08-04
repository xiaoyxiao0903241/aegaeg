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
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { InteractiveCard } from '~/shared/components/interactive-card'
import { Text } from '~/shared/components/text'
import { WidgetHeader } from '~/shared/components/widget-header'
import type { Address } from '~/shared/config/contracts'
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { REWARDS_CARD_CONTRACT } from '~/shared/config/dapp-deep-links'
import { openRewardsView } from '~/shared/config/dapp-open-views'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { claimableAmountValue } from '~/views/dapp/rewards/rewards-display'
import { readLuckyClaimSnapshot } from '~/web3/rewards/rewards-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

/** 奖励 Hub：幸运 / 推荐 / 参与 / 共建 / 发展 / 创世 */
const REWARD_CARDS = [
  'lucky',
  'referral',
  'participate',
  'cobuild',
  'grant',
  'genesis',
] as const satisfies readonly Exclude<RewardsView, 'hub'>[]

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/** Figma：参与/共建/发展 24（token）；其余 20（xl）。 */
const REWARD_CARD_ICONS = {
  lucky: { src: dappAssets.rewardsHubLucky, size: 'xl' },
  referral: { src: dappAssets.rewardsHubReferral, size: 'xl' },
  participate: { src: dappAssets.rewardsHubParticipate, size: 'token' },
  cobuild: { src: dappAssets.rewardsHubCobuild, size: 'token' },
  grant: { src: dappAssets.rewardsHubGrant, size: 'token' },
  genesis: { src: dappAssets.rewardsHubGenesis, size: 'xl' },
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

  const amountValue = (view: (typeof REWARD_CARDS)[number]) => {
    if (!sessionReady && view !== 'lucky') return null
    if (view === 'genesis') return genesisAmount
    if (view === 'grant') return grantAmount
    if (view === 'lucky') return luckyAmount
    // referral / participate / cobuild：可领额来自签名，Hub 无预览 → 诚实空态
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
        {REWARD_CARDS.map((view) => {
          const card = t.rewards.cards[view]
          const value = amountValue(view)
          const isGenesis = view === 'genesis'
          const icon = REWARD_CARD_ICONS[view]
          const balance = isGenesis
            ? {
                amount:
                  sessionReady && value != null
                    ? formatGroupedNumber(value, { digits: 2, prefix: '$' })
                    : formatGroupedNumber(0, { digits: 2, prefix: '$' }),
                approx: undefined as string | undefined,
              }
            : formatGagxBalance(value, view === 'lucky' ? walletReady : sessionReady, priceUsd)
          const balanceLabel =
            isGenesis || view === 'grant' ? t.rewards.detail.claimable : t.rewards.hub.balanceLabel

          return (
            <InteractiveCard
              className="grid gap-3"
              key={`${view}:${REWARDS_CARD_CONTRACT[view]}`}
              onClick={() => openRewardsView(view)}
            >
              <div className="grid gap-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Icon alt="" size={icon.size} src={icon.src} />
                  <Text as="span" className="font-semibold wrap-break-word" variant="detail">
                    {card.title}
                  </Text>
                  {isGenesis ? (
                    <span className="inline-flex items-center rounded-full bg-primary-soft px-2">
                      <Text as="span" className="leading-none" tone="primary" variant="caption">
                        {t.rewards.cards.genesis.badge}
                      </Text>
                    </span>
                  ) : null}
                </div>
                <Text as="p" className="m-0 wrap-break-word text-foreground/40" variant="copy">
                  {card.body}
                </Text>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <Text as="span" className="text-foreground/70" variant="copy">
                  {balanceLabel}
                </Text>
                <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5">
                  <Text as="strong" className="wrap-break-word" variant="headline">
                    <CountValue text={balance.amount} />
                  </Text>
                  {balance.approx ? (
                    <Text as="span" className="wrap-break-word text-foreground/40" variant="copy">
                      <CountValue text={balance.approx} />
                    </Text>
                  ) : null}
                  {isGenesis ? (
                    <span className="inline-flex items-center gap-1">
                      <Text as="span" className="font-medium" tone="primary" variant="copy">
                        {t.rewards.hub.enterClaim}
                      </Text>
                      <Icon
                        alt=""
                        className="size-4"
                        size="sm"
                        src={dappAssets.rewardsHubEnterClaim}
                      />
                    </span>
                  ) : null}
                </div>
              </div>
            </InteractiveCard>
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
