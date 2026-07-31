import { parseAbi } from 'viem'
import { BSC_CONTRACTS, type Address } from '~/shared/config/contracts'
import { LUCKY_POOL_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { isLuckyClaimable } from '~/core/rewards/rewards-gates'
import { readErc20Balance } from '~/web3/exchange/exchange-read'

const luckyAbi = parseAbi([
  LUCKY_POOL_METHODS.paused,
  LUCKY_POOL_METHODS.currentRoundId,
  LUCKY_POOL_METHODS.getWinnerInfo,
  LUCKY_POOL_METHODS.rewardClaimed,
])

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
