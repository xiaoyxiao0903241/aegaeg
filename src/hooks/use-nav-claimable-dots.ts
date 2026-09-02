import { keepPreviousData } from '@tanstack/react-query'

import {
  fingerprintAssetsBondExpiry,
  fingerprintAssetsStakeExpiry,
  fingerprintLucky,
  fingerprintPositiveDecimal,
  fingerprintReleaseBuffer,
  fingerprintReleaseQueue,
} from '~/core/claimable-unread'
import { isGrantNodeEligible } from '~/core/rewards/grant-eligible'
import { useDaoRewardTypeTotals, useTeamRewardTotal, useUserNodeType } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useClaimableUnread } from '~/hooks/use-claimable-unread'
import { useDappHost } from '~/hooks/use-dapp-host'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import {
  hubApiClaimableFromTypeTotals,
  type RewardsApiClaimView,
} from '~/shared/lib/dao-reward-type-totals'
import { parseApiAmount } from '~/shared/presenters/format'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import { useDappHostStore } from '~/stores/dapp-host-store'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import {
  readBurnBondPositions,
  readLpBondPositions,
  readStakePositions,
} from '~/web3/assets/assets-read'
import { readTurbineClaimableFingerprint } from '~/web3/exchange/turbine-exchange-read'
import { readReleaseBufferSnapshot, readReleaseQueueSnapshot } from '~/web3/release/release-read'
import { readLuckyClaimSnapshot } from '~/web3/rewards/rewards-read'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

const CLAIMABLE_DOT_POLL_MS = QUERY_STALE_TIME.balances

function useWalletReady(): boolean {
  return hasWalletAccount(useActiveAccount())
}

/** 登录后 API 待领：加载中不亮；金额 > 0 为欠账占位，不含金额本身。 */
function sessionAmountFingerprint(
  sessionReady: boolean,
  pending: boolean,
  amount: number | null,
): string | null {
  if (!sessionReady) return ''
  if (pending) return null
  return fingerprintPositiveDecimal(amount)
}

/**
 * 兑换涡轮红点：冷却已结束且仍可领则亮，领完才灭。
 *
 * @see docs/onchain-manual/contracts/turbine.md
 */
export function useExchangeTurbineUnread(): boolean {
  const walletReady = useWalletReady()
  const activeTab = useDappHostStore((state) => state.activeTab)
  const view = useExchangeViewStore((state) => state.view)
  const query = useChainQuery({
    queryKey: queryKeys.chain.turbineClaimable,
    queryFn: (addr) => readTurbineClaimableFingerprint(addr),
    enabled: walletReady,
    refetchInterval: CLAIMABLE_DOT_POLL_MS,
  })
  return useClaimableUnread(
    'exchange.turbine',
    query.isPlaceholderData || query.data === undefined ? null : query.data,
    activeTab === 'exchange' && view === 'turbine',
    'balance',
  )
}

/**
 * 释放队列 / 缓冲池红点：释放完成且仍可领才亮，领完才灭。导航为二者 OR。
 *
 * @see docs/onchain-manual/contracts/rewardqueue.md
 * @see docs/onchain-manual/contracts/aegissplitter.md
 */
