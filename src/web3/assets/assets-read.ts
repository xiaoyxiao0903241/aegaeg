import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem'

import type { DurationPlan } from '~/core/assets/claim-plans'
import { ZERO_ADDRESS } from '~/core/constants'
import { migrationStakeRoot } from '~/core/migration/migration-user'
import { BOND_PERIODS, type StakePeriod } from '~/core/staking/staking-period'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
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
  /** 活期 warmup 仓：禁本金退出 / Mixed，须 claim() 激活。 */
  inWarmup?: boolean
  /** 是否已过 warmup（isWarmupExpired），仅 warmup 行有意义。 */
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
  /** pending 的 AGX/gAGX 价值口径（§15.3）。 */
  pendingValue: bigint
  miningStake: bigint
  gons: bigint
  warmupGons: bigint
  warmupEndTime: bigint
}

/**
 * 读取释放计划与复投计划。
 *
 * 释放计划由 RewardQueue.queuePlans 一次取回；复投计划逐档 RestakeConfig.getPlan 读取，
 * 保留链上原始 index，供 Mixed 领取参数使用。
 *
 * @param client 链读取客户端，默认 BSC 主网
 * @returns releasePlans / restakePlans 两个时长计划数组
 * @see 手册 §12 RewardQueue 奖励释放队列
 * @see 手册 §9 贡献值与 Mixed 领奖
 */
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

/**
 * 读取用户贡献值，以及领取 rewardAmount 所需贡献值。
 *
 * 贡献值按迁移 root 键控（AgxContributionSwap.originalOf 解析 root）；required 由
 * quoteRequiredContribution 预估。前端据此判断 Mixed 领取前是否满足贡献值门槛。
 *
 * @param user 钱包地址
 * @param rewardAmount 待领取奖励金额（wei）
 * @param client 链读取客户端，默认 BSC 主网
 * @returns 当前贡献值 contribution 与所需贡献值 requiredContribution
 * @see 手册 §9.2 贡献值页面
 */
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

/**
 * 读取用户全部质押仓位（活期 + 180/360/540 定期）。
 *
 * 活期含 warmup 仓；定期先按 getStakesCount 判断，空仓跳过不调 getStakes。
 * 仅返回有余额的仓位。
 *
 * @param user 钱包地址
 * @param client 链读取客户端，默认 BSC 主网
 * @returns 资产页质押行数组，无仓位时为空数组
 * @see 手册 §8.2 活期 LiquidStaking
 * @see 手册 §8.3 定期 LockedStaking
 */
export async function readStakePositions(
  user: Address,
  client: ChainReadClient = bscReadClient,
): Promise<AssetsStakeRow[]> {
  const rows: AssetsStakeRow[] = []

  const liquidPool = stakePoolAddress('liquid')
  // `stakes`/`warmupStakes` 为裸 mapping：须先解析迁移 root；`getStakeRewards` 别名感知，直接传当前钱包。
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
    BOND_PERIODS.map(async (period) => {
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
    BOND_PERIODS.map(async (period) => {
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

/**
 * 读取用户全部 LP 债券仓位。
 *
 * @param user 钱包地址
 * @param client 链读取客户端，默认 BSC 主网
 * @returns 资产页 LP 债券行数组
 * @see 手册 §10 债券 Bond / BurnBond
 */
export function readLpBondPositions(user: Address, client: ChainReadClient = bscReadClient) {
  return readBondPositionsFor('lp', user, client)
}

/**
 * 读取用户全部 Burn 债券仓位。
 *
 * @param user 钱包地址
 * @param client 链读取客户端，默认 BSC 主网
 * @returns 资产页 Burn 债券行数组
 * @see 手册 §10 债券 Bond / BurnBond
 */
export function readBurnBondPositions(user: Address, client: ChainReadClient = bscReadClient) {
  return readBondPositionsFor('burn', user, client)
}

/**
 * 读取 X 挖矿持仓（pending 奖励、挖矿质押量、warmup 状态）。
 *
 * `stakes` 为裸 mapping，须先解析迁移 root；其余业务 view 直接传当前地址。
 *
 * @param user 钱包地址
 * @param client 链读取客户端，默认 BSC 主网
 * @returns 挖矿持仓快照，含 pending 价值口径
 * @see 手册 §15 XStakingPool X 挖矿
 */
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

/**
 * 读取某一来源当前可 Mixed 领取的实时奖励。
 *
 * 弹窗里的快照可能已过期，提交前用本函数复读，避免基于旧数据下单。
 *
 * @param target 领取来源：活期 / 定期（可选额外利息）/ 债券
 * @param user 钱包地址
 * @param client 链读取客户端
 * @returns 可领取奖励金额（wei）
 * @see 手册 §9.3 Mixed 领奖前端流程
 */
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

/**
 * 读取质押行当前可赎回本金。
 *
 * 活期按迁移 root 查裸 mapping；定期读 getReleasedPrincipal。
 *
 * @param row 资产页质押行
 * @param user 钱包地址
 * @param client 链读取客户端
 * @returns 可赎回本金（wei）；无仓位返回 0n
 * @see 手册 §13 PrincipalReleaseVault 本金释放
 */
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

/**
 * 读取债券行当前可赎回金额（pendingPayoutFor）。
 *
 * @param row 资产页债券行
 * @param user 钱包地址
 * @param client 链读取客户端
 * @returns 可赎回金额（wei）
 * @see 手册 §10 债券 Bond / BurnBond
 */
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
