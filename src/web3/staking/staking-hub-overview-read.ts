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
import { isContractRevert } from '~/web3/decode-contract-revert'

const stakingPoolAbi = parseAbi([STAKING_POOL_METHODS.poolAgxBalance, STAKING_POOL_METHODS.epoch])
const sagxAbi = parseAbi([SAGX_METHODS.circulatingSupply, SAGX_METHODS.rebases])
const treasuryAbi = parseAbi([TREASURY_METHODS.totalReserves])
const burnSwapAbi = parseAbi([AGX_CONTRIBUTION_SWAP_METHODS.getConfig])

/** 指数探测上限：避免异常链上状态打爆 RPC。 */
const REBASES_PROBE_CAP = 1_048_576n

export type StakingHubOverview = {
  /** StakingPool.poolAgxBalance — AGX 9 decimals */
  poolAgxBalance: bigint
  /** sAGX.circulatingSupply — 9 decimals */
  circulatingSupply: bigint
  /** Treasury.totalReserves — AGX-value 9 decimals (manual treasury.md) */
  totalReserves: bigint
  /** AgxContributionSwap.getConfig().totalBurned — AGX 9 decimals */
  totalBurned: bigint
  /**
   * 最近一次 `sAGX.rebases[i].rebase`（1e18）；数组空 / 从未 rebase → null。
   * 注意：下标是 append 序，不是 `StakingPool.epoch().number`。
   */
  rebaseRate1e18: bigint | null
  epochNumber: bigint
  /** StakingPool.epoch().endBlock — for next-rebase countdown */
  epochEndBlock: bigint
  /** Chain head at read time (same RPC batch window) */
  currentBlock: bigint
}

async function readRebaseAt(
  client: ChainReadClient,
  index: bigint,
): Promise<readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint] | null> {
  try {
    return await client.readContract({
      address: BSC_CONTRACTS.sagx,
      abi: sagxAbi,
      functionName: 'rebases',
      args: [index],
    })
  } catch (error) {
    if (isContractRevert(error)) return null
    throw error
  }
}

/**
 * `rebases` 为 public 动态数组，无 length 视图。
 * 指数上探 + 二分找最后一个有效下标；空数组 → null。
 */
export async function readLatestSagxRebaseRate1e18(
  client: ChainReadClient = bscReadClient,
): Promise<bigint | null> {
  const zero = await readRebaseAt(client, 0n)
  if (zero == null) return null

  let lo = 0n
  let hi = 1n
  while (hi <= REBASES_PROBE_CAP) {
    const row = await readRebaseAt(client, hi)
    if (row == null) break
    lo = hi
    hi *= 2n
  }

  if (hi > REBASES_PROBE_CAP && (await readRebaseAt(client, hi)) != null) {
    const row = await readRebaseAt(client, lo)
    return row?.[1] ?? null
  }

  while (lo + 1n < hi) {
    const mid = (lo + hi) / 2n
    if ((await readRebaseAt(client, mid)) != null) lo = mid
    else hi = mid
  }

  const latest = await readRebaseAt(client, lo)
  return latest?.[1] ?? null
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
  const rebaseRate1e18 = await readLatestSagxRebaseRate1e18(client)

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
