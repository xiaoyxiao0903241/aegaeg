import { encodeFunctionData, parseAbi } from 'viem'

import {
  epochsPerDayFromLength,
  rebase1e18FromPpm,
  YIELD_EPOCHS_PER_DAY,
} from '~/core/staking/staking-yield'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { BSC_BLOCK_SECONDS } from '~/shared/lib/constants'
import {
  AGX_CONTRIBUTION_SWAP_METHODS,
  REWARD_MANAGER_METHODS,
  SAGX_METHODS,
  STAKING_POOL_METHODS,
  TREASURY_METHODS,
} from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'

const stakingPoolAbi = parseAbi([STAKING_POOL_METHODS.poolAgxBalance, STAKING_POOL_METHODS.epoch])
const sagxAbi = parseAbi([SAGX_METHODS.circulatingSupply])
const treasuryAbi = parseAbi([TREASURY_METHODS.totalReserves])
const burnSwapAbi = parseAbi([AGX_CONTRIBUTION_SWAP_METHODS.getConfig])
const rewardManagerAbi = parseAbi([REWARD_MANAGER_METHODS.baseRewardRate])

export type StakingHubOverview = {
  /** StakingPool.poolAgxBalance — AGX 9 decimals */
  poolAgxBalance: bigint
  /** sAGX.circulatingSupply — 9 decimals */
  circulatingSupply: bigint
  /** Treasury.totalReserves — AGX 口径储备价值（9 decimals）；Hub 展示折为 USD1。 */
  totalReserves: bigint
  /** AgxContributionSwap.getConfig().totalBurned — AGX 9 decimals */
  totalBurned: bigint
  epochNumber: bigint
  /** StakingPool.epoch().endBlock — 下次 rebase 倒计时用。 */
  epochEndBlock: bigint
  /** StakingPool.epoch().length — 单 epoch 区块数（文案 / 日频推算同源）。 */
  epochLengthBlocks: bigint
  /** 读取时的链头高度（同一 RPC 批次窗口）。 */
  currentBlock: bigint
  /** 出块秒数；展示用手册缺省，不拉历史块。 */
  secondsPerBlock: number
  /** 由 epoch.length × secondsPerBlock 推算；失败为 null。 */
  epochsPerDay: number | null
}

export type SagxRebaseSnapshot = {
  /** RewardManager.baseRewardRate 换成 1e18 分数；供现有百分数换算 */
  rebaseRate1e18: bigint | null
  /** 日收益固定 ×2，不是链上 epoch.length 推算 */
  epochsPerDay: number
}

/**
 * 读取配置的基础 Rebase 率（ppm）与展示用日频 2。
 *
 * @returns 1e18 分数 + 每日 2 次；读失败抛错
 * @see docs/onchain-manual/contracts/rewardmanager.md
 */
export async function readLatestSagxRebaseRate(): Promise<SagxRebaseSnapshot> {
  const ppm = (await bscReadClient.readContract({
    address: BSC_CONTRACTS.rewardManager,
    abi: rewardManagerAbi,
    functionName: 'baseRewardRate',
  })) as bigint
  return {
    rebaseRate1e18: rebase1e18FromPpm(ppm),
    epochsPerDay: YIELD_EPOCHS_PER_DAY,
  }
}

/**
 * 质押中心页概览的链上聚合读取
 *
 * 一次并行读取质押池 AGX 余额、当前 epoch、sAGX 流通量、国库总储备、
 * 销毁配置与链头高度。rebase 率走独立查询。
 * 无钱包依赖；资金维持时长 / 周期表 APY / 图表历史因无数据源保持 0。
 *
 * @returns StakingHubOverview 聚合结果
 * @see 手册 §8 质押 Staking
 * @see docs/onchain-manual/contracts/stakingpool.md
 * @see docs/onchain-manual/contracts/sagx.md
 * @see docs/onchain-manual/contracts/treasury.md
 */
export async function readStakingHubOverview(): Promise<StakingHubOverview> {
  const [overviewResults, currentBlock] = await Promise.all([
    readAggregate3([
      {
        target: BSC_CONTRACTS.stakingPool,
        callData: encodeFunctionData({ abi: stakingPoolAbi, functionName: 'poolAgxBalance' }),
      },
      {
        target: BSC_CONTRACTS.stakingPool,
        callData: encodeFunctionData({ abi: stakingPoolAbi, functionName: 'epoch' }),
      },
      {
        target: BSC_CONTRACTS.sagx,
        callData: encodeFunctionData({ abi: sagxAbi, functionName: 'circulatingSupply' }),
      },
      {
        target: BSC_CONTRACTS.treasury,
        callData: encodeFunctionData({ abi: treasuryAbi, functionName: 'totalReserves' }),
      },
      {
        target: BSC_CONTRACTS.agxContributionSwap,
        callData: encodeFunctionData({ abi: burnSwapAbi, functionName: 'getConfig' }),
      },
    ]),
    bscReadClient.getBlockNumber(),
  ])

  const poolAgxBalance = decodeAggregate3Result<bigint>(
    overviewResults,
    0,
    stakingPoolAbi,
    'poolAgxBalance',
    'STAKING_HUB_MULTICALL_FAILED:poolAgxBalance',
  )
  const epoch = decodeAggregate3Result<readonly [bigint, bigint, bigint, bigint]>(
    overviewResults,
    1,
    stakingPoolAbi,
    'epoch',
    'STAKING_HUB_MULTICALL_FAILED:epoch',
  )
  const circulatingSupply = decodeAggregate3Result<bigint>(
    overviewResults,
    2,
    sagxAbi,
    'circulatingSupply',
    'STAKING_HUB_MULTICALL_FAILED:circulatingSupply',
  )
  const totalReserves = decodeAggregate3Result<bigint>(
    overviewResults,
    3,
    treasuryAbi,
    'totalReserves',
    'STAKING_HUB_MULTICALL_FAILED:totalReserves',
  )
  const burnConfig = decodeAggregate3Result<
    readonly [string, number, bigint, boolean, bigint, bigint, bigint, bigint]
  >(overviewResults, 4, burnSwapAbi, 'getConfig', 'STAKING_HUB_MULTICALL_FAILED:burnConfig')

  // ABI: (length, number, endBlock, distribute) — 勿把 length 当 number。
  const epochLength = epoch[0]
  const epochNumber = epoch[1]
  const epochEndBlock = epoch[2]
  const totalBurned = burnConfig[6]
  const secondsPerBlock = BSC_BLOCK_SECONDS
  const epochsPerDay = epochsPerDayFromLength(epochLength, secondsPerBlock)

  return {
    poolAgxBalance,
    circulatingSupply,
    totalReserves,
    totalBurned,
    epochNumber,
    epochEndBlock,
    epochLengthBlocks: epochLength,
    currentBlock,
    secondsPerBlock,
    epochsPerDay,
  }
}
