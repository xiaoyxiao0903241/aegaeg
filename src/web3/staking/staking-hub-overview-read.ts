import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'

import { epochsPerDayFromLength } from '~/core/staking/staking-yield'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { BSC_BLOCK_SECONDS } from '~/shared/lib/constants'
import {
  AGX_CONTRIBUTION_SWAP_METHODS,
  SAGX_METHODS,
  STAKING_POOL_METHODS,
  TREASURY_METHODS,
} from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'

const stakingPoolAbi = parseAbi([STAKING_POOL_METHODS.poolAgxBalance, STAKING_POOL_METHODS.epoch])
const sagxAbi = parseAbi([SAGX_METHODS.circulatingSupply, SAGX_METHODS.rebases])
const treasuryAbi = parseAbi([TREASURY_METHODS.totalReserves])
const burnSwapAbi = parseAbi([AGX_CONTRIBUTION_SWAP_METHODS.getConfig])

/** 缓存上次有效 rebase 下标，避免 Hub 每次从 0 倍增探测。 */
let latestRebaseIndex: bigint | null = null

const REBASE_INDEX_KEY = 'aegis:sagxRebaseIndex'

const REBASE_PROBE_POWERS: bigint[] = [0n]
for (let exp = 0; exp <= 20; exp += 1) REBASE_PROBE_POWERS.push(1n << BigInt(exp))

function persistRebaseIndex(index: bigint) {
  latestRebaseIndex = index
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(REBASE_INDEX_KEY, index.toString())
  } catch {
    /* private mode */
  }
}

function seedRebaseIndex(): bigint | null {
  if (latestRebaseIndex != null) return latestRebaseIndex
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(REBASE_INDEX_KEY)
    if (raw == null || raw === '') return null
    const n = BigInt(raw)
    return n >= 0n ? n : null
  } catch {
    return null
  }
}

/** 测试辅助：清空 rebase 下标进程缓存。 */
export function clearLatestSagxRebaseIndexCache() {
  latestRebaseIndex = null
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.removeItem(REBASE_INDEX_KEY)
  } catch {
    /* private mode */
  }
}

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

type RebaseRow = readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint]

const HINT_WINDOW = 64n
const FILL_CHUNK = 256n

/** 一次 multicall 读若干下标；越界槽为 null。 */
async function readRebaseAtMany(indices: readonly bigint[]): Promise<(RebaseRow | null)[]> {
  if (indices.length === 0) return []
  const results = await readAggregate3(
    indices.map((index) => ({
      target: BSC_CONTRACTS.sagx,
      allowFailure: true,
      callData: encodeFunctionData({
        abi: sagxAbi,
        functionName: 'rebases',
        args: [index],
      }),
    })),
  )
  return results.map((slot) => {
    if (!slot?.success || slot.returnData === '0x') return null
    try {
      return decodeFunctionResult({
        abi: sagxAbi,
        functionName: 'rebases',
        data: slot.returnData,
      }) as RebaseRow
    } catch {
      return null
    }
  })
}

function uniqueSortedIndices(values: readonly bigint[]): bigint[] {
  const seen = new Set<string>()
  const out: bigint[] = []
  for (const value of values) {
    if (value < 0n) continue
    const key = value.toString()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(value)
  }
  out.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  return out
}

function pickLatest(
  indices: readonly bigint[],
  rows: readonly (RebaseRow | null)[],
): { index: bigint; row: RebaseRow } | null {
  let best: { index: bigint; row: RebaseRow } | null = null
  for (let i = 0; i < indices.length; i += 1) {
    const row = rows[i]
    const index = indices[i]
    if (row == null || index == null) continue
    if (best == null || index > best.index) best = { index, row }
  }
  return best
}

function hintWindow(seed: bigint): bigint[] {
  const out: bigint[] = []
  for (let d = 0n; d <= HINT_WINDOW; d += 1n) {
    if (seed >= d) out.push(seed - d)
    out.push(seed + d)
  }
  return out
}

function rangeInclusive(from: bigint, to: bigint): bigint[] {
  const out: bigint[] = []
  for (let i = from; i <= to; i += 1n) out.push(i)
  return out
}

/** 缺口一次并行打满（分块 multicall），在返回值里取最大下标。 */
async function fillLatestInRange(
  from: bigint,
  to: bigint,
): Promise<{ index: bigint; row: RebaseRow } | null> {
  if (from > to) return null
  const chunks: Promise<(RebaseRow | null)[]>[] = []
  const chunkIndices: bigint[][] = []
  for (let start = from; start <= to; start += FILL_CHUNK) {
    const end = start + FILL_CHUNK - 1n > to ? to : start + FILL_CHUNK - 1n
    const indices = rangeInclusive(start, end)
    chunkIndices.push(indices)
    chunks.push(readRebaseAtMany(indices))
  }
  const parts = await Promise.all(chunks)
  let best: { index: bigint; row: RebaseRow } | null = null
  for (let c = 0; c < parts.length; c += 1) {
    const hit = pickLatest(chunkIndices[c]!, parts[c]!)
    if (hit != null && (best == null || hit.index > best.index)) best = hit
  }
  return best
}

/**
 * 读取最近一次 rebase 率（1e18 标度）
 *
 * 一次 multicall：2^k 定界 + hint 窗口。在成功槽里取最大下标；
 * 若下一条未在本批证明缺席，再并行填满 (max, nextFail) 后取最大。
 *
 * @param hintIndex 可选探测起点（通常为当前 epoch.number）
 * @returns 最近一次 rebase 值（1e18）；从未 rebase → null
 * @see docs/onchain-manual/contracts/sagx.md
 */
export async function readLatestSagxRebaseRate1e18(hintIndex?: bigint): Promise<bigint | null> {
  const seed = seedRebaseIndex() ?? (hintIndex != null && hintIndex >= 0n ? hintIndex : null)
  const firstIndices = uniqueSortedIndices([
    ...REBASE_PROBE_POWERS,
    ...(seed != null ? hintWindow(seed) : []),
  ])
  const firstRows = await readRebaseAtMany(firstIndices)
  const firstHit = pickLatest(firstIndices, firstRows)
  if (firstHit == null) return null

  let nextFail: bigint | null = null
  for (let i = 0; i < firstIndices.length; i += 1) {
    const idx = firstIndices[i]!
    if (idx > firstHit.index && firstRows[i] == null) {
      nextFail = idx
      break
    }
  }
  if (nextFail != null && nextFail === firstHit.index + 1n) {
    persistRebaseIndex(firstHit.index)
    return firstHit.row[1]
  }
  const fillTo = nextFail != null ? nextFail - 1n : firstHit.index + FILL_CHUNK
  const filled = await fillLatestInRange(firstHit.index + 1n, fillTo)
  const latest = filled != null && filled.index > firstHit.index ? filled : firstHit
  persistRebaseIndex(latest.index)
  return latest.row[1]
}

/**
 * 最近一次 rebase 率：先读当前 epoch.number，再一次 multicall 多取下标，在返回值里取末条。
 *
 * 与 Hub 概览拆开，避免探测拖住倒计时 / TVL。
 *
 * @returns rebase（1e18）；从未 rebase → null
 * @see docs/onchain-manual/contracts/sagx.md
 */
export async function readLatestSagxRebaseRate(): Promise<bigint | null> {
  const epoch = await bscReadClient.readContract({
    address: BSC_CONTRACTS.stakingPool,
    abi: stakingPoolAbi,
    functionName: 'epoch',
  })
  return readLatestSagxRebaseRate1e18(epoch[1])
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
