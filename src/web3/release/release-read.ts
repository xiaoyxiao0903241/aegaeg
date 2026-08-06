import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'

import type { DurationPlan } from '~/core/assets/claim-plans'
import { RELEASE_DURATION_DAYS, SECONDS_PER_DAY } from '~/core/assets/claim-plans'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import { PRINCIPAL_RELEASE_VAULT_METHODS, REWARD_QUEUE_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { readAggregate3 } from '~/web3/multicall3-read'

const queueReadAbi = parseAbi([
  REWARD_QUEUE_METHODS.queuePlans,
  REWARD_QUEUE_METHODS.getUserTotalClaimable,
  REWARD_QUEUE_METHODS.getReleasedRewardsWithPlanIndex,
  REWARD_QUEUE_METHODS.getRewardsWithPlanIndex,
])

const vaultReadAbi = parseAbi([
  PRINCIPAL_RELEASE_VAULT_METHODS.getReleaseCount,
  PRINCIPAL_RELEASE_VAULT_METHODS.getRelease,
  PRINCIPAL_RELEASE_VAULT_METHODS.claimable,
  PRINCIPAL_RELEASE_VAULT_METHODS.releaseDuration,
])

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

export type ReleaseBufferSnapshot = {
  count: number
  totalAmount: bigint
  totalClaimed: bigint
  totalClaimable: bigint
  totalRemaining: bigint
  totalReleasing: bigint
}

function durationDaysFromSeconds(seconds: bigint): number | null {
  const days = Number(seconds / SECONDS_PER_DAY)
  if (!Number.isFinite(days) || days <= 0) return null
  return days
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
 * 读取 PrincipalReleaseVault 当前新单释放周期（秒）。
 *
 * 仅影响后续新单；既有释放单时长写在各自 release.duration。
 */
export async function readPrincipalReleaseDuration(
  readClient: ChainReadClient = bscReadClient,
): Promise<bigint> {
  return (await readClient.readContract({
    address: BSC_CONTRACTS.principalReleaseVault,
    abi: vaultReadAbi,
    functionName: 'releaseDuration',
  })) as bigint
}

/**
 * 读取用户释放队列汇总。
 *
 * 按前端四档（5/20/40/60 天）匹配链上计划写入固定槽位；链上多出的档位
 * 仅在有余额时追加（fail-open）。每档两读合并为一次 Multicall3。
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

  for (let slot = 0; slot < RELEASE_DURATION_DAYS.length; slot++) {
    const days = RELEASE_DURATION_DAYS[slot]!
    const matched = durationPlans.find((p) => p.durationSeconds === BigInt(days) * SECONDS_PER_DAY)
    if (!matched) continue
    pending.push({ planIndex: matched.index, durationDays: days, uiSlot: slot })
  }

  // 链上非 5/20/40/60 档：读后非零才计入 totals（fail-open）
  for (const plan of durationPlans) {
    const days = durationDaysFromSeconds(plan.durationSeconds)
    if (days != null && (RELEASE_DURATION_DAYS as readonly number[]).includes(days)) continue
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

/**
 * 读取用户本金释放（PrincipalReleaseVault）汇总。
 *
 * 逐仓 getRelease 经一次 Multicall3 读取，累加总量 / 已领 / 可领 / 剩余。
 *
 * @param address 钱包地址
 * @param readClient 链读取客户端，默认 BSC 主网
 * @returns 本金释放汇总；无仓位时全零
 * @see 手册 §13 PrincipalReleaseVault 本金释放
 */
export async function readReleaseBufferSnapshot(
  address: Address,
  readClient: ChainReadClient = bscReadClient,
): Promise<ReleaseBufferSnapshot> {
  const vault = BSC_CONTRACTS.principalReleaseVault
  const countRaw = (await readClient.readContract({
    address: vault,
    abi: vaultReadAbi,
    functionName: 'getReleaseCount',
    args: [address],
  })) as bigint
  const count = Number(countRaw)
  if (!Number.isFinite(count) || count <= 0) {
    return {
      count: 0,
      totalAmount: 0n,
      totalClaimed: 0n,
      totalClaimable: 0n,
      totalRemaining: 0n,
      totalReleasing: 0n,
    }
  }

  const results = await readAggregate3(
    readClient,
    Array.from({ length: count }, (_, i) => ({
      target: vault,
      callData: encodeFunctionData({
        abi: vaultReadAbi,
        functionName: 'getRelease',
        args: [address, BigInt(i)],
      }),
    })),
  )

  let totalAmount = 0n
  let totalClaimed = 0n
  let totalClaimable = 0n
  let totalRemaining = 0n
  for (let i = 0; i < count; i++) {
    const result = results[i]
    if (!result?.success) {
      throw new Error(`RELEASE_BUFFER_MULTICALL_FAILED:${i}`)
    }
    const raw = decodeFunctionResult({
      abi: vaultReadAbi,
      functionName: 'getRelease',
      data: result.returnData,
    }) as readonly [
      { amount: bigint; claimed: bigint; startTime: bigint; duration: bigint },
      bigint,
      bigint,
      bigint,
      boolean,
    ]
    const release = raw[0]
    const claimableAmount = raw[1]
    const remainingAmount = raw[2]
    totalAmount += release.amount
    totalClaimed += release.claimed
    totalClaimable += claimableAmount
    totalRemaining += remainingAmount
  }
  const totalReleasing = totalRemaining > totalClaimable ? totalRemaining - totalClaimable : 0n

  return {
    count,
    totalAmount,
    totalClaimed,
    totalClaimable,
    totalRemaining,
    totalReleasing,
  }
}

/** Release 页红点：queue 用汇总 view；buffer 用 `claimable` 短电路（不扫全表 getRelease）。 */
export async function readReleaseHasClaimable(
  address: Address,
  readClient: ChainReadClient = bscReadClient,
): Promise<boolean> {
  const queueClaimable = await readReleaseQueueClaimable(address, readClient)
  if (queueClaimable > 0n) return true

  const countRaw = (await readClient.readContract({
    address: BSC_CONTRACTS.principalReleaseVault,
    abi: vaultReadAbi,
    functionName: 'getReleaseCount',
    args: [address],
  })) as bigint
  const count = Number(countRaw)
  if (!Number.isFinite(count) || count <= 0) return false

  for (let i = 0; i < count; i++) {
    const amount = (await readClient.readContract({
      address: BSC_CONTRACTS.principalReleaseVault,
      abi: vaultReadAbi,
      functionName: 'claimable',
      args: [address, BigInt(i)],
    })) as bigint
    if (amount > 0n) return true
  }
  return false
}
