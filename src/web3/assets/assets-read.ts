import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'

import type { DurationPlan } from '~/core/assets/claim-plans'
import { migrationStakeRoot } from '~/core/migration/migration-user'
import type { StakePeriod } from '~/core/staking/staking-period'
import { type Address, BSC_CONTRACTS, ZERO_ADDRESS } from '~/shared/config/contracts'
import {
  AGX_CONTRIBUTION_SWAP_METHODS,
  BOND_DEPOSITORY_ASSETS_METHODS,
  LIQUID_STAKING_ASSETS_METHODS,
  LIQUID_STAKING_METHODS,
  LOCKED_STAKING_ASSETS_METHODS,
  RESTAKE_CONFIG_METHODS,
  REWARD_QUEUE_METHODS,
  X_STAKING_POOL_METHODS,
} from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { readMigratedFrom } from '~/web3/migration/migration-read'
import { type Aggregate3Call, readAggregate3 } from '~/web3/multicall3-read'
import {
  burnBondDepositoryAddress,
  lpBondDepositoryAddress,
  stakePoolAddress,
} from '~/web3/staking/staking-addresses'

const rewardQueueAbi = parseAbi([REWARD_QUEUE_METHODS.queuePlans])
const restakeConfigAbi = parseAbi([
  RESTAKE_CONFIG_METHODS.getPlanCount,
  RESTAKE_CONFIG_METHODS.getPlan,
])
const contribAbi = parseAbi([
  AGX_CONTRIBUTION_SWAP_METHODS.originalOf,
  AGX_CONTRIBUTION_SWAP_METHODS.userContribution,
  AGX_CONTRIBUTION_SWAP_METHODS.quoteRequiredContribution,
])
const liquidAbi = parseAbi([
  LIQUID_STAKING_ASSETS_METHODS.getStakeRewards,
  LIQUID_STAKING_ASSETS_METHODS.stakes,
  LIQUID_STAKING_ASSETS_METHODS.warmupStakes,
  LIQUID_STAKING_METHODS.isWarmupExpired,
])
const lockedAbi = parseAbi([
  LOCKED_STAKING_ASSETS_METHODS.getStakesCount,
  LOCKED_STAKING_ASSETS_METHODS.getStakes,
  LOCKED_STAKING_ASSETS_METHODS.getStake,
  LOCKED_STAKING_ASSETS_METHODS.getReleasedPrincipal,
])
const bondAbi = parseAbi([
  BOND_DEPOSITORY_ASSETS_METHODS.getBondCount,
  BOND_DEPOSITORY_ASSETS_METHODS.getBondInfo,
  BOND_DEPOSITORY_ASSETS_METHODS.pendingPayoutFor,
  BOND_DEPOSITORY_ASSETS_METHODS.getStakeProfit,
])
const xmineAbi = parseAbi([
  X_STAKING_POOL_METHODS.pendingReward,
  X_STAKING_POOL_METHODS.pendingRewardValue,
  X_STAKING_POOL_METHODS.miningStakeAmountOf,
  X_STAKING_POOL_METHODS.stakes,
])

export type AssetsStakeRow = {
  id: string
  kind: 'liquid' | 'locked'
  period: StakePeriod
  pool: Address
  stakeIndex: number | null
  principal: bigint
  releasedPrincipal: bigint
  blockReward: bigint
  extraInterest: bigint
  claimableBalance: bigint
  expiry: bigint
  /** 活期 warmup 仓（手册 §8.2）：禁本金退出 / Mixed；须 claim() 激活。 */
  inWarmup?: boolean
  /** live `isWarmupExpired`；仅 warmup 行有意义。 */
  warmupExpired?: boolean
}

export type AssetsBondRow = {
  id: string
  kind: 'lp' | 'burn'
  period: Exclude<StakePeriod, 'liquid'>
  depository: Address
  bondIndex: number
  payoutRemaining: bigint
  pendingPayout: bigint
  profit: bigint
  vestingEndTime: bigint
  exists: boolean
}

export type AssetsXminePosition = {
  pending: bigint
  /** `pendingRewardValue` — AGX/gAGX 价值口径（手册 §15.3） */
  pendingValue: bigint
  miningStake: bigint
  gons: bigint
  warmupGons: bigint
  warmupEndTime: bigint
}

