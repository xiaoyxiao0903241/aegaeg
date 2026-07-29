import { parseAbi } from 'viem'
import { BSC_CONTRACTS, type Address } from '~/shared/config/contracts'
import type { DurationPlan } from '~/core/assets/claim-plans'
import {
  AGX_CONTRIBUTION_SWAP_METHODS,
  BOND_DEPOSITORY_ASSETS_METHODS,
  LIQUID_STAKING_ASSETS_METHODS,
  LOCKED_STAKING_ASSETS_METHODS,
  RESTAKE_CONFIG_METHODS,
  REWARD_QUEUE_METHODS,
  X_STAKING_POOL_METHODS,
} from '~/web3/abis'
import type { ChainReadClient } from '~/web3/chain-read-client'
import {
  resolveBurnBondDepository,
  resolveLpBondDepository,
  resolveStakePoolAddress,
} from '~/web3/staking/resolve-staking-addresses'
import type { StakePeriod } from '~/core/staking/staking-period'

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
])
const lockedAbi = parseAbi([
  LOCKED_STAKING_ASSETS_METHODS.getStakesCount,
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
  miningStake: bigint
  gons: bigint
  warmupGons: bigint
  warmupEndTime: bigint
}

export async function readClaimPlans(client: ChainReadClient): Promise<{
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
  client: ChainReadClient,
): Promise<{ contribution: bigint; requiredContribution: bigint }> {
  const root = (await client.readContract({
    address: BSC_CONTRACTS.agxContributionSwap,
    abi: contribAbi,
    functionName: 'originalOf',
    args: [user],
  })) as Address
  const contributionRoot = root === '0x0000000000000000000000000000000000000000' ? user : root

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
  client: ChainReadClient,
): Promise<AssetsStakeRow[]> {
  const rows: AssetsStakeRow[] = []

  const liquidPool = resolveStakePoolAddress('liquid')
  const [liquidStake, liquidRewards] = await Promise.all([
    client.readContract({
      address: liquidPool,
      abi: liquidAbi,
      functionName: 'stakes',
      args: [user],
    }),
    client.readContract({
      address: liquidPool,
      abi: liquidAbi,
      functionName: 'getStakeRewards',
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
  const [, activeReward] = liquidRewards as readonly [bigint, bigint]
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

  for (const period of LOCKED_PERIODS) {
    const pool = resolveStakePoolAddress(period)
    const count = Number(
      await client.readContract({
        address: pool,
        abi: lockedAbi,
        functionName: 'getStakesCount',
        args: [user],
      }),
    )
    for (let index = 0; index < count; index += 1) {
      const [stake, released] = await Promise.all([
        client.readContract({
          address: pool,
          abi: lockedAbi,
          functionName: 'getStake',
          args: [user, BigInt(index)],
        }),
        client.readContract({
          address: pool,
          abi: lockedAbi,
          functionName: 'getReleasedPrincipal',
          args: [user, BigInt(index)],
        }),
      ])
      const data = stake as {
        pending: bigint
        blockReward: bigint
        extraInterest: bigint
        claimableBalance: bigint
        expiry: bigint
      }
      if (
        data.pending <= 0n &&
        data.blockReward <= 0n &&
        data.extraInterest <= 0n &&
        data.claimableBalance <= 0n
      ) {
        continue
      }
      rows.push({
        id: `locked-${period}-${index}`,
        kind: 'locked',
        period,
        pool,
        stakeIndex: index,
        principal: data.pending,
        releasedPrincipal: released as bigint,
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
  for (const period of LOCKED_PERIODS) {
    const depository =
      kind === 'lp' ? resolveLpBondDepository(period) : resolveBurnBondDepository(period)
    const count = Number(
      await client.readContract({
        address: depository,
        abi: bondAbi,
        functionName: 'getBondCount',
        args: [user],
      }),
    )
    for (let bondIndex = 0; bondIndex < count; bondIndex += 1) {
      const [info, pendingPayout, profit] = await Promise.all([
        client.readContract({
          address: depository,
          abi: bondAbi,
          functionName: 'getBondInfo',
          args: [user, BigInt(bondIndex)],
        }),
        client.readContract({
          address: depository,
          abi: bondAbi,
          functionName: 'pendingPayoutFor',
          args: [user, BigInt(bondIndex)],
        }),
        client.readContract({
          address: depository,
          abi: bondAbi,
          functionName: 'getStakeProfit',
          args: [user, BigInt(bondIndex)],
        }),
      ])
      const [, , , , exists, , payoutRemaining, vestingEndTime] = info as readonly [
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
      if (!exists) continue
      rows.push({
        id: `${kind}-${period}-${bondIndex}`,
        kind,
        period,
        depository,
        bondIndex,
        payoutRemaining,
        pendingPayout: pendingPayout as bigint,
        profit: profit as bigint,
        vestingEndTime,
        exists,
      })
    }
  }
  return rows
}

export function readLpBondPositions(user: Address, client: ChainReadClient) {
  return readBondPositionsFor('lp', user, client)
}

export function readBurnBondPositions(user: Address, client: ChainReadClient) {
  return readBondPositionsFor('burn', user, client)
}

export async function readXminePosition(
  user: Address,
  client: ChainReadClient,
): Promise<AssetsXminePosition> {
  const [pending, miningStake, stake] = await Promise.all([
    client.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: xmineAbi,
      functionName: 'pendingReward',
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
      args: [user],
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
    miningStake: miningStake as bigint,
    gons,
    warmupGons,
    warmupEndTime,
  }
}

/** Live Mixed claimable for gate — never trust modal snapshot alone. */
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
      address: resolveStakePoolAddress('liquid'),
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
    const liquidStake = await client.readContract({
      address: row.pool,
      abi: liquidAbi,
      functionName: 'stakes',
      args: [user],
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
