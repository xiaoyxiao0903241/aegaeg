import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'

import type { DurationPlan } from '~/core/assets/claim-plans'
import { RELEASE_DURATION_DAYS, SECONDS_PER_DAY } from '~/core/assets/claim-plans'
import { ZERO_ADDRESS } from '~/core/constants'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  AEGIS_SPLITTER_MANAGER_METHODS,
  AEGIS_SPLITTER_METHODS,
  PRINCIPAL_RELEASE_VAULT_METHODS,
  REWARD_QUEUE_METHODS,
} from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { readAggregate3 } from '~/web3/multicall3-read'

const queueReadAbi = parseAbi([
  REWARD_QUEUE_METHODS.queuePlans,
  REWARD_QUEUE_METHODS.getUserTotalClaimable,
  REWARD_QUEUE_METHODS.getReleasedRewardsWithPlanIndex,
  REWARD_QUEUE_METHODS.getRewardsWithPlanIndex,
])

const managerReadAbi = parseAbi([
  AEGIS_SPLITTER_MANAGER_METHODS.getHeadSplitterForUser,
  AEGIS_SPLITTER_MANAGER_METHODS.DEFAULT_RELEASE_DURATION,
  AEGIS_SPLITTER_MANAGER_METHODS.effectiveDuration,
])

const splitterReadAbi = parseAbi([AEGIS_SPLITTER_METHODS.getReleases, AEGIS_SPLITTER_METHODS.next])

const archiveVaultReadAbi = parseAbi([
  PRINCIPAL_RELEASE_VAULT_METHODS.getReleaseCount,
  PRINCIPAL_RELEASE_VAULT_METHODS.getRelease,
  PRINCIPAL_RELEASE_VAULT_METHODS.claimable,
])

/** 手册 §13：getReleases / claimMany 单页上限 50 */
export const SPLITTER_RELEASE_PAGE = 50
/** 链式瀑布深度上限（防环）；与迁移 hops 同量级 */
const SPLITTER_CHAIN_MAX = 8

export type ReleaseQueuePlanRow = {
  planIndex: number
  durationDays: number | null
  claimable: bigint
  total: bigint
  releasing: bigint
}

export type ReleaseQueueSnapshot = {
  plans: ReleaseQueuePlanRow[]
  totalClaimable: bigint
  totalLocked: bigint
  totalReleasing: bigint
}

export type ReleaseBufferTokenTotals = {
  totalAmount: bigint
  totalClaimed: bigint
  totalClaimable: bigint
  totalRemaining: bigint
  totalReleasing: bigint
}

/** claimMany 窗口：仅覆盖「窗内至少一笔可领」的 [start, start+limit) */
export type ReleaseClaimWindow = {
  start: number
  limit: number
}

/** 分流器链上单跳（Head → … → 链尾） */
export type ReleaseBufferChainHop = {
  address: Address
  next: Address
  /** next == 0：领取到钱包；否则转发下游再释放 */
  isTail: boolean
  count: number
  claimable: bigint
  /** 本跳可领 AGX 的释放单 index（逐笔 claimMany(i,1)，禁混币窗） */
  agxClaimIndexes: number[]
  /** 本跳可领 gAGX 的释放单 index */
  gagxClaimIndexes: number[]
}

export type ReleaseBufferSnapshot = {
  /** 用户头部分流器；未解析时为零地址 */
  splitter: Address
  /** Head→next 链；领取须对每跳分别 claimMany */
  chain: ReleaseBufferChainHop[]
  splitterCount: number
  archiveCount: number
  /** 释放单条数（分流器链 + 归档） */
  count: number
  /**
   * AGX + gAGX 可领之和，仅作「有无可领」门闸；
   * 展示金额一律用 agx / gagx 桶，禁止用本字段格式化。
   */
  totalClaimable: bigint
  agx: ReleaseBufferTokenTotals
  gagx: ReleaseBufferTokenTotals
  splitterClaimable: bigint
  archiveClaimable: bigint
  /** 归档可领窗；空窗不调 claimMany */
  archiveClaimWindows: ReleaseClaimWindow[]
}

const emptyTotals = (): ReleaseBufferTokenTotals => ({
  totalAmount: 0n,
  totalClaimed: 0n,
  totalClaimable: 0n,
  totalRemaining: 0n,
  totalReleasing: 0n,
})