export function useReleaseClaimableUnreads(): {
  queue: boolean
  buffer: boolean
  rail: boolean
} {
  const walletReady = useWalletReady()
  const activeTab = useDappHostStore((state) => state.activeTab)
  const view = useReleaseViewStore((state) => state.view)
  const queueQuery = useChainQuery({
    queryKey: queryKeys.chain.releaseQueue,
    queryFn: (addr) => readReleaseQueueSnapshot(addr as Address),
    enabled: walletReady,
    refetchInterval: CLAIMABLE_DOT_POLL_MS,
    placeholderData: keepPreviousData,
  })
  const bufferQuery = useChainQuery({
    queryKey: queryKeys.chain.releaseBuffer,
    queryFn: (addr) => readReleaseBufferSnapshot(addr as Address),
    enabled: walletReady,
    refetchInterval: CLAIMABLE_DOT_POLL_MS,
    placeholderData: keepPreviousData,
  })

  const queueFp =
    queueQuery.isPlaceholderData || queueQuery.data == null
      ? null
      : fingerprintReleaseQueue(queueQuery.data.plans)
  const bufferFp =
    bufferQuery.isPlaceholderData || bufferQuery.data == null
      ? null
      : fingerprintReleaseBuffer({
          agxClaimable: bufferQuery.data.agx.totalClaimable,
          gagxClaimable: bufferQuery.data.gagx.totalClaimable,
          agxReleasing: bufferQuery.data.agx.totalReleasing,
          gagxReleasing: bufferQuery.data.gagx.totalReleasing,
        })

  const queue = useClaimableUnread(
    'release.queue',
    queueFp,
    activeTab === 'release' && view === 'queue',
    'balance',
  )
  const buffer = useClaimableUnread(
    'release.buffer',
    bufferFp,
    activeTab === 'release' && view === 'buffer',
    'balance',
  )
  return { queue, buffer, rail: queue || buffer }
}

/**
 * 奖励红点：六张卡全接。待领 > 0 就亮，领到 0 才灭。
 *
 * 幸运走链上 `getRewardInfo` pending；推荐 / 参与 / 共建 / 津贴走 type-totals；
 * 创世走团队奖差额。发展津贴仅节点资格为真时计入。
 *
 * @see docs/onchain-manual/contracts/aegisluckypool.md
 * @see docs/backend-api/api.md #dao-reward/type-totals
 */
export function useRewardsClaimableUnreads(): {
  lucky: boolean
  referral: boolean
  participate: boolean
  cobuild: boolean
  grant: boolean
  genesis: boolean
  rail: boolean
} {
  const walletReady = useWalletReady()
  const { sessionReady } = useDappHost()
  const activeTab = useDappHostStore((state) => state.activeTab)
  const view = useRewardsViewStore((state) => state.view)
  const onRewards = activeTab === 'rewards'
  const teamQuery = useTeamRewardTotal(sessionReady)
  const typeTotalsQuery = useDaoRewardTypeTotals(sessionReady)
  const nodeTypeQuery = useUserNodeType(sessionReady)
  const grantEligible = isGrantNodeEligible(nodeTypeQuery.data?.is_user_node_type)
  const luckyQuery = useChainQuery({
    queryKey: queryKeys.chain.rewardsLuckyClaim,
    queryFn: (address) => readLuckyClaimSnapshot(address as Address),
    enabled: walletReady,
    refetchInterval: CLAIMABLE_DOT_POLL_MS,
    placeholderData: keepPreviousData,
  })

  const luckyFp = !walletReady
    ? ''
    : luckyQuery.isPlaceholderData || luckyQuery.data == null
      ? null
      : fingerprintLucky(luckyQuery.data)

  const typeTotalsPending = typeTotalsQuery.data == null && typeTotalsQuery.isLoading
  const typeTotalFp = (card: RewardsApiClaimView) =>
    sessionAmountFingerprint(
      sessionReady,
      typeTotalsPending,
      hubApiClaimableFromTypeTotals(card, typeTotalsQuery.data),
    )

  const genesisFp = sessionAmountFingerprint(
    sessionReady,
    teamQuery.data == null && teamQuery.isLoading,
    sessionReady
      ? Math.max(
          0,
          (parseApiAmount(teamQuery.data?.total) ?? 0) -
            (parseApiAmount(teamQuery.data?.claimed) ?? 0),
        )
      : null,
  )

  const lucky = useClaimableUnread(
    'rewards.lucky',
    luckyFp,
    onRewards && view === 'lucky',
    'balance',
  )
  const referral = useClaimableUnread(
    'rewards.referral',
    typeTotalFp('referral'),
    onRewards && view === 'referral',
    'balance',
  )
  const participate = useClaimableUnread(
    'rewards.participate',
    typeTotalFp('participate'),
    onRewards && view === 'participate',
    'balance',
  )
  const cobuild = useClaimableUnread(
    'rewards.cobuild',
    typeTotalFp('cobuild'),
    onRewards && view === 'cobuild',
    'balance',
  )
  const grant = useClaimableUnread(
    'rewards.grant',
    grantEligible ? typeTotalFp('grant') : '',
    onRewards && view === 'grant',
    'balance',
  )
  const genesis = useClaimableUnread(
    'rewards.genesis',
    genesisFp,
    onRewards && view === 'genesis',
    'balance',
  )

  return {
    lucky,
    referral,
    participate,
    cobuild,
    grant,
    genesis,
    rail: lucky || referral || participate || cobuild || grant || genesis,
  }
}

