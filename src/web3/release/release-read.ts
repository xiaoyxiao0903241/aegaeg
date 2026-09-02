import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'

import type { DurationPlan } from '~/core/assets/claim-plans'
import { RELEASE_DURATION_DAYS, SECONDS_PER_DAY } from '~/core/assets/claim-plans'
import { ZERO_ADDRESS } from '~/core/constants'
import { pickFirstClaimPage, RELEASE_CLAIM_PAGE } from '~/core/release/pick-release-claim-page'
import { unvestedRemaining } from '~/core/release/release-block-reasons'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  AEGIS_SPLITTER_MANAGER_METHODS,
  AEGIS_SPLITTER_METHODS,
  PRINCIPAL_RELEASE_VAULT_METHODS,
  REWARD_QUEUE_METHODS,
} from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import { readAggregate3 } from '~/web3/multicall3-read'

const queueReadAbi = parseAbi([
  REWARD_QUEUE_METHODS.queuePlans,
  REWARD_QUEUE_METHODS.getReleasedRewardsWithPlanIndex,
  REWARD_QUEUE_METHODS.getReleasedRewardsWithOffset,
  REWARD_QUEUE_METHODS.getRewardsWithPlanIndex,
  REWARD_QUEUE_METHODS.getQueuePlanSize,
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
export const SPLITTER_RELEASE_PAGE = RELEASE_CLAIM_PAGE
/** 链式瀑布深度上限（防环）；与迁移 hops 同量级 */
const SPLITTER_CHAIN_MAX = 8

export type ReleaseQueuePlanRow = {
  planIndex: number
  durationDays: number | null
  /** 当前 50 条窗待领（CTA / 一键领取） */
  claimable: bigint
  /** 整档已解锁合计（进度 / Hub） */
  overallClaimable: bigint
  total: bigint
  /** 尚未线性释放（locked − claimable）；释放完成后为 0 */
  releasing: bigint
  claimStart: number
  claimLimit: number
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
  /** 当前 50 条窗内该币待领（CTA） */
  pageClaimable: bigint
  totalRemaining: bigint
  /** 尚未线性释放（remaining − claimable）；释放完成后为 0 */
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
  /** 本跳可领窗（任意 token；空窗已跳过）；提交时 claimMany 一次领尽 */
  claimWindows: ReleaseClaimWindow[]
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
  pageClaimable: 0n,
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
  target.totalReleasing = unvestedRemaining(target.totalRemaining, target.totalClaimable)
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
 * 读取 RewardQueue 释放计划（queuePlans）。
 *
 * @returns 释放计划数组（含 index 与时长）
 * @see 手册 §12 RewardQueue 奖励释放队列
 */
export async function readReleaseQueuePlans(): Promise<DurationPlan[]> {
  const plans = await bscReadClient.readContract({
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
export async function readPrincipalReleaseDuration(): Promise<bigint> {
  return (await bscReadClient.readContract({
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
export async function readEffectiveReleaseDuration(address: Address): Promise<bigint> {
  return (await bscReadClient.readContract({
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
 * 仅在有余额时追加（读取失败不强行阻断）。
 * CTA 待领为当前 50 条窗（getReleasedRewardsWithOffset）；整档合计仍读 planIndex。
 *
 * @param address 钱包地址
 * @returns 释放队列汇总快照
 * @see 手册 §12 RewardQueue 奖励释放队列
 */
export async function readReleaseQueueSnapshot(address: Address): Promise<ReleaseQueueSnapshot> {
  const durationPlans = await readReleaseQueuePlans()
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
    overallClaimable: 0n,
    total: 0n,
    releasing: 0n,
    claimStart: 0,
    claimLimit: 0,
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

  // 每档 overall + total + size → 一次 Multicall3
  const results = await readAggregate3(
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
      {
        target: queue,
        callData: encodeFunctionData({
          abi: queueReadAbi,
          functionName: 'getQueuePlanSize',
          args: [address, row.planIndex],
        }),
      },
    ]),
  )

  type SizedRow = {
    meta: PendingRow
    overallClaimable: bigint
    total: bigint
    size: number
  }
  const sized: SizedRow[] = []
  for (let i = 0; i < pending.length; i++) {
    const meta = pending[i]!
    const claimableSlot = results[i * 3]
    const totalSlot = results[i * 3 + 1]
    const sizeSlot = results[i * 3 + 2]
    if (!claimableSlot?.success || !totalSlot?.success || !sizeSlot?.success) {
      throw new Error(`RELEASE_QUEUE_MULTICALL_FAILED:${meta.planIndex}`)
    }
    const overallClaimable = decodeFunctionResult({
      abi: queueReadAbi,
      functionName: 'getReleasedRewardsWithPlanIndex',
      data: claimableSlot.returnData,
    }) as bigint
    const total = decodeFunctionResult({
      abi: queueReadAbi,
      functionName: 'getRewardsWithPlanIndex',
      data: totalSlot.returnData,
    }) as bigint
    const sizeRaw = decodeFunctionResult({
      abi: queueReadAbi,
      functionName: 'getQueuePlanSize',
      data: sizeSlot.returnData,
    }) as bigint
    const size = Number(sizeRaw)
    sized.push({
      meta,
      overallClaimable,
      total,
      size: Number.isFinite(size) && size > 0 ? size : 0,
    })
  }

  const offsetCalls: Array<{ target: typeof queue; callData: `0x${string}` }> = []
  const offsetIndex: Array<{ sizedIndex: number; start: number; limit: number }> = []
  for (let i = 0; i < sized.length; i++) {
    const row = sized[i]!
    if (row.overallClaimable <= 0n || row.size <= 0) continue
    for (let start = 0; start < row.size; start += RELEASE_CLAIM_PAGE) {
      const limit = Math.min(RELEASE_CLAIM_PAGE, row.size - start)
      offsetCalls.push({
        target: queue,
        callData: encodeFunctionData({
          abi: queueReadAbi,
          functionName: 'getReleasedRewardsWithOffset',
          args: [address, row.meta.planIndex, BigInt(start), BigInt(limit)],
        }),
      })
      offsetIndex.push({ sizedIndex: i, start, limit })
    }
  }
  const offsetResults = offsetCalls.length === 0 ? [] : await readAggregate3(offsetCalls)
  const pageBySized = new Map<number, Array<{ start: number; limit: number; claimable: bigint }>>()
  for (let i = 0; i < offsetIndex.length; i++) {
    const meta = offsetIndex[i]!
    const slot = offsetResults[i]
    if (!slot?.success) {
      throw new Error(`RELEASE_QUEUE_OFFSET_FAILED:${sized[meta.sizedIndex]!.meta.planIndex}`)
    }
    const claimable = decodeFunctionResult({
      abi: queueReadAbi,
      functionName: 'getReleasedRewardsWithOffset',
      data: slot.returnData,
    }) as bigint
    const list = pageBySized.get(meta.sizedIndex) ?? []
    list.push({ start: meta.start, limit: meta.limit, claimable })
    pageBySized.set(meta.sizedIndex, list)
  }

  const extraRows: ReleaseQueuePlanRow[] = []
  for (let i = 0; i < sized.length; i++) {
    const { meta, overallClaimable, total, size } = sized[i]!
    const pages = pageBySized.get(i) ?? []
    const page = pickFirstClaimPage({
      size,
      pageClaimable: (start, limit) =>
        pages.find((item) => item.start === start && item.limit === limit)?.claimable ?? 0n,
    })
    const row: ReleaseQueuePlanRow = {
      planIndex: meta.planIndex,
      durationDays: meta.durationDays,
      claimable: page?.claimable ?? 0n,
      overallClaimable,
      total,
      releasing: unvestedRemaining(total, overallClaimable),
      claimStart: page?.start ?? 0,
      claimLimit: page?.limit ?? 0,
    }
    if (meta.uiSlot != null) {
      uiRows[meta.uiSlot] = row
      continue
    }
    if (overallClaimable <= 0n && total <= 0n) continue
    extraRows.push(row)
  }

  const rows = [...uiRows, ...extraRows]
  let totalClaimable = 0n
  let totalLocked = 0n
  let totalReleasing = 0n
  for (const row of rows) {
    totalClaimable += row.overallClaimable
    totalLocked += row.total
    totalReleasing += row.releasing
  }

  return { plans: rows, totalClaimable, totalLocked, totalReleasing }
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
): Promise<{ count: number; items: SplitterReleaseView[] }> {
  const first = (await bscReadClient.readContract({
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
    const page = (await bscReadClient.readContract({
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
): Promise<Array<{ address: Address; next: Address; isTail: boolean }>> {
  const hops: Array<{ address: Address; next: Address; isTail: boolean }> = []
  const seen = new Set<string>()
  let current = head
  for (let depth = 0; depth < SPLITTER_CHAIN_MAX; depth++) {
    const key = current.toLowerCase()
    if (seen.has(key) || isZeroAddress(key)) break
    seen.add(key)
    const nextRaw = (await bscReadClient.readContract({
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

async function readArchiveVaultTotals(user: Address): Promise<{
  count: number
  totals: ReleaseBufferTokenTotals
  claimable: bigint
  claimWindows: ReleaseClaimWindow[]
  claimables: bigint[]
}> {
  const empty = {
    count: 0,
    totals: emptyTotals(),
    claimable: 0n,
    claimWindows: [] as ReleaseClaimWindow[],
    claimables: [] as bigint[],
  }
  const vault = BSC_CONTRACTS.principalReleaseVault

  // 只有 getReleaseCount 读取失败才降级为空（归档合约未部署/不可达时不阻塞分流器）
  let countRaw: bigint
  try {
    countRaw = (await bscReadClient.readContract({
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
    claimables,
  }
}

/**
 * 读取用户本金释放汇总（现行分流器链 + 归档 PRV）。
 *
 * 分流器链 Head / next 读失败直接抛错；归档只有 getReleaseCount 失败才降级为空。
 *
 * @see 手册 §13 分流器本金释放
 */
export async function readReleaseBufferSnapshot(address: Address): Promise<ReleaseBufferSnapshot> {
  const agx = emptyTotals()
  const gagx = emptyTotals()
  const agxToken = BSC_CONTRACTS.agx
  const gagxToken = BSC_CONTRACTS.gagx
  const chain: ReleaseBufferChainHop[] = []

  const splitterRaw = (await bscReadClient.readContract({
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
    const hops = await resolveSplitterChain(splitter)
    let pageAssigned = false
    for (const hop of hops) {
      const page = await readSplitterPages(hop.address, address)
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
      const claimWindows = claimWindowsFromAmounts(page.items.map((item) => item.claimableAmount))
      if (!pageAssigned) {
        const window = claimWindows[0]
        if (window) {
          for (let i = window.start; i < window.start + window.limit; i++) {
            const item = page.items[i]
            if (!item) continue
            const token = item.release.token
            if (isSameAddress(token, agxToken)) agx.pageClaimable += item.claimableAmount
            else if (isSameAddress(token, gagxToken)) gagx.pageClaimable += item.claimableAmount
          }
          pageAssigned = true
        }
      }
      chain.push({
        address: hop.address,
        next: hop.next,
        isTail: hop.isTail,
        count: page.count,
        claimable: hopClaimable,
        claimWindows,
      })
      splitterCount += page.count
      splitterClaimable += hopClaimable
    }
  }

  const archive = await readArchiveVaultTotals(address)
  addTotals(
    agx,
    archive.totals.totalAmount,
    archive.totals.totalClaimed,
    archive.totals.totalClaimable,
    archive.totals.totalRemaining,
  )
  if (agx.pageClaimable <= 0n && gagx.pageClaimable <= 0n) {
    const window = archive.claimWindows[0]
    if (window) {
      for (let i = window.start; i < window.start + window.limit; i++) {
        agx.pageClaimable += archive.claimables[i] ?? 0n
      }
    }
  }

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