function durationDaysFromSeconds(seconds: bigint): number | null {
  const days = Number(seconds / SECONDS_PER_DAY)
  if (!Number.isFinite(days) || days <= 0) return null
  return days
}

function addTotals(
  target: ReleaseBufferTokenTotals,
  amount: bigint,
  claimed: bigint,
  claimable: bigint,
  remaining: bigint,
): void {
  target.totalAmount += amount
  target.totalClaimed += claimed
  target.totalClaimable += claimable
  target.totalRemaining += remaining
  target.totalReleasing =
    target.totalRemaining > target.totalClaimable
      ? target.totalRemaining - target.totalClaimable
      : 0n
}

function isSameAddress(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase()
}

/**
 * 从逐笔 claimable 生成 claimMany 窗口（跳过全空窗）。
 * 合约：窗内无可领 → ErrorNothingToClaim。
 */
export function claimWindowsFromAmounts(
  amounts: readonly bigint[],
  pageSize: number = SPLITTER_RELEASE_PAGE,
): ReleaseClaimWindow[] {
  if (pageSize <= 0) throw new Error('RELEASE_CLAIM_PAGE_INVALID')
  const windows: ReleaseClaimWindow[] = []
  for (let start = 0; start < amounts.length; start += pageSize) {
    const limit = Math.min(pageSize, amounts.length - start)
    let hasClaimable = false
    for (let i = 0; i < limit; i++) {
      if ((amounts[start + i] ?? 0n) > 0n) {
        hasClaimable = true
        break
      }
    }
    if (hasClaimable) windows.push({ start, limit })
  }
  return windows
}

/**
 * 某币种可领释放单的 index 列表（用于按卡独立领取，避免 claimMany 混领）。
 *
 * @param items 分流器分页条目（顺序即链上 index）
 * @param token 目标代币地址
 */
export function claimIndexesForToken(
  items: readonly { release: { token: Address }; claimableAmount: bigint }[],
  token: Address,
): number[] {
  const indexes: number[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]!
    if (item.claimableAmount <= 0n) continue
    if (!isSameAddress(item.release.token, token)) continue
    indexes.push(i)
  }
  return indexes
}

/**
 * 读取 RewardQueue 释放计划（queuePlans）。
 *
 * @param readClient 链读取客户端，默认 BSC 主网
 * @returns 释放计划数组（含 index 与时长）
 * @see 手册 §12 RewardQueue 奖励释放队列
 */
export async function readReleaseQueuePlans(
  readClient: ChainReadClient = bscReadClient,
): Promise<DurationPlan[]> {
  const plans = await readClient.readContract({
    address: BSC_CONTRACTS.rewardQueue,
    abi: queueReadAbi,
    functionName: 'queuePlans',
  })
  return (plans as readonly { releaseDuration: bigint; feeRate: bigint }[]).map((plan, index) => ({
    index,
    durationSeconds: plan.releaseDuration,
    taxBps: plan.feeRate,
  }))
}

/**
 * 读取分流器默认新单释放周期（秒）。
 *
 * 未连钱包时的公共展示用 Manager.DEFAULT_RELEASE_DURATION。
 *
 * @see 手册 §13 分流器本金释放
 */
export async function readPrincipalReleaseDuration(
  readClient: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return (await readClient.readContract({
    address: BSC_CONTRACTS.aegisSplitterManager,
    abi: managerReadAbi,
    functionName: 'DEFAULT_RELEASE_DURATION',
  })) as bigint
}

/**
 * 读取用户生效释放周期（秒）：Manager.effectiveDuration(user)。
 *
 * @see 手册 §13.3
 */
export async function readEffectiveReleaseDuration(
  address: Address,
  readClient: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return (await readClient.readContract({
    address: BSC_CONTRACTS.aegisSplitterManager,
    abi: managerReadAbi,
    functionName: 'effectiveDuration',
    args: [address],
  })) as bigint
}

/**
 * 读取用户释放队列汇总。
 *
 * 按前端四档（5/20/40/60 天）匹配链上计划写入固定槽位；链上多出的档位
 * 仅在有余额时追加（读取失败不强行阻断）。每档两读合并为一次 Multicall3。
 *
 * @param address 钱包地址
 * @param readClient 链读取客户端，默认 BSC 主网
 * @returns 释放队列汇总快照
 * @see 手册 §12 RewardQueue 奖励释放队列
 */
