import { parseAbi } from 'viem'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  AGX_CONTRIBUTION_SWAP_METHODS,
  SAGX_METHODS,
  STAKING_POOL_METHODS,
  TREASURY_METHODS,
} from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

const stakingPoolAbi = parseAbi([STAKING_POOL_METHODS.poolAgxBalance, STAKING_POOL_METHODS.epoch])
const sagxAbi = parseAbi([SAGX_METHODS.circulatingSupply, SAGX_METHODS.rebases])
const treasuryAbi = parseAbi([TREASURY_METHODS.totalReserves])
const burnSwapAbi = parseAbi([AGX_CONTRIBUTION_SWAP_METHODS.getConfig])

export type StakingHubOverview = {
  /** StakingPool.poolAgxBalance — AGX 9 decimals */
  poolAgxBalance: bigint
  /** sAGX.circulatingSupply — 9 decimals */
  circulatingSupply: bigint
  /** Treasury.totalReserves — AGX-value 9 decimals (manual treasury.md) */
  totalReserves: bigint
  /** AgxContributionSwap.getConfig().totalBurned — AGX 9 decimals */
  totalBurned: bigint
  /** Latest sAGX.rebases(epoch).rebase — 1e18 basis; null if no epoch yet */
  rebaseRate1e18: bigint | null
  epochNumber: bigint
  /** StakingPool.epoch().endBlock — for next-rebase countdown */
  epochEndBlock: bigint
  /** Chain head at read time (same RPC batch window) */
  currentBlock: bigint
}

/**
 * Hub overview chain reads (manual §8 / stakingpool / sagx / treasury / §9 burn).
 * Public — no wallet. Runway / period-table APY / chart history stay honest 0 (no source).
 */
export async function readStakingHubOverview(
  client: ChainReadClient = bscReadClient,
): Promise<StakingHubOverview> {
  const [poolAgxBalance, epoch, circulatingSupply, totalReserves, burnConfig, currentBlock] =
    await Promise.all([
      client.readContract({
        address: BSC_CONTRACTS.stakingPool,
        abi: stakingPoolAbi,
        functionName: 'poolAgxBalance',
      }),
      client.readContract({
        address: BSC_CONTRACTS.stakingPool,
        abi: stakingPoolAbi,
        functionName: 'epoch',
      }),
      client.readContract({
        address: BSC_CONTRACTS.sagx,
        abi: sagxAbi,
        functionName: 'circulatingSupply',
      }),
      client.readContract({
        address: BSC_CONTRACTS.treasury,
        abi: treasuryAbi,
        functionName: 'totalReserves',
      }),
      client.readContract({
        address: BSC_CONTRACTS.agxContributionSwap,
        abi: burnSwapAbi,
        functionName: 'getConfig',
      }),
      client.getBlockNumber(),
    ])

  const epochNumber = epoch[0]
  const epochEndBlock = epoch[1]
  const totalBurned = burnConfig[6]

  let rebaseRate1e18: bigint | null = null
  if (epochNumber > 0n) {
    const rebaseRow = await client.readContract({
      address: BSC_CONTRACTS.sagx,
      abi: sagxAbi,
      functionName: 'rebases',
      args: [epochNumber],
    })
    rebaseRate1e18 = rebaseRow[1]
    if (rebaseRate1e18 === 0n && epochNumber > 1n) {
      const prev = await client.readContract({
        address: BSC_CONTRACTS.sagx,
        abi: sagxAbi,
        functionName: 'rebases',
        args: [epochNumber - 1n],
      })
      rebaseRate1e18 = prev[1]
    }
  }

  return {
    poolAgxBalance,
    circulatingSupply,
    totalReserves,
    totalBurned,
    rebaseRate1e18,
    epochNumber,
    epochEndBlock,
    currentBlock,
  }
}
