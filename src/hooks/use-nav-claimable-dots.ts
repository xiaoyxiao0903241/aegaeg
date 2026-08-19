import { keepPreviousData } from '@tanstack/react-query'

import {
  fingerprintLucky,
  fingerprintPositiveDecimal,
  fingerprintReleaseBuffer,
  fingerprintReleaseQueue,
} from '~/core/claimable-unread'
import { useMarketAllowanceSummary, useTeamRewardTotal } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useClaimableUnread } from '~/hooks/use-claimable-unread'
import { useDappHost } from '~/hooks/use-dapp-host'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { parseApiAmount } from '~/shared/presenters/format'
import { useDappHostStore } from '~/stores/dapp-host-store'
import { useExchangeViewStore } from '~/stores/exchange-view-store'
import { useReleaseViewStore } from '~/stores/release-view-store'
import { useRewardsViewStore } from '~/stores/rewards-view-store'
import { readTurbineClaimableFingerprint } from '~/web3/exchange/turbine-exchange-read'
import { readReleaseBufferSnapshot, readReleaseQueueSnapshot } from '~/web3/release/release-read'
import { readLuckyClaimSnapshot } from '~/web3/rewards/rewards-read'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

function useWalletReady(): boolean {
  return hasWalletAccount(useActiveAccount())
}

function genesisClaimableFingerprint(
  total: string | undefined,
  claimed: string | undefined,
): string {
  const remainder = Math.max(0, (parseApiAmount(total) ?? 0) - (parseApiAmount(claimed) ?? 0))
  return fingerprintPositiveDecimal(remainder)
}

/**
 * 兑换涡轮未读红点（导航与 Hub 卡共用查询键）。
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
  })
  return useClaimableUnread(
    'exchange.turbine',
    query.isPlaceholderData || query.data === undefined ? null : query.data,
    activeTab === 'exchange' && view === 'turbine',
  )
}

/**
 * 释放队列 / 缓冲池未读红点；导航为二者 OR。
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
    placeholderData: keepPreviousData,
  })
  const bufferQuery = useChainQuery({
    queryKey: queryKeys.chain.releaseBuffer,
    queryFn: (addr) => readReleaseBufferSnapshot(addr as Address),
    enabled: walletReady,
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
          agxAmount: bufferQuery.data.agx.totalAmount,
          gagxAmount: bufferQuery.data.gagx.totalAmount,
        })

  const queue = useClaimableUnread(
    'release.queue',
    queueFp,
    activeTab === 'release' && view === 'queue',
  )
  const buffer = useClaimableUnread(
    'release.buffer',
    bufferFp,
    activeTab === 'release' && view === 'buffer',
  )
  return { queue, buffer, rail: queue || buffer }
}

/**
 * 奖励未读红点：幸运 / 发展津贴 / 创世。
 *
 * 幸运回溯贵，仅在奖励 Tab 拉链；推荐 / 参与 / 共建 Hub 无预览可领额，不造点。
 *
 * @see docs/onchain-manual/contracts/aegisluckypool.md
 */
export function useRewardsClaimableUnreads(): {
  lucky: boolean
  grant: boolean
  genesis: boolean
  rail: boolean
} {
  const walletReady = useWalletReady()
  const { sessionReady } = useDappHost()
  const activeTab = useDappHostStore((state) => state.activeTab)
  const view = useRewardsViewStore((state) => state.view)
  const onRewards = activeTab === 'rewards'
  const account = useActiveAccount()
  const teamQuery = useTeamRewardTotal(sessionReady)
  const grantSummary = useMarketAllowanceSummary(sessionReady)
  const luckyQuery = useChainQuery({
    queryKey: queryKeys.chain.rewardsLuckyClaim,
    queryFn: (address) => readLuckyClaimSnapshot(address as Address),
    enabled: walletReady && onRewards && Boolean(account?.address),
    placeholderData: keepPreviousData,
  })

  const luckyFp =
    !walletReady || !onRewards
      ? ''
      : luckyQuery.isPlaceholderData || luckyQuery.data == null
        ? null
        : fingerprintLucky(luckyQuery.data)

  const grantFp = !sessionReady
    ? ''
    : grantSummary.data == null && grantSummary.isLoading
      ? null
      : fingerprintPositiveDecimal(parseApiAmount(grantSummary.data?.unlocked_claimable))

  const genesisFp = !sessionReady
    ? ''
    : teamQuery.data == null && teamQuery.isLoading
      ? null
      : genesisClaimableFingerprint(teamQuery.data?.total, teamQuery.data?.claimed)

  const lucky = useClaimableUnread('rewards.lucky', luckyFp, onRewards && view === 'lucky')
  const grant = useClaimableUnread('rewards.grant', grantFp, onRewards && view === 'grant')
  const genesis = useClaimableUnread('rewards.genesis', genesisFp, onRewards && view === 'genesis')

  return { lucky, grant, genesis, rail: lucky || grant || genesis }
}