export async function readReleaseQueueSnapshot(
  address: Address,
  readClient: ChainReadClient = bscReadClient,
): Promise<ReleaseQueueSnapshot> {
  const durationPlans = await readReleaseQueuePlans(readClient)
  const queue = BSC_CONTRACTS.rewardQueue

  type PendingRow = {
    planIndex: number
    durationDays: number | null
    /** UI 四档写入 uiRows[slot]；链外档仅非零才追加 */
    uiSlot: number | null
  }

  const uiRows: ReleaseQueuePlanRow[] = RELEASE_DURATION_DAYS.map((days) => ({
    planIndex: -1,
    durationDays: days,
    claimable: 0n,
    total: 0n,
    releasing: 0n,
  }))
  const pending: PendingRow[] = []
  const planByDurationSeconds = new Map(
    durationPlans.map((plan) => [plan.durationSeconds, plan] as const),
  )
  const knownDurationDays = new Set<number>(RELEASE_DURATION_DAYS)

  for (let slot = 0; slot < RELEASE_DURATION_DAYS.length; slot++) {
    const days = RELEASE_DURATION_DAYS[slot]!
    const matched = planByDurationSeconds.get(BigInt(days) * SECONDS_PER_DAY)
    if (!matched) continue
    pending.push({ planIndex: matched.index, durationDays: days, uiSlot: slot })
  }

  // 链上非 5/20/40/60 档：读后非零才计入 totals，不强制要求四档都存在。
  for (const plan of durationPlans) {
    const days = durationDaysFromSeconds(plan.durationSeconds)
    if (days != null && knownDurationDays.has(days)) continue
    pending.push({ planIndex: plan.index, durationDays: days, uiSlot: null })
  }

  // 每档 claimable+total → 单次 Multicall3（避免 N× eth_call）
  const results = await readAggregate3(
    readClient,
    pending.flatMap((row) => [
      {
        target: queue,
        callData: encodeFunctionData({
          abi: queueReadAbi,
          functionName: 'getReleasedRewardsWithPlanIndex',
          args: [address, row.planIndex],
        }),
      },
      {
        target: queue,
        callData: encodeFunctionData({
          abi: queueReadAbi,
          functionName: 'getRewardsWithPlanIndex',
          args: [address, row.planIndex],
        }),
      },
    ]),
  )

  const extraRows: ReleaseQueuePlanRow[] = []
  for (let i = 0; i < pending.length; i++) {
    const meta = pending[i]!
    const claimableSlot = results[i * 2]
    const totalSlot = results[i * 2 + 1]
    if (!claimableSlot?.success || !totalSlot?.success) {
      throw new Error(`RELEASE_QUEUE_MULTICALL_FAILED:${meta.planIndex}`)
    }
    const claimable = decodeFunctionResult({
      abi: queueReadAbi,
      functionName: 'getReleasedRewardsWithPlanIndex',
      data: claimableSlot.returnData,
    }) as bigint
    const total = decodeFunctionResult({
      abi: queueReadAbi,
      functionName: 'getRewardsWithPlanIndex',
      data: totalSlot.returnData,
    }) as bigint
    const row: ReleaseQueuePlanRow = {
      planIndex: meta.planIndex,
      durationDays: meta.durationDays,
      claimable,
      total,
      releasing: total > claimable ? total - claimable : 0n,
    }
    if (meta.uiSlot != null) {
      uiRows[meta.uiSlot] = row
      continue
    }
    if (claimable <= 0n && total <= 0n) continue
    extraRows.push(row)
  }

  const rows = [...uiRows, ...extraRows]
  let totalClaimable = 0n
  let totalLocked = 0n
  let totalReleasing = 0n
  for (const row of rows) {
    totalClaimable += row.claimable
    totalLocked += row.total
    totalReleasing += row.releasing
  }

  return { plans: rows, totalClaimable, totalLocked, totalReleasing }
}

