import { encodeFunctionData, parseAbi } from 'viem'

import { mapLuckyRewardInfo } from '~/core/rewards/map-lucky-reward-info'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import { DAILY_PURCHASE_TRACKER_METHODS, LUCKY_POOL_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { readErc20Balance } from '~/web3/exchange/exchange-read'
import { decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'

const luckyAbi = parseAbi([
  LUCKY_POOL_METHODS.paused,
  LUCKY_POOL_METHODS.getRound,
  LUCKY_POOL_METHODS.isRoundAcceptingPurchases,
  LUCKY_POOL_METHODS.getRewardInfo,
])

const trackerAbi = parseAbi([DAILY_PURCHASE_TRACKER_METHODS.getCurrentRoundUserStat])

/** 用户幸运奖领取快照（累计账本，无轮次）。 */
export type LuckyClaimSnapshot = {
  paused: boolean
  won: boolean
  /** 待领取毛奖励 */
  rewardAmount: bigint
  /** 与 rewardAmount 相同；Hub / 领取面板展示 */
  totalUnclaimedAmount: bigint
  rewardClaimed: boolean
  claimable: boolean
}

/**
 * 读取用户可领的幸运奖快照。
 *
 * 待领金额来自 `getRewardInfo` 的 pending；领取不再按轮次。
 *
 * @param user 钱包地址
 * @returns 暂停 / 待领毛额 / 是否可领
 * @see LuckyPool.getRewardInfo
 */
export async function readLuckyClaimSnapshot(user: Address): Promise<LuckyClaimSnapshot> {
  const pool = BSC_CONTRACTS.luckyPool
  const results = await readAggregate3([
    {
      target: pool,
      callData: encodeFunctionData({ abi: luckyAbi, functionName: 'paused' }),
    },
    {
      target: pool,
      callData: encodeFunctionData({
        abi: luckyAbi,
        functionName: 'getRewardInfo',
        args: [user],
      }),
    },
  ])
  const paused = Boolean(
    decodeAggregate3Result<boolean>(
      results,
      0,
      luckyAbi,
      'paused',
      'LUCKY_SNAPSHOT_MULTICALL_FAILED:paused',
    ),
  )
  const info = decodeAggregate3Result<readonly [bigint, bigint, bigint]>(
    results,
    1,
    luckyAbi,
    'getRewardInfo',
    'LUCKY_SNAPSHOT_MULTICALL_FAILED:rewardInfo',
  )
  return mapLuckyRewardInfo({
    paused,
    accrued: info[0] ?? 0n,
    claimed: info[1] ?? 0n,
    pending: info[2] ?? 0n,
  })
}

/**
 * 读取 DaoPool 可领奖励的独立偿付能力。
 *
 * Dao Mixed 无链上按用户的 pending，签名 amount 只是意图；这里读 DaoPool 持有的
 * AGX 余额作为偿付上限，签名金额不可直接当作可用。
 *
 * @returns DaoPool 持有的 AGX 余额（wei）
 * @see docs/backend-api/api.md #claim/dao-reward
 */
export async function readDaoPoolRewardAvailable(): Promise<bigint> {
  return readErc20Balance(BSC_CONTRACTS.agx, BSC_CONTRACTS.daoPool)
}

/** 幸运详情右栏：当前轮倒计时 + Tracker 资格 / 购买额（USD1 18dec）。 */
export type LuckyRoundDisplaySnapshot = {
  openRoundId: bigint
  endTimeSec: bigint
  eligible: boolean
  /** Tracker `totalAmount`；无开放轮时 null */
  roundPurchaseUsd1: bigint | null
  /** `isRoundAcceptingPurchases`；不能只看 Open */
  accepting: boolean
}

function luckyRoundEndTimeSec(roundRaw: unknown): bigint {
  if (roundRaw != null && typeof roundRaw === 'object' && 'endTime' in roundRaw) {
    return (roundRaw as { endTime: bigint }).endTime
  }
  return (roundRaw as readonly bigint[])[3] ?? 0n
}

/**
 * 读取幸运详情右栏：Tracker 本轮统计 + 是否接受购买 + 结束时间。
 *
 * 未激活时 `getCurrentRoundUserStat.roundId == 0`，不再读 `getRound`。
 * 资格用 Tracker `qualified`（单笔门槛、迁移感知），不以 `status=Open` 代替时间窗。
 *
 * @param user 钱包地址
 * @returns 当前轮 id / 结束时间 / 资格 / 轮内购买额 / 是否接受购买
 * @see 手册 §14.1 用户抽奖页
 */
export async function readLuckyRoundDisplaySnapshot(
  user: Address,
): Promise<LuckyRoundDisplaySnapshot> {
  const stat = (await bscReadClient.readContract({
    address: BSC_CONTRACTS.dailyPurchaseTracker,
    abi: trackerAbi,
    functionName: 'getCurrentRoundUserStat',
    args: [user],
  })) as readonly [bigint, bigint, boolean, bigint]

  const openRoundId = stat[0] ?? 0n
  const totalAmount = stat[1] ?? 0n
  const qualified = Boolean(stat[2])
  if (openRoundId === 0n) {
    return {
      openRoundId: 0n,
      endTimeSec: 0n,
      eligible: false,
      roundPurchaseUsd1: null,
      accepting: false,
    }
  }

  const pool = BSC_CONTRACTS.luckyPool
  const roundResults = await readAggregate3([
    {
      target: pool,
      callData: encodeFunctionData({
        abi: luckyAbi,
        functionName: 'getRound',
        args: [openRoundId],
      }),
    },
    {
      target: pool,
      callData: encodeFunctionData({
        abi: luckyAbi,
        functionName: 'isRoundAcceptingPurchases',
        args: [openRoundId],
      }),
    },
  ])
  const roundRaw = decodeAggregate3Result<unknown>(
    roundResults,
    0,
    luckyAbi,
    'getRound',
    'LUCKY_DISPLAY_MULTICALL_FAILED:getRound',
  )
  const accepting = decodeAggregate3Result<boolean>(
    roundResults,
    1,
    luckyAbi,
    'isRoundAcceptingPurchases',
    'LUCKY_DISPLAY_MULTICALL_FAILED:accepting',
  )

  return {
    openRoundId,
    endTimeSec: luckyRoundEndTimeSec(roundRaw),
    eligible: qualified,
    roundPurchaseUsd1: totalAmount,
    accepting: Boolean(accepting),
  }
}