export async function readClaimPlans(client: ChainReadClient = bscReadClient): Promise<{
  releasePlans: DurationPlan[]
  restakePlans: DurationPlan[]
}> {
  const [queuePlans, planCount] = await Promise.all([
    client.readContract({
      address: BSC_CONTRACTS.rewardQueue,
      abi: rewardQueueAbi,
      functionName: 'queuePlans',
    }),
    client.readContract({
      address: BSC_CONTRACTS.restakeConfig,
      abi: restakeConfigAbi,
      functionName: 'getPlanCount',
    }),
  ])

  const releasePlans: DurationPlan[] = (
    queuePlans as readonly {
      releaseDuration: bigint
      feeRate: bigint
      feeRecipient: Address
    }[]
  ).map((plan, index) => ({
    index,
    durationSeconds: plan.releaseDuration,
    taxBps: plan.feeRate,
  }))

  const count = Number(planCount)
  const restakePlans: DurationPlan[] = []
  for (let index = 0; index < count; index += 1) {
    const plan = await client.readContract({
      address: BSC_CONTRACTS.restakeConfig,
      abi: restakeConfigAbi,
      functionName: 'getPlan',
      args: [BigInt(index)],
    })
    const [period, taxBP, , exists] = plan as readonly [bigint, bigint, Address, boolean]
    restakePlans.push({
      index,
      durationSeconds: period,
      taxBps: taxBP,
      exists,
    })
  }

  return { releasePlans, restakePlans }
}

export async function readContributionSnapshot(
  user: Address,
  rewardAmount: bigint,
  client: ChainReadClient = bscReadClient,
): Promise<{ contribution: bigint; requiredContribution: bigint }> {
  const root = (await client.readContract({
    address: BSC_CONTRACTS.agxContributionSwap,
    abi: contribAbi,
    functionName: 'originalOf',
    args: [user],
  })) as Address
  const contributionRoot = root.toLowerCase() === ZERO_ADDRESS ? user : root

  const [contribution, requiredContribution] = await Promise.all([
    client.readContract({
      address: BSC_CONTRACTS.agxContributionSwap,
      abi: contribAbi,
      functionName: 'userContribution',
      args: [contributionRoot],
    }),
    client.readContract({
      address: BSC_CONTRACTS.agxContributionSwap,
      abi: contribAbi,
      functionName: 'quoteRequiredContribution',
      args: [rewardAmount],
    }),
  ])

  return {
    contribution: contribution as bigint,
    requiredContribution: requiredContribution as bigint,
  }
}

const LOCKED_PERIODS = ['180', '360', '540'] as const satisfies readonly Exclude<
  StakePeriod,
  'liquid'
>[]

export async function readStakePositions(
  user: Address,
  client: ChainReadClient = bscReadClient,
): Promise<AssetsStakeRow[]> {
  const rows: AssetsStakeRow[] = []

  const liquidPool = stakePoolAddress('liquid')
  // `stakes`/`warmupStakes` 为裸 mapping：须 AMM migratedFrom 得 root；`getStakeRewards` 别名感知，传当前钱包。
  const liquidMigratedFrom = await readMigratedFrom(user, client)
  const liquidRoot = migrationStakeRoot(user, liquidMigratedFrom) as Address
  const [liquidStake, liquidWarmup, liquidRewards, warmupExpired] = await Promise.all([
    client.readContract({
      address: liquidPool,
      abi: liquidAbi,
      functionName: 'stakes',
      args: [liquidRoot],
    }),
    client.readContract({
      address: liquidPool,
      abi: liquidAbi,
      functionName: 'warmupStakes',
      args: [liquidRoot],
    }),
    client.readContract({
      address: liquidPool,
      abi: liquidAbi,
      functionName: 'getStakeRewards',
      args: [user],
    }),
    client.readContract({
      address: liquidPool,
      abi: liquidAbi,
      functionName: 'isWarmupExpired',
      args: [user],
    }),
  ])
  const [principal, , , expiry, exists] = liquidStake as readonly [
    bigint,
    bigint,
    bigint,
    bigint,
    boolean,
  ]
  // warmupStakes：principal · gons · startEpoch · expiry(epoch) · exists
  const [warmupPrincipal, , , warmupExpiry, warmupExists] = liquidWarmup as readonly [
    bigint,
    bigint,
    bigint,
    bigint,
    boolean,
  ]
  const [warmupReward, activeReward] = liquidRewards as readonly [bigint, bigint]
  // liquidStake 先进 warmup；expiry 为 epoch 编号，勿当 unix 展示。
  if (warmupExists && warmupPrincipal > 0n) {
    rows.push({
      id: 'liquid-warmup',
      kind: 'liquid',
      period: 'liquid',
      pool: liquidPool,
      stakeIndex: null,
      principal: warmupPrincipal,
      releasedPrincipal: 0n,
      blockReward: warmupReward,
      extraInterest: 0n,
      claimableBalance: 0n,
      expiry: warmupExpiry,
      inWarmup: true,
      warmupExpired: Boolean(warmupExpired),
    })
  }
  if (exists && principal > 0n) {
    rows.push({
      id: 'liquid',
      kind: 'liquid',
      period: 'liquid',
      pool: liquidPool,
      stakeIndex: null,
      principal,
      releasedPrincipal: 0n,
      blockReward: activeReward,
      extraInterest: 0n,
      claimableBalance: 0n,
      expiry,
    })
  }

  const lockedPoolCounts = await Promise.all(
    LOCKED_PERIODS.map(async (period) => {
      const pool = stakePoolAddress(period)
      const count = Number(
        await client.readContract({
          address: pool,
          abi: lockedAbi,
          functionName: 'getStakesCount',
          args: [user],
        }),
      )
      return { period, pool, count }
    }),
  )

  for (const { period, pool, count } of lockedPoolCounts) {
    // 手册：start >= total 会 revert；空仓勿调 getStakes。
    if (!Number.isFinite(count) || count <= 0) continue

    const stakes = (await client.readContract({
      address: pool,
      abi: lockedAbi,
      functionName: 'getStakes',
      args: [user, 0n, BigInt(count)],
    })) as readonly {
      pending: bigint
      blockReward: bigint
      extraInterest: bigint
      claimableBalance: bigint
      expiry: bigint
    }[]

    const releasedResults = await readAggregate3(
      client,
      stakes.map((_, index) => ({
        target: pool,
        callData: encodeFunctionData({
          abi: lockedAbi,
          functionName: 'getReleasedPrincipal',
          args: [user, BigInt(index)],
        }),
      })),
    )

    for (let index = 0; index < stakes.length; index += 1) {
      const data = stakes[index]
      if (!data) continue
      if (
        data.pending <= 0n &&
        data.blockReward <= 0n &&
        data.extraInterest <= 0n &&
        data.claimableBalance <= 0n
      ) {
        continue
      }
      const releasedResult = releasedResults[index]
      if (!releasedResult?.success) {
        throw new Error(`LOCKED_RELEASED_MULTICALL_FAILED:${period}:${index}`)
      }
      const released = decodeFunctionResult({
        abi: lockedAbi,
        functionName: 'getReleasedPrincipal',
        data: releasedResult.returnData,
      }) as bigint
      rows.push({
        id: `locked-${period}-${index}`,
        kind: 'locked',
        period,
        pool,
        stakeIndex: index,
        principal: data.pending,
        releasedPrincipal: released,
        blockReward: data.blockReward,
        extraInterest: data.extraInterest,
        claimableBalance: data.claimableBalance,
        expiry: data.expiry,
      })
    }
  }

  return rows
}