/** 单档读：已知 planIndex 时 1× Multicall（2 call）；未知则先 queuePlans 再读。 */
export async function readReleaseQueuePlanByDays(
  address: Address,
  durationDays: number,
  planIndexHint: number = -1,
  readClient: ChainReadClient = bscReadClient,
): Promise<ReleaseQueuePlanRow> {
  let planIndex = planIndexHint
  if (planIndex < 0) {
    const durationPlans = await readReleaseQueuePlans(readClient)
    const matched = durationPlans.find(
      (p) => p.durationSeconds === BigInt(durationDays) * SECONDS_PER_DAY,
    )
    if (!matched) {
      return {
        planIndex: -1,
        durationDays,
        claimable: 0n,
        total: 0n,
        releasing: 0n,
      }
    }
    planIndex = matched.index
  }

  const queue = BSC_CONTRACTS.rewardQueue
  const results = await readAggregate3(readClient, [
    {
      target: queue,
      callData: encodeFunctionData({
        abi: queueReadAbi,
        functionName: 'getReleasedRewardsWithPlanIndex',
        args: [address, planIndex],
      }),
    },
    {
      target: queue,
      callData: encodeFunctionData({
        abi: queueReadAbi,
        functionName: 'getRewardsWithPlanIndex',
        args: [address, planIndex],
      }),
    },
  ])
  const claimableSlot = results[0]
  const totalSlot = results[1]
  if (!claimableSlot?.success || !totalSlot?.success) {
    throw new Error(`RELEASE_QUEUE_PLAN_MULTICALL_FAILED:${planIndex}`)
  }
  const claimable = decodeFunctionResult({
    abi: queueReadAbi,
    functionName: 'getReleasedRewardsWithPlanIndex',
    data: claimableSlot.returnData,
  }) as bigint
  const total = decodeFunctionResult({
    abi: queueReadAbi,
    functionName: 'getRewardsWithPlanIndex',
    data: totalSlot.returnData,
  }) as bigint

  return {
    planIndex,
    durationDays,
    claimable,
    total,
    releasing: total > claimable ? total - claimable : 0n,
  }
}

/** 用单档结果补丁 snapshot，并重算 totals（右栏链上合计会跟着变）。 */
export function patchReleaseQueuePlan(
  snapshot: ReleaseQueueSnapshot,
  row: ReleaseQueuePlanRow,
): ReleaseQueueSnapshot {
  const plans = snapshot.plans.map((p) => (p.durationDays === row.durationDays ? row : p))
  if (!plans.some((p) => p.durationDays === row.durationDays)) {
    plans.push(row)
  }
  let totalClaimable = 0n
  let totalLocked = 0n
  let totalReleasing = 0n
  for (const p of plans) {
    totalClaimable += p.claimable
    totalLocked += p.total
    totalReleasing += p.releasing
  }
  return { plans, totalClaimable, totalLocked, totalReleasing }
}

/**
 * 读取用户释放队列可领总额（getUserTotalClaimable）。
 *
 * @param address 钱包地址
 * @param readClient 链读取客户端，默认 BSC 主网
 * @returns 可领总额（wei）
 * @see 手册 §12 RewardQueue 奖励释放队列
 */
export async function readReleaseQueueClaimable(
  address: Address,
  readClient: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return readClient.readContract({
    address: BSC_CONTRACTS.rewardQueue,
    abi: queueReadAbi,
    functionName: 'getUserTotalClaimable',
    args: [address],
  }) as Promise<bigint>
}

type SplitterReleaseView = {
  release: {
    token: Address
    amount: bigint
    claimed: bigint
    startTime: bigint
    duration: bigint
  }
  claimableAmount: bigint
  remainingAmount: bigint
  endTime: bigint
  fullyClaimed: boolean
}

async function readSplitterPages(
  splitter: Address,
  user: Address,
  readClient: ChainReadClient,
): Promise<{ count: number; items: SplitterReleaseView[] }> {
  const first = (await readClient.readContract({
    address: splitter,
    abi: splitterReadAbi,
    functionName: 'getReleases',
    args: [user, 0n, BigInt(SPLITTER_RELEASE_PAGE)],
  })) as readonly [readonly SplitterReleaseView[], bigint]

  const totalCount = Number(first[1])
  if (!Number.isFinite(totalCount) || totalCount <= 0) {
    return { count: 0, items: [] }
  }

  const items = [...first[0]]
  let start = items.length
  while (start < totalCount) {
    const page = (await readClient.readContract({
      address: splitter,
      abi: splitterReadAbi,
      functionName: 'getReleases',
      args: [user, BigInt(start), BigInt(SPLITTER_RELEASE_PAGE)],
    })) as readonly [readonly SplitterReleaseView[], bigint]
    if (page[0].length === 0) {
      throw new Error(`RELEASE_SPLITTER_PAGE_EMPTY:${splitter}:${start}`)
    }
    items.push(...page[0])
    start += page[0].length
  }
  if (items.length !== totalCount) {
    throw new Error(`RELEASE_SPLITTER_PAGE_INCOMPLETE:${splitter}:${items.length}/${totalCount}`)
  }
  return { count: totalCount, items }
}

