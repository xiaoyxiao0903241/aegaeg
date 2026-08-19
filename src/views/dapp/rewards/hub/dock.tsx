/**
 * 奖励总览左栏面板
 *
 * 六张奖励类型卡片，点击进入对应详情；
 * 各卡片金额来自不同数据源（链上快照 / 汇总接口），未登录显示空态占位。
 * 齿轮「隐藏 0」只过滤已知可领额为 0 的卡；Hub 无预览金额的入口卡始终保留。
 */
import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'

import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useMarketAllowanceSummary, useTeamRewardTotal } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useRewardsClaimableUnreads } from '~/hooks/use-nav-claimable-dots'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { dappAssets } from '~/shared/assets/dapp'
import { ClaimableDot } from '~/shared/components/claimable-dot'
import { Icon } from '~/shared/components/icon'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import type { Address } from '~/shared/config/contracts'
import type { RewardsView } from '~/shared/config/dapp-deep-links'
import { REWARDS_CARD_CONTRACT } from '~/shared/config/dapp-deep-links'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatNumber, formatUsdApprox, parseApiAmount } from '~/shared/presenters/format'
import { RewardsTypeCard } from '~/views/dapp/rewards/hub/primitives'
import { claimableAmountValue } from '~/views/dapp/rewards/shared'
import { withContributionRatio } from '~/views/dapp/shared/contribution-claim-ratio'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockFrame } from '~/views/dapp/shared/dock-frame'
import { HubFilterMenu } from '~/views/dapp/shared/hub-filter-menu'
import { openRewardsView } from '~/views/dapp/shared/navigation'
import { useContributionClaimRatioLabel } from '~/web3/exchange/use-burn-swap-config'
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
  // 未就绪/无数据：显示 0.0000gAGX / ≈ $0.00；登录提示放在底栏
  // API 十进制金额无 wei；链上幸运额另走 formatTokenAmount
  if (!ready || value == null) {
    return {
      amount: `${formatNumber(0, { digits: 4 })}gAGX`,
      approx: formatUsdApprox(0, null),
    }
  }
  return {
    amount: `${formatNumber(value, { digits: 4 })}gAGX`,
    approx: formatUsdApprox(value, priceUsd),
  }
}

/**
 * 是否保留卡片：会话未就绪或 Hub 无预览金额 → 保留入口；
 * 已知可领额 ≤ 0 → 可被「隐藏 0」滤掉。
 */
function rewardCardHasBalance(value: number | null, amountReady: boolean): boolean {
  if (!amountReady) return true
  if (value == null) return true
  return value > 0
}

export function RewardsHubDock() {
  const { messages: t } = useI18n()
  const claimRatio = useContributionClaimRatioLabel()
  const { walletReady, sessionReady } = useDappHost()
  const account = useActiveAccount()
  const priceUsd = useAgxPriceUsd()
  const [hideZero, setHideZero] = useState(false)
  const dots = useRewardsClaimableUnreads()
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

  const luckyWei = (() => {
    if (!walletReady) return null
    const snap = luckyQuery.data
    if (snap == null) return null
    if (!snap.claimable || snap.rewardAmount <= ZERO_BI) return ZERO_BI
    return snap.rewardAmount
  })()
  const luckyAmount = luckyWei == null ? null : formatTokenAmountToNumber(luckyWei, AGX_DECIMALS)

  const amountValue = (view: (typeof REWARD_CARDS)[number]) => {
    if (!sessionReady && view !== 'lucky') return null
    if (view === 'genesis') return genesisAmount
    if (view === 'grant') return grantAmount
    if (view === 'lucky') return luckyAmount
    // 推荐/参与/共建：可领额来自领取签名，Hub 无预览，显示空态
    return null
  }

  const amountReady = (view: (typeof REWARD_CARDS)[number]) =>
    view === 'lucky' ? walletReady : sessionReady

  const luckyBalance =
    !amountReady('lucky') || luckyWei == null
      ? {
          amount: `${formatNumber(0, { digits: 4 })}gAGX`,
          approx: formatUsdApprox(0, null),
        }
      : {
          amount: `${formatTokenAmount(luckyWei, AGX_DECIMALS, 4)}gAGX`,
          approx: formatUsdApprox(formatTokenAmountToNumber(luckyWei, AGX_DECIMALS), priceUsd),
        }

  const visibleCards = REWARD_CARDS.filter((view) => {
    if (!hideZero) return true
    return rewardCardHasBalance(amountValue(view), amountReady(view))
  })

  return (
    <DockFrame
      endAction={
        <HubFilterMenu
          align="end"
          ariaLabel={t.rewards.hub.filterAria}
          hideZero={hideZero}
          hideZeroLabel={t.rewards.hub.hideZero}
          onHideZeroChange={setHideZero}
        />
      }
      subtitle={t.rewards.intro}
      title={t.rewards.title}
    >
      {visibleCards.map((view) => {
        const card = t.rewards.cards[view]
        const value = amountValue(view)
        const isGenesis = view === 'genesis'
        const icon = REWARD_CARD_ICONS[view]
        const balance = isGenesis
          ? {
              amount:
                sessionReady && value != null
                  ? formatNumber(value, { digits: 2, prefix: '$' })
                  : formatNumber(0, { digits: 2, prefix: '$' }),
              approx: undefined as string | undefined,
            }
          : view === 'lucky'
            ? luckyBalance
            : formatGagxBalance(value, amountReady(view), priceUsd)
        const balanceLabel =
          isGenesis || view === 'grant' ? t.rewards.detail.claimable : t.rewards.hub.balanceLabel

        const unread =
          view === 'lucky'
            ? dots.lucky
            : view === 'grant'
              ? dots.grant
              : view === 'genesis'
                ? dots.genesis
                : false

        return (
          <RewardsTypeCard
            key={`${view}:${REWARDS_CARD_CONTRACT[view]}`}
            onClick={() => openRewardsView(view)}
          >
            {unread ? <ClaimableDot /> : null}
            <RewardsTypeCard.Head>
              <RewardsTypeCard.TitleGroup>
                <Icon alt="" size={icon.size} src={icon.src} />
                <Text as="span" className="font-semibold wrap-break-word" variant="detail">
                  {card.title}
                </Text>
                {isGenesis ? (
                  <RewardsTypeCard.Badge>{t.rewards.cards.genesis.badge}</RewardsTypeCard.Badge>
                ) : null}
              </RewardsTypeCard.TitleGroup>
              <RewardsTypeCard.Body>
                {withContributionRatio(card.body, claimRatio)}
              </RewardsTypeCard.Body>
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

      {walletReady && hideZero && visibleCards.length === 0 ? (
        <Table.Empty embedded title={t.rewards.hub.hideZeroEmpty} />
      ) : null}

      {!walletReady ? (
        <DockConnectPromo />
      ) : !sessionReady ? (
        <Text as="p" tone="muted-foreground" variant="copy">
          {t.rewards.hub.sessionHint}
        </Text>
      ) : null}
    </DockFrame>
  )
}
