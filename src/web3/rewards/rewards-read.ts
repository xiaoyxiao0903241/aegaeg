import { parseAbi, zeroAddress } from 'viem'

import { isLuckyClaimable } from '~/core/rewards/rewards-block-reasons'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import { DAILY_PURCHASE_TRACKER_METHODS, LUCKY_POOL_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { readErc20Balance } from '~/web3/exchange/exchange-read'

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

export type LuckyClaimSnapshot = {
  paused: boolean
  roundId: bigint
  won: boolean
  rewardAmount: bigint
  rewardClaimed: boolean
  claimable: boolean
}

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
  const roundId = (await client.readContract({
    address: BSC_CONTRACTS.luckyPool,
    abi: luckyAbi,
    functionName: 'currentRoundId',
  })) as bigint

  // Prefer previous closed round for winners: currentRoundId is Open; winners are on prior.
  const candidateRound = roundId > 0n ? roundId - 1n : 0n
  const info = (await client.readContract({
    address: BSC_CONTRACTS.luckyPool,
    abi: luckyAbi,
    functionName: 'getWinnerInfo',
    args: [candidateRound, user],
  })) as readonly [boolean, bigint]
  const rewardClaimed = Boolean(
    await client.readContract({
      address: BSC_CONTRACTS.luckyPool,
      abi: luckyAbi,
      functionName: 'rewardClaimed',
      args: [candidateRound, user],
    }),
  )
  const won = Boolean(info[0])
  const rewardAmount = info[1] ?? 0n
  return {
    paused,
    roundId: candidateRound,
    won,
    rewardAmount,
    rewardClaimed,
    claimable: isLuckyClaimable({ paused, won, rewardClaimed, rewardAmount }),
  }
}

/**
 * Dao Mixed has no per-user on-chain pending — signed `amount` is intent.
 * Independent solvency read: AGX held by DaoPool (never treat signature amount as available).
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