function isZeroAddress(addr: string): boolean {
  return addr.toLowerCase() === ZERO_ADDRESS.toLowerCase()
}

/**
 * 从 Head 沿 next 走链（环检测 + 深度上限）。
 *
 * next / 深度异常一律抛错，不能静默当成链尾。
 *
 * @see 手册 §13.5 / aegissplitter.md 链式瀑布
 */
async function resolveSplitterChain(
  head: Address,
  readClient: ChainReadClient,
): Promise<Array<{ address: Address; next: Address; isTail: boolean }>> {
  const hops: Array<{ address: Address; next: Address; isTail: boolean }> = []
  const seen = new Set<string>()
  let current = head
  for (let depth = 0; depth < SPLITTER_CHAIN_MAX; depth++) {
    const key = current.toLowerCase()
    if (seen.has(key) || isZeroAddress(key)) break
    seen.add(key)
    const nextRaw = (await readClient.readContract({
      address: current,
      abi: splitterReadAbi,
      functionName: 'next',
    })) as Address
    const next = nextRaw && !isZeroAddress(nextRaw) ? nextRaw : (ZERO_ADDRESS as Address)
    const isTail = isZeroAddress(next)
    hops.push({ address: current, next, isTail })
    if (isTail) return hops
    current = next
  }
  throw new Error(`RELEASE_SPLITTER_CHAIN_TRUNCATED:${head}`)
}

async function readArchiveVaultTotals(
  user: Address,
  readClient: ChainReadClient,
): Promise<{
  count: number
  totals: ReleaseBufferTokenTotals
  claimable: bigint
  claimWindows: ReleaseClaimWindow[]
}> {
  const empty = {
    count: 0,
    totals: emptyTotals(),
    claimable: 0n,
    claimWindows: [] as ReleaseClaimWindow[],
  }
  const vault = BSC_CONTRACTS.principalReleaseVault

  // 只有 getReleaseCount 读取失败才降级为空（归档合约未部署/不可达时不阻塞分流器）
  let countRaw: bigint
  try {
    countRaw = (await readClient.readContract({
      address: vault,
      abi: archiveVaultReadAbi,
      functionName: 'getReleaseCount',
      args: [user],
    })) as bigint
  } catch {
    return empty
  }

  const count = Number(countRaw)
  const totals = emptyTotals()
  if (!Number.isFinite(count) || count <= 0) {
    return empty
  }

  // count 已拿到后，分页 / 解码失败直接抛错，不能静默保留半截归档
  const results = await readAggregate3(
    readClient,
    Array.from({ length: count }, (_, i) => ({
      target: vault,
      callData: encodeFunctionData({
        abi: archiveVaultReadAbi,
        functionName: 'getRelease',
        args: [user, BigInt(i)],
      }),
    })),
  )

  const claimables: bigint[] = []
  for (let i = 0; i < count; i++) {
    const result = results[i]
    if (!result?.success) {
      throw new Error(`RELEASE_ARCHIVE_MULTICALL_FAILED:${i}`)
    }
    const raw = decodeFunctionResult({
      abi: archiveVaultReadAbi,
      functionName: 'getRelease',
      data: result.returnData,
    }) as readonly [
      { amount: bigint; claimed: bigint; startTime: bigint; duration: bigint },
      bigint,
      bigint,
      bigint,
      boolean,
    ]
    claimables.push(raw[1])
    addTotals(totals, raw[0].amount, raw[0].claimed, raw[1], raw[2])
  }
  return {
    count,
    totals,
    claimable: totals.totalClaimable,
    claimWindows: claimWindowsFromAmounts(claimables),
  }
}

/**
 * 读取用户本金释放汇总（现行分流器链 + 归档 PRV）。
 *
 * 分流器链 Head / next 读失败直接抛错；归档只有 getReleaseCount 失败才降级为空。
 *
 * @see 手册 §13 分流器本金释放
 */
