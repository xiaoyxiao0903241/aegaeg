import { parseAbi } from 'viem'
import { BSC_CONTRACTS, type Address } from '~/shared/config/contracts'
import { PRINCIPAL_RELEASE_VAULT_METHODS, REWARD_QUEUE_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import type { DurationPlan } from '~/core/assets/claim-plans'
import { RELEASE_DURATION_DAYS, SECONDS_PER_DAY } from '~/core/assets/claim-plans'

const queueReadAbi = parseAbi([
  REWARD_QUEUE_METHODS.queuePlans,
  REWARD_QUEUE_METHODS.getUserTotalClaimable,
  REWARD_QUEUE_METHODS.getReleasedRewardsWithPlanIndex,
  REWARD_QUEUE_METHODS.getRewardsWithPlanIndex,
])

const vaultReadAbi = parseAbi([
  PRINCIPAL_RELEASE_VAULT_METHODS.getReleaseCount,
  PRINCIPAL_RELEASE_VAULT_METHODS.getRelease,
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

export async function readReleaseQueuePlans(
  readClient: ChainReadClient = bscReadClient,
): Promise<DurationPlan[]> {
  const plans = await readClient.readContract({
    address: BSC_CONTRACTS.rewardQueue,
    abi: queueReadAbi,
    functionName: 'queuePlans',
  })
  return (plans as readonly { releaseDuration: bigint }[]).map((plan, index) => ({
    index,
    durationSeconds: plan.releaseDuration,
  }))
}

export async function readReleaseQueueSnapshot(
  address: Address,
  readClient: ChainReadClient = bscReadClient,
): Promise<ReleaseQueueSnapshot> {
  const durationPlans = await readReleaseQueuePlans(readClient)
  const rows: ReleaseQueuePlanRow[] = []

  for (const days of RELEASE_DURATION_DAYS) {
    const matched = durationPlans.find((p) => p.durationSeconds === BigInt(days) * SECONDS_PER_DAY)
    if (!matched) {
      rows.push({
        planIndex: -1,
        durationDays: days,
        claimable: 0n,
        total: 0n,
        releasing: 0n,
      })
      continue
    }
    const [claimable, total] = await Promise.all([
      readClient.readContract({
        address: BSC_CONTRACTS.rewardQueue,
        abi: queueReadAbi,
        functionName: 'getReleasedRewardsWithPlanIndex',
        args: [address, matched.index],
      }) as Promise<bigint>,
      readClient.readContract({
        address: BSC_CONTRACTS.rewardQueue,
        abi: queueReadAbi,
        functionName: 'getRewardsWithPlanIndex',
        args: [address, matched.index],
      }) as Promise<bigint>,
    ])
    const releasing = total > claimable ? total - claimable : 0n
    rows.push({
      planIndex: matched.index,
      durationDays: days,
      claimable,
      total,
      releasing,
    })
  }

  // Include any on-chain plans outside the UI 5/20/40/60 tiers (fail-open for totals only).
  for (const plan of durationPlans) {
    const days = durationDaysFromSeconds(plan.durationSeconds)
    if (days != null && (RELEASE_DURATION_DAYS as readonly number[]).includes(days)) continue
    const [claimable, total] = await Promise.all([
      readClient.readContract({
        address: BSC_CONTRACTS.rewardQueue,
        abi: queueReadAbi,
        functionName: 'getReleasedRewardsWithPlanIndex',
        args: [address, plan.index],
      }) as Promise<bigint>,
      readClient.readContract({
        address: BSC_CONTRACTS.rewardQueue,
        abi: queueReadAbi,
        functionName: 'getRewardsWithPlanIndex',
        args: [address, plan.index],
      }) as Promise<bigint>,
    ])
    if (claimable <= 0n && total <= 0n) continue
    rows.push({
      planIndex: plan.index,
      durationDays: days,
      claimable,
      total,
      releasing: total > claimable ? total - claimable : 0n,
    })
  }

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

export async function readReleaseBufferSnapshot(
  address: Address,
  readClient: ChainReadClient = bscReadClient,
): Promise<ReleaseBufferSnapshot> {
  const countRaw = (await readClient.readContract({
    address: BSC_CONTRACTS.principalReleaseVault,
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

  let totalAmount = 0n
  let totalClaimed = 0n
  let totalClaimable = 0n
  let totalRemaining = 0n
  for (let i = 0; i < count; i++) {
    const raw = (await readClient.readContract({
      address: BSC_CONTRACTS.principalReleaseVault,
      abi: vaultReadAbi,
      functionName: 'getRelease',
      args: [address, BigInt(i)],
    })) as readonly [
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

export async function readReleaseHasClaimable(
  address: Address,
  readClient: ChainReadClient = bscReadClient,
): Promise<boolean> {
  const [queueClaimable, buffer] = await Promise.all([
    readReleaseQueueClaimable(address, readClient),
    readReleaseBufferSnapshot(address, readClient),
  ])
  return queueClaimable > 0n || buffer.totalClaimable > 0n
}
