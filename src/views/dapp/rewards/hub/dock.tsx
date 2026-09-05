/**
 * 奖励总览左栏面板
 *
 * 奖励类型卡片，点击进入对应详情；
 * 幸运走链上快照，创世维持团队奖汇总，其余待领来自类型汇总。
 * 发展津贴仅 `is_user_node_type` 为真时展示。
 * 齿轮「隐藏 0」只过滤已知可领额为 0 的卡。
 */
import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'

import { ZERO_BI } from '~/core/constants'
import {
  formatTokenAmount,
  formatTokenAmountToNumber,
  PERSONAL_TOKEN_DIGITS,
} from '~/core/exchange/token-amount'
import { isGrantNodeEligible } from '~/core/rewards/grant-eligible'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useDaoRewardTypeTotals, useTeamRewardTotal, useUserNodeType } from '~/hooks/use-api-data'
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
import { hubApiClaimableFromTypeTotals } from '~/shared/lib/dao-reward-type-totals'
import { formatDecimal, toUsd } from '~/shared/presenters/format'
import { RewardsTypeCard } from '~/views/dapp/rewards/hub/primitives'
import { claimableAmountValue } from '~/views/dapp/rewards/shared'
import { withContributionRatio } from '~/views/dapp/shared/contribution-claim-ratio'
import { DockFrame } from '~/views/dapp/shared/dock-frame'
import { HubFilterMenu } from '~/views/dapp/shared/hub-filter-menu'
import { openRewardsView } from '~/views/dapp/shared/navigation'
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
  const amount = ready ? value : null
  return {
    amount: formatDecimal(amount, { digits: PERSONAL_TOKEN_DIGITS, suffix: ' gAGX' }),
    approx: formatDecimal(toUsd(amount, priceUsd), { digits: 2, prefix: '≈ $' }),
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
  const { walletReady, sessionReady } = useDappHost()
  const account = useActiveAccount()
  const priceUsd = useAgxPriceUsd()
  const [hideZero, setHideZero] = useState(false)
  const dots = useRewardsClaimableUnreads()
  const { data: teamTotal } = useTeamRewardTotal(sessionReady)
  const { data: typeTotals } = useDaoRewardTypeTotals(sessionReady)
  const { data: nodeType } = useUserNodeType(sessionReady)
  const grantEligible = isGrantNodeEligible(nodeType?.is_user_node_type)
  const luckyQuery = useChainQuery({
    queryKey: queryKeys.chain.rewardsLuckyClaim,
    queryFn: (address) => readLuckyClaimSnapshot(address as Address),
    enabled: Boolean(account?.address),
    placeholderData: keepPreviousData,
  })

  const genesisAmount = sessionReady
    ? claimableAmountValue(teamTotal?.total ?? '0', teamTotal?.claimed ?? '0')
    : 0

  const luckyWei = (() => {
    if (!walletReady) return null
    const snap = luckyQuery.data
    if (snap == null) return null
    if (!snap.claimable || snap.totalUnclaimedAmount <= ZERO_BI) return ZERO_BI
    return snap.totalUnclaimedAmount
  })()
  const luckyAmount = luckyWei == null ? null : formatTokenAmountToNumber(luckyWei, AGX_DECIMALS)

  const amountValue = (view: (typeof REWARD_CARDS)[number]) => {
    if (view === 'lucky') return luckyAmount
    if (!sessionReady) return null
    if (view === 'genesis') return genesisAmount
    return hubApiClaimableFromTypeTotals(view, typeTotals)
  }

  const amountReady = (view: (typeof REWARD_CARDS)[number]) =>
    view === 'lucky' ? walletReady : sessionReady

  const luckyBalance = {
    amount: formatTokenAmount(amountReady('lucky') ? luckyWei : null, AGX_DECIMALS, {
      digits: PERSONAL_TOKEN_DIGITS,
      trimZeros: false,
      suffix: ' gAGX',
    }),
    approx: formatDecimal(
      toUsd(
        amountReady('lucky') && luckyWei != null
          ? formatTokenAmountToNumber(luckyWei, AGX_DECIMALS)
          : null,
        priceUsd,
      ),
      { digits: 2, prefix: '≈ $' },
    ),
  }

  const visibleCards = REWARD_CARDS.filter((view) => {
    if (view === 'grant' && !grantEligible) return false
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
              amount: formatDecimal(value, { digits: 2, prefix: '$' }),
              approx: undefined as string | undefined,
            }
          : view === 'lucky'
            ? luckyBalance
            : formatGagxBalance(value, amountReady(view), priceUsd)
        const balanceLabel =
          isGenesis || view === 'grant' ? t.rewards.detail.claimable : t.rewards.hub.balanceLabel

        const unread = dots[view]

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
              <RewardsTypeCard.Body>{withContributionRatio(card.body)}</RewardsTypeCard.Body>
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
    </DockFrame>
  )
}