export async function readReleaseBufferSnapshot(
  address: Address,
  readClient: ChainReadClient = bscReadClient,
): Promise<ReleaseBufferSnapshot> {
  const agx = emptyTotals()
  const gagx = emptyTotals()
  const agxToken = BSC_CONTRACTS.agx
  const gagxToken = BSC_CONTRACTS.gagx
  const chain: ReleaseBufferChainHop[] = []

  const splitterRaw = (await readClient.readContract({
    address: BSC_CONTRACTS.aegisSplitterManager,
    abi: managerReadAbi,
    functionName: 'getHeadSplitterForUser',
    args: [address],
  })) as Address
  const splitter =
    splitterRaw && !isZeroAddress(splitterRaw) ? splitterRaw : (ZERO_ADDRESS as Address)

  let splitterCount = 0
  let splitterClaimable = 0n
  if (splitter !== ZERO_ADDRESS) {
    const hops = await resolveSplitterChain(splitter, readClient)
    for (const hop of hops) {
      const page = await readSplitterPages(hop.address, address, readClient)
      let hopClaimable = 0n
      for (const item of page.items) {
        const token = item.release.token
        const bucket = isSameAddress(token, gagxToken)
          ? gagx
          : isSameAddress(token, agxToken)
            ? agx
            : null
        if (!bucket) {
          throw new Error(`RELEASE_UNKNOWN_TOKEN:${token}`)
        }
        addTotals(
          bucket,
          item.release.amount,
          item.release.claimed,
          item.claimableAmount,
          item.remainingAmount,
        )
        hopClaimable += item.claimableAmount
      }
      chain.push({
        address: hop.address,
        next: hop.next,
        isTail: hop.isTail,
        count: page.count,
        claimable: hopClaimable,
        agxClaimIndexes: claimIndexesForToken(page.items, agxToken),
        gagxClaimIndexes: claimIndexesForToken(page.items, gagxToken),
      })
      splitterCount += page.count
      splitterClaimable += hopClaimable
    }
  }

  const archive = await readArchiveVaultTotals(address, readClient)
  addTotals(
    agx,
    archive.totals.totalAmount,
    archive.totals.totalClaimed,
    archive.totals.totalClaimable,
    archive.totals.totalRemaining,
  )

  return {
    splitter,
    chain,
    splitterCount,
    archiveCount: archive.count,
    count: splitterCount + archive.count,
    totalClaimable: agx.totalClaimable + gagx.totalClaimable,
    agx,
    gagx,
    splitterClaimable,
    archiveClaimable: archive.claimable,
    archiveClaimWindows: archive.claimWindows,
  }
}

/** Release 页红点：queue + 分流器链/归档；每跳用 getReleases 短电路。 */
export async function readReleaseHasClaimable(
  address: Address,
  readClient: ChainReadClient = bscReadClient,
): Promise<boolean> {
  const queueClaimable = await readReleaseQueueClaimable(address, readClient)
  if (queueClaimable > 0n) return true

  const splitterRaw = (await readClient.readContract({
    address: BSC_CONTRACTS.aegisSplitterManager,
    abi: managerReadAbi,
    functionName: 'getHeadSplitterForUser',
    args: [address],
  })) as Address
  if (splitterRaw && !isZeroAddress(splitterRaw)) {
    const hops = await resolveSplitterChain(splitterRaw, readClient)
    for (const hop of hops) {
      const page = await readSplitterPages(hop.address, address, readClient)
      if (page.items.some((item) => item.claimableAmount > 0n)) return true
    }
  }

  try {
    const archiveCountRaw = (await readClient.readContract({
      address: BSC_CONTRACTS.principalReleaseVault,
      abi: archiveVaultReadAbi,
      functionName: 'getReleaseCount',
      args: [address],
    })) as bigint
    const archiveCount = Number(archiveCountRaw)
    if (!Number.isFinite(archiveCount) || archiveCount <= 0) return false
    for (let i = 0; i < archiveCount; i++) {
      const amount = (await readClient.readContract({
        address: BSC_CONTRACTS.principalReleaseVault,
        abi: archiveVaultReadAbi,
        functionName: 'claimable',
        args: [address, BigInt(i)],
      })) as bigint
      if (amount > 0n) return true
    }
  } catch {
    // 归档探测失败不影响「无分流器可领」结论
  }
  return false
}