function snapshotFingerprint<T>(
  pending: boolean,
  data: T | undefined,
  toFingerprint: (value: T) => string,
): string | null {
  if (pending || data == null) return null
  return toFingerprint(data)
}

/**
 * 资产到期红点：定期质押 / 债券锁定期结束亮一次，点进仓位子页后不再亮。
 *
 * 活期与 X 挖矿暂不亮。查询键与资产 Hub / 持仓列表共用；钱包连上后任意 Tab 都拉。
 * 到期用该次链上查询的时间戳判定。侧栏点到 Hub 不记 ack。
 *
 * @see docs/onchain-manual/contracts/lockedstaking.md
 * @see docs/onchain-manual/contracts/bonddepository.md
 */
export function useAssetsClaimableUnreads(): {
  stake: boolean
  lpbond: boolean
  burnbond: boolean
  rail: boolean
} {
  const walletReady = useWalletReady()
  const activeTab = useDappHostStore((state) => state.activeTab)
  const view = useAssetsViewStore((state) => state.view)
  const onAssets = activeTab === 'assets'

  const stakeQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsStakePositions,
    queryFn: (addr) => readStakePositions(addr as Address),
    enabled: walletReady,
    refetchInterval: CLAIMABLE_DOT_POLL_MS,
    placeholderData: keepPreviousData,
  })
  const lpQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsBondPositions('lpbond'),
    queryFn: (addr) => readLpBondPositions(addr as Address),
    enabled: walletReady,
    refetchInterval: CLAIMABLE_DOT_POLL_MS,
    placeholderData: keepPreviousData,
  })
  const burnQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsBondPositions('burnbond'),
    queryFn: (addr) => readBurnBondPositions(addr as Address),
    enabled: walletReady,
    refetchInterval: CLAIMABLE_DOT_POLL_MS,
    placeholderData: keepPreviousData,
  })

  const stakeFp = snapshotFingerprint(stakeQuery.isPlaceholderData, stakeQuery.data, (rows) =>
    fingerprintAssetsStakeExpiry(rows, Math.floor(stakeQuery.dataUpdatedAt / 1000)),
  )
  const lpFp = snapshotFingerprint(lpQuery.isPlaceholderData, lpQuery.data, (rows) =>
    fingerprintAssetsBondExpiry(rows, Math.floor(lpQuery.dataUpdatedAt / 1000)),
  )
  const burnFp = snapshotFingerprint(burnQuery.isPlaceholderData, burnQuery.data, (rows) =>
    fingerprintAssetsBondExpiry(rows, Math.floor(burnQuery.dataUpdatedAt / 1000)),
  )

  const stake = useClaimableUnread('assets.stake', stakeFp, onAssets && view === 'stake', 'event')
  const lpbond = useClaimableUnread('assets.lpbond', lpFp, onAssets && view === 'lpbond', 'event')
  const burnbond = useClaimableUnread(
    'assets.burnbond',
    burnFp,
    onAssets && view === 'burnbond',
    'event',
  )

  return { stake, lpbond, burnbond, rail: stake || lpbond || burnbond }
}