async function readBondPositionsFor(
  kind: 'lp' | 'burn',
  user: Address,
  client: ChainReadClient,
): Promise<AssetsBondRow[]> {
  const rows: AssetsBondRow[] = []
  const poolCounts = await Promise.all(
    LOCKED_PERIODS.map(async (period) => {
      const depository =
        kind === 'lp' ? lpBondDepositoryAddress(period) : burnBondDepositoryAddress(period)
      const count = Number(
        await client.readContract({
          address: depository,
          abi: bondAbi,
          functionName: 'getBondCount',
          args: [user],
        }),
      )
      return { period, depository, count }
    }),
  )

  for (const { period, depository, count } of poolCounts) {
    if (!Number.isFinite(count) || count <= 0) continue

    // Bond 无批量列表 view：每仓位 3 读合并为一次 Multicall3（禁 3N 串行 eth_call）。
    const calls: Aggregate3Call[] = []
    for (let bondIndex = 0; bondIndex < count; bondIndex += 1) {
      calls.push(
        {
          target: depository,
          callData: encodeFunctionData({
            abi: bondAbi,
            functionName: 'getBondInfo',
            args: [user, BigInt(bondIndex)],
          }),
        },
        {
          target: depository,
          callData: encodeFunctionData({
            abi: bondAbi,
            functionName: 'pendingPayoutFor',
            args: [user, BigInt(bondIndex)],
          }),
        },
        {
          target: depository,
          callData: encodeFunctionData({
            abi: bondAbi,
            functionName: 'getStakeProfit',
            args: [user, BigInt(bondIndex)],
          }),
        },
      )
    }

    const results = await readAggregate3(client, calls)
    for (let bondIndex = 0; bondIndex < count; bondIndex += 1) {
      const base = bondIndex * 3
      const infoResult = results[base]
      const pendingResult = results[base + 1]
      const profitResult = results[base + 2]
      if (!infoResult?.success || !pendingResult?.success || !profitResult?.success) {
        throw new Error(`BOND_POSITION_MULTICALL_FAILED:${kind}:${period}:${bondIndex}`)
      }
      const info = decodeFunctionResult({
        abi: bondAbi,
        functionName: 'getBondInfo',
        data: infoResult.returnData,
      }) as readonly [
        bigint,
        bigint,
        bigint,
        bigint,
        boolean,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
      ]
      const [, , , , exists, , payoutRemaining, vestingEndTime] = info
      if (!exists) continue
      const pendingPayout = decodeFunctionResult({
        abi: bondAbi,
        functionName: 'pendingPayoutFor',
        data: pendingResult.returnData,
      }) as bigint
      const profit = decodeFunctionResult({
        abi: bondAbi,
        functionName: 'getStakeProfit',
        data: profitResult.returnData,
      }) as bigint
      rows.push({
        id: `${kind}-${period}-${bondIndex}`,
        kind,
        period,
        depository,
        bondIndex,
        payoutRemaining,
        pendingPayout,
        profit,
        vestingEndTime,
        exists,
      })
    }
  }
  return rows
}

