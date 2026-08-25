import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'

import { mapLuckyClaimMulticallRow } from '~/core/rewards/map-lucky-claim-multicall-row'
import { isLuckyClaimable } from '~/core/rewards/rewards-block-reasons'
import { selectLuckyUnclaimedWins } from '~/core/rewards/select-lucky-unclaimed-wins'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import { DAILY_PURCHASE_TRACKER_METHODS, LUCKY_POOL_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { readErc20Balance } from '~/web3/exchange/exchange-read'
import { decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'

const luckyAbi = parseAbi([
  LUCKY_POOL_METHODS.paused,
  LUCKY_POOL_METHODS.currentRoundId,
  LUCKY_POOL_METHODS.getRound,
  LUCKY_POOL_METHODS.isRoundAcceptingPurchases,
  LUCKY_POOL_METHODS.getWinnerInfo,
  LUCKY_POOL_METHODS.rewardClaimed,
])

const trackerAbi = parseAbi([DAILY_PURCHASE_TRACKER_METHODS.getCurrentRoundUserStat])

/** 回溯闭轮上限（按 roundId 读中奖；禁扫全链日志）。 */
const LUCKY_CLAIM_LOOKBACK = 10_000n

/** 用户幸运奖领取快照。 */
export type LuckyClaimSnapshot = {
  paused: boolean
  /** 最新一笔未领轮（兼容；批量领取用 unclaimedRounds） */
  roundId: bigint
  won: boolean
  /** 最新一笔未领奖额（兼容） */
  rewardAmount: bigint
  /** 全部未领奖额合计（Hub / 领取面板展示） */
  totalUnclaimedAmount: bigint
  /** 未领轮（roundId 降序），提交时逐轮 claimRewardMixed */
  unclaimedRounds: readonly { roundId: bigint; rewardAmount: bigint }[]
  rewardClaimed: boolean
  claimable: boolean
}

/**
 * 读取用户可领的幸运奖快照。
 *
 * `currentRoundId` 为进行中轮；对已关轮 Multicall `getWinnerInfo`（+ `rewardClaimed`，
 * 失败按未领）筛出中奖轮后加总未领。`roundId`/`rewardAmount` 为最新一笔未领。
 *
 * @param user 钱包地址
 * @returns 暂停 / 下一笔轮 / 合计未领 / 是否可领
 * @see 手册 §14 LuckyPool 去中心化抽奖
 */
export async function readLuckyClaimSnapshot(user: Address): Promise<LuckyClaimSnapshot> {
  const pool = BSC_CONTRACTS.luckyPool
  const head = await readAggregate3([
    {
      target: pool,
      callData: encodeFunctionData({ abi: luckyAbi, functionName: 'paused' }),
    },
    {
      target: pool,
      callData: encodeFunctionData({ abi: luckyAbi, functionName: 'currentRoundId' }),
    },
  ])
  const paused = Boolean(
    decodeAggregate3Result<boolean>(
      head,
      0,
      luckyAbi,
      'paused',
      'LUCKY_SNAPSHOT_MULTICALL_FAILED:paused',
    ),
  )
  const openRoundId = decodeAggregate3Result<bigint>(
    head,
    1,
    luckyAbi,
    'currentRoundId',
    'LUCKY_SNAPSHOT_MULTICALL_FAILED:roundId',
  )

  const latestClosed = openRoundId > 0n ? openRoundId - 1n : 0n
  const oldest =
    latestClosed === 0n
      ? 0n
      : latestClosed > LUCKY_CLAIM_LOOKBACK
        ? latestClosed - LUCKY_CLAIM_LOOKBACK + 1n
        : 1n

  const roundIds: bigint[] = []
  if (latestClosed > 0n) {
    for (let id = latestClosed; id >= oldest; id--) {
      roundIds.push(id)
      if (id === 0n) break
    }
  }

  const results =
    roundIds.length === 0
      ? []
      : await readAggregate3(
          roundIds.flatMap((roundId) => [
            {
              target: pool,
              allowFailure: true,
              callData: encodeFunctionData({
                abi: luckyAbi,
                functionName: 'getWinnerInfo',
                args: [roundId, user],
              }),
            },
            {
              target: pool,
              allowFailure: true,
              callData: encodeFunctionData({
                abi: luckyAbi,
                functionName: 'rewardClaimed',
                args: [roundId, user],
              }),
            },
          ]),
        )

  const wins: { roundId: bigint; rewardAmount: bigint }[] = []
  const claimedRoundIds = new Set<bigint>()
  for (let i = 0; i < roundIds.length; i++) {
    const infoSlot = results[i * 2]
    const claimedSlot = results[i * 2 + 1]
    const roundId = roundIds[i]!
    const infoOk = Boolean(infoSlot?.success)
    const claimedOk = Boolean(claimedSlot?.success)
    const info = infoOk
      ? (decodeFunctionResult({
          abi: luckyAbi,
          functionName: 'getWinnerInfo',
          data: infoSlot!.returnData,
        }) as readonly [boolean, bigint])
      : null
    const rewardClaimed = claimedOk
      ? Boolean(
          decodeFunctionResult({
            abi: luckyAbi,
            functionName: 'rewardClaimed',
            data: claimedSlot!.returnData,
          }),
        )
      : false
    const row = mapLuckyClaimMulticallRow({
      roundId,
      infoOk,
      won: Boolean(info?.[0]),
      rewardAmount: info?.[1] ?? 0n,
      claimedOk,
      rewardClaimed,
    })
    if (row.won && row.rewardAmount > 0n) {
      wins.push({ roundId: row.roundId, rewardAmount: row.rewardAmount })
      if (row.rewardClaimed) claimedRoundIds.add(row.roundId)
    }
  }

  const selected = selectLuckyUnclaimedWins({ paused, wins, claimedRoundIds })
  return {
    paused,
    roundId: selected.roundId,
    won: selected.won,
    rewardAmount: selected.rewardAmount,
    totalUnclaimedAmount: selected.totalUnclaimedAmount,
    unclaimedRounds: selected.unclaimedRounds,
    rewardClaimed: selected.rewardClaimed,
    claimable: selected.claimable,
  }
}

/**
 * 读取指定轮的幸运奖状态（提交 live 重闸用）。
 *
 * 展示层已选出可领轮后，提交不得再全量回溯换轮；只重读该轮 winner / claimed / paused，
 * 贡献门槛按该轮金额计算，避免意图与上链轮次错配。
 * `rewardClaimed` 允许失败并按未领处理（与快照读一致）。
 *
 * @param user 钱包地址
 * @param roundId 意图轮次
 * @returns 该轮暂停 / 中奖 / 金额 / 是否已领 / 是否可领
 * @see 手册 §14 LuckyPool 去中心化抽奖
 */
export async function readLuckyClaimRound(
  user: Address,
  roundId: bigint,
): Promise<LuckyClaimSnapshot> {
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
        functionName: 'getWinnerInfo',
        args: [roundId, user],
      }),
    },
    {
      target: pool,
      allowFailure: true,
      callData: encodeFunctionData({
        abi: luckyAbi,
        functionName: 'rewardClaimed',
        args: [roundId, user],
      }),
    },
  ])
  const paused = Boolean(
    decodeAggregate3Result<boolean>(
      results,
      0,
      luckyAbi,
      'paused',
      'LUCKY_ROUND_MULTICALL_FAILED:paused',
    ),
  )
  const info = decodeAggregate3Result<readonly [boolean, bigint]>(
    results,
    1,
    luckyAbi,
    'getWinnerInfo',
    'LUCKY_ROUND_MULTICALL_FAILED:winner',
  )
  const claimedSlot = results[2]
  const claimedOk = Boolean(claimedSlot?.success)
  const rewardClaimedRaw = claimedOk
    ? Boolean(
        decodeFunctionResult({
          abi: luckyAbi,
          functionName: 'rewardClaimed',
          data: claimedSlot!.returnData,
        }),
      )
    : false
  const row = mapLuckyClaimMulticallRow({
    roundId,
    infoOk: true,
    won: Boolean(info[0]),
    rewardAmount: info[1] ?? 0n,
    claimedOk,
    rewardClaimed: rewardClaimedRaw,
  })
  const claimable = isLuckyClaimable({
    paused: Boolean(paused),
    won: row.won,
    rewardClaimed: row.rewardClaimed,
    rewardAmount: row.rewardAmount,
  })
  return {
    paused: Boolean(paused),
    roundId,
    won: row.won,
    rewardAmount: row.rewardAmount,
    totalUnclaimedAmount: claimable ? row.rewardAmount : 0n,
    unclaimedRounds: claimable ? [{ roundId, rewardAmount: row.rewardAmount }] : [],
    rewardClaimed: row.rewardClaimed,
    claimable,
  }
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
