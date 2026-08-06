import { decodeFunctionResult, encodeFunctionData, parseAbi, zeroAddress } from 'viem'

import { selectLuckyClaimRound } from '~/core/rewards/select-lucky-claim-round'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import { DAILY_PURCHASE_TRACKER_METHODS, LUCKY_POOL_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { readErc20Balance } from '~/web3/exchange/exchange-read'
import { readAggregate3 } from '~/web3/multicall3-read'

const luckyAbi = parseAbi([
  LUCKY_POOL_METHODS.paused,
  LUCKY_POOL_METHODS.currentRoundId,
  LUCKY_POOL_METHODS.purchaseTracker,
  LUCKY_POOL_METHODS.isUserEligible,
  LUCKY_POOL_METHODS.getRound,
  LUCKY_POOL_METHODS.getWinnerInfo,
  LUCKY_POOL_METHODS.rewardClaimed,
])

const trackerAbi = parseAbi([DAILY_PURCHASE_TRACKER_METHODS.getUserRoundStat])

/** 回溯闭轮上限（手册：旧轮按 ID 可查；禁只看上一轮）。 */
const LUCKY_CLAIM_LOOKBACK = 10_000n

/** 用户幸运奖领取快照。 */
export type LuckyClaimSnapshot = {
  paused: boolean
  roundId: bigint
  won: boolean
  rewardAmount: bigint
  rewardClaimed: boolean
  claimable: boolean
}

/**
 * 读取用户可领的幸运奖快照。
 *
 * currentRoundId 为进行中轮，中奖发生在已关闭轮；从新到旧回溯（上限 10000 轮），
 * 取第一笔可领记录。每轮两读经 Multicall3（允许失败）。
 *
 * @param user 钱包地址
 * @param client 链读取客户端，默认 BSC 主网
 * @returns 暂停状态 / 选中轮 / 是否中奖 / 是否已领 / 是否可领
 * @see 手册 §14 LuckyPool 去中心化抽奖
 */
export async function readLuckyClaimSnapshot(
  user: Address,
  client: ChainReadClient = bscReadClient,
): Promise<LuckyClaimSnapshot> {
  const paused = Boolean(
    await client.readContract({
      address: BSC_CONTRACTS.luckyPool,
      abi: luckyAbi,
      functionName: 'paused',
    }),
  )
  const openRoundId = (await client.readContract({
    address: BSC_CONTRACTS.luckyPool,
    abi: luckyAbi,
    functionName: 'currentRoundId',
  })) as bigint

  // currentRoundId 为 Open；中奖在已关闭轮。从新到旧回溯，找第一笔可领。
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

  const pool = BSC_CONTRACTS.luckyPool
  const results =
    roundIds.length === 0
      ? []
      : await readAggregate3(
          client,
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

  const rows = []
  for (let i = 0; i < roundIds.length; i++) {
    const infoSlot = results[i * 2]
    const claimedSlot = results[i * 2 + 1]
    const roundId = roundIds[i]!
    if (!infoSlot?.success || !claimedSlot?.success) {
      rows.push({
        roundId,
        won: false,
        rewardAmount: 0n,
        rewardClaimed: false,
      })
      continue
    }
    const info = decodeFunctionResult({
      abi: luckyAbi,
      functionName: 'getWinnerInfo',
      data: infoSlot.returnData,
    }) as readonly [boolean, bigint]
    const rewardClaimed = Boolean(
      decodeFunctionResult({
        abi: luckyAbi,
        functionName: 'rewardClaimed',
        data: claimedSlot.returnData,
      }),
    )
    rows.push({
      roundId,
      won: Boolean(info[0]),
      rewardAmount: info[1] ?? 0n,
      rewardClaimed,
    })
  }

  const selected = selectLuckyClaimRound({ openRoundId, paused, rows })
  return {
    paused,
    roundId: selected.roundId,
    won: selected.won,
    rewardAmount: selected.rewardAmount,
    rewardClaimed: selected.rewardClaimed,
    claimable: selected.claimable,
  }
}

/**
 * 读取 DaoPool 可领奖励的独立偿付能力。
 *
 * Dao Mixed 无链上按用户的 pending，签名 amount 只是意图；这里读 DaoPool 持有的
 * AGX 余额作为偿付上限，签名金额不可直接当作可用。
 *
 * @param client 链读取客户端
 * @returns DaoPool 持有的 AGX 余额（wei）
 * @see docs/backend-api/api.md #claim/dao-reward
 */
export async function readDaoPoolRewardAvailable(client: ChainReadClient): Promise<bigint> {
  return readErc20Balance(BSC_CONTRACTS.agx, BSC_CONTRACTS.daoPool, client)
}

/** 幸运详情右栏：当前轮倒计时 + 迁移感知资格 + Tracker 轮内购买额（USD1 18dec）。 */
export type LuckyRoundDisplaySnapshot = {
  openRoundId: bigint
  endTimeSec: bigint
  eligible: boolean
  /** Tracker `totalAmount`；无 tracker 时 null */
  roundPurchaseUsd1: bigint | null
}

/**
 * 读取幸运详情右栏展示数据：当前轮倒计时 + 迁移感知资格 + Tracker 轮内购买额。
 *
 * @param user 钱包地址
 * @param client 链读取客户端，默认 BSC 主网
 * @returns 当前轮 id / 结束时间 / 资格 / 轮内购买额（USD1，18 位小数）
 * @see 手册 §14.1 用户抽奖页
 */
export async function readLuckyRoundDisplaySnapshot(
  user: Address,
  client: ChainReadClient = bscReadClient,
): Promise<LuckyRoundDisplaySnapshot> {
  const openRoundId = (await client.readContract({
    address: BSC_CONTRACTS.luckyPool,
    abi: luckyAbi,
    functionName: 'currentRoundId',
  })) as bigint

  // getRound：named struct 或位置元组（endTime = index 3）
  const roundRaw = await client.readContract({
    address: BSC_CONTRACTS.luckyPool,
    abi: luckyAbi,
    functionName: 'getRound',
    args: [openRoundId],
  })
  const endTimeSec =
    roundRaw != null && typeof roundRaw === 'object' && 'endTime' in roundRaw
      ? (roundRaw as { endTime: bigint }).endTime
      : ((roundRaw as readonly bigint[])[3] ?? 0n)

  const eligible = Boolean(
    await client.readContract({
      address: BSC_CONTRACTS.luckyPool,
      abi: luckyAbi,
      functionName: 'isUserEligible',
      args: [openRoundId, user],
    }),
  )

  let roundPurchaseUsd1: bigint | null = null
  const tracker = (await client.readContract({
    address: BSC_CONTRACTS.luckyPool,
    abi: luckyAbi,
    functionName: 'purchaseTracker',
  })) as Address
  if (tracker !== zeroAddress) {
    const stat = (await client.readContract({
      address: tracker,
      abi: trackerAbi,
      functionName: 'getUserRoundStat',
      args: [openRoundId, user],
    })) as readonly [bigint, boolean, bigint]
    roundPurchaseUsd1 = stat[0] ?? 0n
  }

  return {
    openRoundId,
    endTimeSec,
    eligible,
    roundPurchaseUsd1,
  }
}
