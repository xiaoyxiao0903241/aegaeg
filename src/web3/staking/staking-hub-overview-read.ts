import { parseAbi } from 'viem'

import { BSC_BLOCK_SECONDS } from '~/core/staking/format-rebase-countdown'
import { epochsPerDayFromLength } from '~/core/staking/staking-yield'
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

/** 用最近 N 块时间戳差估出块秒数；样本不足或非法时回落 FAQ 兜底。 */
const BLOCK_TIME_SAMPLE = 8

export type StakingHubOverview = {
  /** StakingPool.poolAgxBalance — AGX 9 decimals */
  poolAgxBalance: bigint
  /** sAGX.circulatingSupply — 9 decimals */
  circulatingSupply: bigint
  /** Treasury.totalReserves — AGX 口径储备价值（9 decimals）；Hub 展示折为 USD1。 */
  totalReserves: bigint
  /** AgxContributionSwap.getConfig().totalBurned — AGX 9 decimals */
  totalBurned: bigint
  /**
   * 最近一次 `sAGX.rebases[i].rebase`（1e18）；数组空 / 从未 rebase → null。
   * 注意：下标是 append 序，不是 `StakingPool.epoch().number`。
   */
  rebaseRate1e18: bigint | null
  epochNumber: bigint
  /** StakingPool.epoch().endBlock — 下次 rebase 倒计时用。 */
  epochEndBlock: bigint
  /** 读取时的链头高度（同一 RPC 批次窗口）。 */
  currentBlock: bigint
  /** 近窗实测出块秒数；失败回落 BSC_BLOCK_SECONDS。 */
  secondsPerBlock: number
  /** 由 epoch.length × secondsPerBlock 推算；失败回落 FAQ 默认 2。 */
  epochsPerDay: number
}

/**
 * 近窗块时间戳 → 秒/块。
 *
 * @param client 链上读取客户端
 * @param latest 链头高度
 * @param sampleBlocks 采样跨度（块数）
 * @returns 平均秒/块；样本不足或非法回落 BSC_BLOCK_SECONDS
 */
async function measureSecondsPerBlock(
  client: ChainReadClient,
  latest: bigint,
  sampleBlocks: number = BLOCK_TIME_SAMPLE,
): Promise<number> {
  if (sampleBlocks <= 0 || latest < BigInt(sampleBlocks)) return BSC_BLOCK_SECONDS
  const older = latest - BigInt(sampleBlocks)
  const [oldBlock, newBlock] = await Promise.all([
    client.getBlock({ blockNumber: older }),
    client.getBlock({ blockNumber: latest }),
  ])
  const dt = Number(newBlock.timestamp - oldBlock.timestamp)
  if (!(dt > 0) || !Number.isFinite(dt)) return BSC_BLOCK_SECONDS
  const perBlock = dt / sampleBlocks
  return Number.isFinite(perBlock) && perBlock > 0 ? perBlock : BSC_BLOCK_SECONDS
}

/**
 * 读取 `rebases[i]` 整行数据
 *
 * `rebases` 为 public 动态数组，越界下标会 revert，
 * 因此把合约 revert 视为「该下标尚不存在」并返回 null。
 *
 * @param client 链上读取客户端
 * @param index 数组下标
 * @returns 七字段行数据；越界 / 从未 rebase → null
 */
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
 * 读取最近一次 rebase 率（1e18 标度）
 *
 * `rebases` 是 public 动态数组且没有 length 视图，故用指数上探 + 二分
 * 找最后一个有效下标；数组为空时直接返回 null。下标是 append 序，
 * 不等于 `StakingPool.epoch().number`。
 *
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 最近一次 rebase 值（1e18）；从未 rebase → null
 * @see docs/onchain-manual/contracts/sagx.md
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
 * 质押中心页概览的链上聚合读取
 *
 * 一次并行读取质押池 AGX 余额、当前 epoch、sAGX 流通量、国库总储备、
 * 销毁配置与链头高度，并补读最近 rebase 率，供公开数据区展示。
 * 无钱包依赖；资金维持时长 / 周期表 APY / 图表历史因无数据源保持 0。
 *
 * @param client 链上读取客户端，默认公共 RPC
 * @returns StakingHubOverview 聚合结果
 * @see 手册 §8 质押 Staking
 * @see docs/onchain-manual/contracts/stakingpool.md
 * @see docs/onchain-manual/contracts/sagx.md
 * @see docs/onchain-manual/contracts/treasury.md
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

  // ABI: (length, number, endBlock, distribute) — 勿把 length 当 number。
  const epochLength = epoch[0]
  const epochNumber = epoch[1]
  const epochEndBlock = epoch[2]
  const totalBurned = burnConfig[6]
  const [rebaseRate1e18, secondsPerBlock] = await Promise.all([
    readLatestSagxRebaseRate1e18(client),
    measureSecondsPerBlock(client, currentBlock),
  ])
  const epochsPerDay = epochsPerDayFromLength(epochLength, secondsPerBlock) ?? 2

  return {
    poolAgxBalance,
    circulatingSupply,
    totalReserves,
    totalBurned,
    rebaseRate1e18,
    epochNumber,
    epochEndBlock,
    currentBlock,
    secondsPerBlock,
    epochsPerDay,
  }
}