export function readLpBondPositions(user: Address, client: ChainReadClient = bscReadClient) {
  return readBondPositionsFor('lp', user, client)
}

export function readBurnBondPositions(user: Address, client: ChainReadClient = bscReadClient) {
  return readBondPositionsFor('burn', user, client)
}

export async function readXminePosition(
  user: Address,
  client: ChainReadClient = bscReadClient,
): Promise<AssetsXminePosition> {
  // `stakes` 为裸 mapping：先解析迁移 root；业务 view 仍传当前地址。
  const migratedFrom = await readMigratedFrom(user, client)
  const stakeRoot = migrationStakeRoot(user, migratedFrom) as Address

  const [pending, pendingValue, miningStake, stake] = await Promise.all([
    client.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: xmineAbi,
      functionName: 'pendingReward',
      args: [user],
    }),
    client.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: xmineAbi,
      functionName: 'pendingRewardValue',
      args: [user],
    }),
    client.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: xmineAbi,
      functionName: 'miningStakeAmountOf',
      args: [user],
    }),
    client.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: xmineAbi,
      functionName: 'stakes',
      args: [stakeRoot],
    }),
  ])
  const [gons, warmupGons, , warmupEndTime] = stake as readonly [
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
  ]
  return {
    pending: pending as bigint,
    pendingValue: pendingValue as bigint,
    miningStake: miningStake as bigint,
    gons,
    warmupGons,
    warmupEndTime,
  }
}

/** Live Mixed claimable for block — never trust modal snapshot alone. */
export async function readMixedRewardAvailable(
  target:
    | { source: 'liquid' }
    | { source: 'locked'; pool: Address; stakeIndex: number; extra?: boolean }
    | { source: 'bond'; depository: Address; bondIndex: number },
  user: Address,
  client: ChainReadClient,
): Promise<bigint> {
  if (target.source === 'liquid') {
    const rewards = await client.readContract({
      address: stakePoolAddress('liquid'),
      abi: liquidAbi,
      functionName: 'getStakeRewards',
      args: [user],
    })
    const [, activeReward] = rewards as readonly [bigint, bigint]
    return activeReward
  }

  if (target.source === 'locked') {
    const stake = await client.readContract({
      address: target.pool,
      abi: lockedAbi,
      functionName: 'getStake',
      args: [user, BigInt(target.stakeIndex)],
    })
    const data = stake as { blockReward: bigint; extraInterest: bigint }
    return target.extra ? data.extraInterest : data.blockReward
  }

  const profit = await client.readContract({
    address: target.depository,
    abi: bondAbi,
    functionName: 'getStakeProfit',
    args: [user, BigInt(target.bondIndex)],
  })
  return profit as bigint
}

export async function readStakeRedeemableAmount(
  row: AssetsStakeRow,
  user: Address,
  client: ChainReadClient,
): Promise<bigint> {
  if (row.kind === 'liquid') {
    // 活期 `stakes` 裸 mapping：须迁移 root。
    const migratedFrom = await readMigratedFrom(user, client)
    const stakeRoot = migrationStakeRoot(user, migratedFrom) as Address
    const liquidStake = await client.readContract({
      address: row.pool,
      abi: liquidAbi,
      functionName: 'stakes',
      args: [stakeRoot],
    })
    const [principal, , , , exists] = liquidStake as readonly [
      bigint,
      bigint,
      bigint,
      bigint,
      boolean,
    ]
    return exists ? principal : 0n
  }

  if (row.stakeIndex == null) return 0n
  const released = await client.readContract({
    address: row.pool,
    abi: lockedAbi,
    functionName: 'getReleasedPrincipal',
    args: [user, BigInt(row.stakeIndex)],
  })
  return released as bigint
}

export async function readBondRedeemableAmount(
  row: AssetsBondRow,
  user: Address,
  client: ChainReadClient,
): Promise<bigint> {
  return (await client.readContract({
    address: row.depository,
    abi: bondAbi,
    functionName: 'pendingPayoutFor',
    args: [user, BigInt(row.bondIndex)],
  })) as bigint
}
