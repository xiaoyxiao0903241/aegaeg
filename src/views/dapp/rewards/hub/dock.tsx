/**
 * 奖励总览左栏面板
 *
 * 六张奖励类型卡片，点击进入对应详情；
 * 各卡片金额来自不同数据源（链上快照 / 汇总接口），未登录显示空态占位。
 */
import { keepPreviousData } from '@tanstack/react-query'

import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useMarketAllowanceSummary, useTeamRewardTotal } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber, parseApiAmount } from '~/shared/api/format-display'
import { queryKeys } from '~/shared/api/query/query-keys'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { WidgetHeader } from '~/shared/components/widget-header'
import { dappAssets } from '~/shared/config/assets'
import type { Address } from '~/shared/config/contracts'
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { REWARDS_CARD_CONTRACT } from '~/shared/config/dapp-deep-links'
import { openRewardsView } from '~/shared/config/dapp-open-views'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { RewardsTypeCard } from '~/views/dapp/rewards/hub/primitives'
import { claimableAmountValue } from '~/views/dapp/rewards/shared'
import { DetailToggle } from '~/views/dapp/shared/detail-toggle'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { readLuckyClaimSnapshot } from '~/web3/rewards/rewards-read'
import { useActiveAccount } from '~/web3/thirdweb-react'

/** 六种奖励类型：幸运 / 推荐 / 参与 / 共建 / 发展 / 创世 */
const REWARD_CARDS = [
  'lucky',
  'referral',
  'participate',
  'cobuild',
  'grant',
  'genesis',
] as const satisfies readonly Exclude<RewardsView, 'hub'>[]

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

/** 卡片图标：参与 / 共建 / 发展用较大尺寸，其余用常规 */
const REWARD_CARD_ICONS = {
  lucky: { src: dappAssets.rewardsHubLucky, size: 'xl' },
  referral: { src: dappAssets.rewardsHubReferral, size: 'xl' },
  participate: { src: dappAssets.rewardsHubParticipate, size: 'token' },
  cobuild: { src: dappAssets.rewardsHubCobuild, size: 'token' },
  grant: { src: dappAssets.rewardsHubGrant, size: 'token' },
  genesis: { src: dappAssets.rewardsHubGenesis, size: 'xl' },
} as const

function formatGagxBalance(value: number | null, ready: boolean, priceUsd: number | null) {
  // 未就绪/无数据：显示 0.0000gAGX / ≈ $0.00；登录提示放在 Widget 底栏
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

export function HubDock() {
  const { messages: t } = useI18n()
  const { walletReady, sessionReady } = useDappHost()
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
    return parseApiAmount(grantSummary.data?.unlocked_claimable)
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
    // 推荐/参与/共建：可领额来自领取签名，Hub 无预览，显示空态
    return null
  }

  return (
    <>
      <WidgetHeader action={<DetailToggle />} subtitle={t.rewards.intro} title={t.rewards.title} />
      <DockStack>
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
            <RewardsTypeCard
              key={`${view}:${REWARDS_CARD_CONTRACT[view]}`}
              onClick={() => openRewardsView(view)}
            >
              <RewardsTypeCard.Head>
                <RewardsTypeCard.TitleRow>
                  <Icon alt="" size={icon.size} src={icon.src} />
                  <Text as="span" className="font-semibold wrap-break-word" variant="detail">
                    {card.title}
                  </Text>
                  {isGenesis ? (
                    <RewardsTypeCard.Badge>{t.rewards.cards.genesis.badge}</RewardsTypeCard.Badge>
                  ) : null}
                </RewardsTypeCard.TitleRow>
                <RewardsTypeCard.Body>{card.body}</RewardsTypeCard.Body>
              </RewardsTypeCard.Head>
              <RewardsTypeCard.Balance
                amount={balance.amount}
                approx={balance.approx}
                label={balanceLabel}
                trailing={
                  isGenesis ? (
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
                  ) : null
                }
              />
            </RewardsTypeCard>
          )
        })}

        {!walletReady ? (
          <DockConnectPromo />
        ) : !sessionReady ? (
          <Text as="p" tone="muted-foreground" variant="copy">
            {t.rewards.hub.sessionHint}
          </Text>
        ) : null}
      </DockStack>
    </>
  )
}
