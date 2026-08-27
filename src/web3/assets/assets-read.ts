import { encodeFunctionData, parseAbi } from 'viem'

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
import { readMigratedFrom } from '~/web3/migration/migration-read'
import { type Aggregate3Call, decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'
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
 * @returns releasePlans / restakePlans 两个时长计划数组
 * @see 手册 §12 RewardQueue 奖励释放队列
 * @see 手册 §9 贡献值与 Mixed 领奖
 */
export async function readClaimPlans(): Promise<{
  releasePlans: DurationPlan[]
  restakePlans: DurationPlan[]
}> {
  const planHead = await readAggregate3([
    {
      target: BSC_CONTRACTS.rewardQueue,
      callData: encodeFunctionData({ abi: rewardQueueAbi, functionName: 'queuePlans' }),
    },
    {
      target: BSC_CONTRACTS.restakeConfig,
      callData: encodeFunctionData({ abi: restakeConfigAbi, functionName: 'getPlanCount' }),
    },
  ])
  const queuePlans = decodeAggregate3Result<
    readonly {
      releaseDuration: bigint
      feeRate: bigint
      feeRecipient: Address
    }[]
  >(planHead, 0, rewardQueueAbi, 'queuePlans', 'CLAIM_PLANS_MULTICALL_FAILED:queuePlans')
  const planCount = decodeAggregate3Result<bigint>(
    planHead,
    1,
    restakeConfigAbi,
    'getPlanCount',
    'CLAIM_PLANS_MULTICALL_FAILED:planCount',
  )

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
  if (count > 0) {
    const planResults = await readAggregate3(
      Array.from({ length: count }, (_, index) => ({
        target: BSC_CONTRACTS.restakeConfig,
        callData: encodeFunctionData({
          abi: restakeConfigAbi,
          functionName: 'getPlan',
          args: [BigInt(index)],
        }),
      })),
    )
    for (let index = 0; index < count; index += 1) {
      const [period, taxBP, , exists] = decodeAggregate3Result<
        readonly [bigint, bigint, Address, boolean]
      >(
        planResults,
        index,
        restakeConfigAbi,
        'getPlan',
        `CLAIM_PLANS_MULTICALL_FAILED:plan:${index}`,
      )
      restakePlans.push({
        index,
        durationSeconds: period,
        taxBps: taxBP,
        exists,
      })
    }
  }

  return { releasePlans, restakePlans }
}

/**
 * 读取用户贡献值；可选再读领取额对应的链上所需贡献。
 *
 * 贡献值按迁移 root 键控（AgxContributionSwap.originalOf 解析 root）。
 * 资产 Mixed 门槛已是领取额 1:1，不读 quote；Lucky / 奖励 Mixed 仍读 quote。
 *
 * @param user 钱包地址
 * @param rewardAmount 待领取奖励金额（wei）；`quoteRequired` 为 false 时可忽略
 * @param quoteRequired 是否调用 quoteRequiredContribution
 * @returns 当前贡献值 contribution 与所需贡献值 requiredContribution
 * @see 手册 §9.2 贡献值页面
 */
export async function readContributionSnapshot(
  user: Address,
  rewardAmount: bigint,
  quoteRequired = true,
): Promise<{ contribution: bigint; requiredContribution: bigint }> {
  const root = (await bscReadClient.readContract({
    address: BSC_CONTRACTS.agxContributionSwap,
    abi: contribAbi,
    functionName: 'originalOf',
    args: [user],
  })) as Address
  const contributionRoot = root.toLowerCase() === ZERO_ADDRESS ? user : root

  const calls: Aggregate3Call[] = [
    {
      target: BSC_CONTRACTS.agxContributionSwap,
      callData: encodeFunctionData({
        abi: contribAbi,
        functionName: 'userContribution',
        args: [contributionRoot],
      }),
    },
  ]
  if (quoteRequired) {
    calls.push({
      target: BSC_CONTRACTS.agxContributionSwap,
      callData: encodeFunctionData({
        abi: contribAbi,
        functionName: 'quoteRequiredContribution',
        args: [rewardAmount],
      }),
    })
  }
  const hop2 = await readAggregate3(calls)
  return {
    contribution: decodeAggregate3Result<bigint>(
      hop2,
      0,
      contribAbi,
      'userContribution',
      'CONTRIBUTION_SNAPSHOT_MULTICALL_FAILED:contribution',
    ),
    requiredContribution: quoteRequired
      ? decodeAggregate3Result<bigint>(
          hop2,
          1,
          contribAbi,
          'quoteRequiredContribution',
          'CONTRIBUTION_SNAPSHOT_MULTICALL_FAILED:required',
        )
      : 0n,
  }
}

/**
 * 读取用户全部质押仓位（活期 + 180/360/540 定期）。
 *
 * 活期含 warmup 仓；定期先按 getStakesCount 判断，空仓跳过不调 getStakes。
 * 非空池的 getStakes 与 getReleasedPrincipal 合并为一次 Multicall3。
 * 仅返回有余额的仓位。
 *
 * @param user 钱包地址
 * @returns 资产页质押行数组，无仓位时为空数组
 * @see 手册 §8.2 活期 LiquidStaking
 * @see 手册 §8.3 定期 LockedStaking
 */
export async function readStakePositions(user: Address): Promise<AssetsStakeRow[]> {
  const rows: AssetsStakeRow[] = []

  const liquidPool = stakePoolAddress('liquid')
  // `stakes`/`warmupStakes` 为裸 mapping：须先解析迁移 root；`getStakeRewards` 别名感知，直接传当前钱包。
  const liquidMigratedFrom = await readMigratedFrom(user)
  const liquidRoot = migrationStakeRoot(user, liquidMigratedFrom) as Address
  const liquidResults = await readAggregate3([
    {
      target: liquidPool,
      callData: encodeFunctionData({
        abi: liquidAbi,
        functionName: 'stakes',
        args: [liquidRoot],
      }),
    },
    {
      target: liquidPool,
      callData: encodeFunctionData({
        abi: liquidAbi,
        functionName: 'warmupStakes',
        args: [liquidRoot],
      }),
    },
    {
      target: liquidPool,
      callData: encodeFunctionData({
        abi: liquidAbi,
        functionName: 'getStakeRewards',
        args: [user],
      }),
    },
    {
      target: liquidPool,
      callData: encodeFunctionData({
        abi: liquidAbi,
        functionName: 'isWarmupExpired',
        args: [user],
      }),
    },
  ])
  const liquidStake = decodeAggregate3Result<readonly [bigint, bigint, bigint, bigint, boolean]>(
    liquidResults,
    0,
    liquidAbi,
    'stakes',
    'STAKE_POSITIONS_MULTICALL_FAILED:stakes',
  )
  const liquidWarmup = decodeAggregate3Result<readonly [bigint, bigint, bigint, bigint, boolean]>(
    liquidResults,
    1,
    liquidAbi,
    'warmupStakes',
    'STAKE_POSITIONS_MULTICALL_FAILED:warmupStakes',
  )
  const liquidRewards = decodeAggregate3Result<readonly [bigint, bigint]>(
    liquidResults,
    2,
    liquidAbi,
    'getStakeRewards',
    'STAKE_POSITIONS_MULTICALL_FAILED:rewards',
  )
  const warmupExpired = decodeAggregate3Result<boolean>(
    liquidResults,
    3,
    liquidAbi,
    'isWarmupExpired',
    'STAKE_POSITIONS_MULTICALL_FAILED:warmupExpired',
  )
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

  const lockedCountResults = await readAggregate3(
    BOND_PERIODS.map((period) => ({
      target: stakePoolAddress(period),
      callData: encodeFunctionData({
        abi: lockedAbi,
        functionName: 'getStakesCount',
        args: [user],
      }),
    })),
  )
  const lockedPoolCounts = BOND_PERIODS.map((period, index) => {
    const count = Number(
      decodeAggregate3Result<bigint>(
        lockedCountResults,
        index,
        lockedAbi,
        'getStakesCount',
        `STAKE_POSITIONS_MULTICALL_FAILED:count:${period}`,
      ),
    )
    return { period, pool: stakePoolAddress(period), count }
  })

  // getStakes / getReleasedPrincipal 都只依赖 count，空仓跳过（start >= total 会 revert）。
  const occupiedPools = lockedPoolCounts.filter(
    (item) => Number.isFinite(item.count) && item.count > 0,
  )
  const lockedCalls: Aggregate3Call[] = occupiedPools.map(({ pool, count }) => ({
    target: pool,
    callData: encodeFunctionData({
      abi: lockedAbi,
      functionName: 'getStakes',
      args: [user, 0n, BigInt(count)],
    }),
  }))
  for (const { pool, count } of occupiedPools) {
    for (let index = 0; index < count; index += 1) {
      lockedCalls.push({
        target: pool,
        callData: encodeFunctionData({
          abi: lockedAbi,
          functionName: 'getReleasedPrincipal',
          args: [user, BigInt(index)],
        }),
      })
    }
  }

  const lockedResults = await readAggregate3(lockedCalls)
  let releasedBase = occupiedPools.length
  for (let poolIndex = 0; poolIndex < occupiedPools.length; poolIndex += 1) {
    const occupied = occupiedPools[poolIndex]!
    const { period, pool, count } = occupied
    const stakes = decodeAggregate3Result<
      readonly {
        pending: bigint
        blockReward: bigint
        extraInterest: bigint
        claimableBalance: bigint
        expiry: bigint
      }[]
    >(
      lockedResults,
      poolIndex,
      lockedAbi,
      'getStakes',
      `STAKE_POSITIONS_MULTICALL_FAILED:stakes:${period}`,
    )

    for (let index = 0; index < count; index += 1) {
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
      const released = decodeAggregate3Result<bigint>(
        lockedResults,
        releasedBase + index,
        lockedAbi,
        'getReleasedPrincipal',
        `LOCKED_RELEASED_MULTICALL_FAILED:${period}:${index}`,
      )
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
    releasedBase += count
  }

  return rows
}

async function readBondPositionsFor(kind: 'lp' | 'burn', user: Address): Promise<AssetsBondRow[]> {
  const rows: AssetsBondRow[] = []
  const poolCountResults = await readAggregate3(
    BOND_PERIODS.map((period) => {
      const depository =
        kind === 'lp' ? lpBondDepositoryAddress(period) : burnBondDepositoryAddress(period)
      return {
        target: depository,
        callData: encodeFunctionData({
          abi: bondAbi,
          functionName: 'getBondCount',
          args: [user],
        }),
      }
    }),
  )
  const poolCounts = BOND_PERIODS.map((period, index) => {
    const depository =
      kind === 'lp' ? lpBondDepositoryAddress(period) : burnBondDepositoryAddress(period)
    const count = Number(
      decodeAggregate3Result<bigint>(
        poolCountResults,
        index,
        bondAbi,
        'getBondCount',
        `BOND_POSITION_MULTICALL_FAILED:count:${kind}:${period}`,
      ),
    )
    return { period, depository, count }
  })

  // Bond 无批量列表 view：所有非空池的仓位 3 读合并为一次 Multicall3。
  const occupiedBonds = poolCounts.filter((item) => Number.isFinite(item.count) && item.count > 0)
  const bondCalls: Aggregate3Call[] = []
  for (const { depository, count } of occupiedBonds) {
    for (let bondIndex = 0; bondIndex < count; bondIndex += 1) {
      bondCalls.push(
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
  }

  const bondResults = await readAggregate3(bondCalls)
  let bondCursor = 0
  for (const { period, depository, count } of occupiedBonds) {
    for (let bondIndex = 0; bondIndex < count; bondIndex += 1) {
      const info = decodeAggregate3Result<
        readonly [bigint, bigint, bigint, bigint, boolean, bigint, bigint, bigint, bigint, bigint]
      >(
        bondResults,
        bondCursor,
        bondAbi,
        'getBondInfo',
        `BOND_POSITION_MULTICALL_FAILED:${kind}:${period}:${bondIndex}`,
      )
      const pendingPayout = decodeAggregate3Result<bigint>(
        bondResults,
        bondCursor + 1,
        bondAbi,
        'pendingPayoutFor',
        `BOND_POSITION_MULTICALL_FAILED:${kind}:${period}:${bondIndex}`,
      )
      const profit = decodeAggregate3Result<bigint>(
        bondResults,
        bondCursor + 2,
        bondAbi,
        'getStakeProfit',
        `BOND_POSITION_MULTICALL_FAILED:${kind}:${period}:${bondIndex}`,
      )
      bondCursor += 3
      const [, , , , exists, , payoutRemaining, vestingEndTime] = info
      if (!exists) continue
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
 * @returns 资产页 LP 债券行数组
 * @see 手册 §10 债券 Bond / BurnBond
 */
export function readLpBondPositions(user: Address) {
  return readBondPositionsFor('lp', user)
}

/**
 * 读取用户全部 Burn 债券仓位。
 *
 * @param user 钱包地址
 * @returns 资产页 Burn 债券行数组
 * @see 手册 §10 债券 Bond / BurnBond
 */
export function readBurnBondPositions(user: Address) {
  return readBondPositionsFor('burn', user)
}

/**
 * 读取 X 挖矿持仓（pending 奖励、挖矿质押量、warmup 状态）。
 *
 * `stakes` 为裸 mapping，须先解析迁移 root；其余业务 view 直接传当前地址。
 *
 * @param user 钱包地址
 * @returns 挖矿持仓快照，含 pending 价值口径
 * @see 手册 §15 XStakingPool X 挖矿
 */
export async function readXminePosition(user: Address): Promise<AssetsXminePosition> {
  // `stakes` 为裸 mapping：先解析迁移 root；业务 view 仍传当前地址。
  const migratedFrom = await readMigratedFrom(user)
  const stakeRoot = migrationStakeRoot(user, migratedFrom) as Address

  const pool = BSC_CONTRACTS.xStakingPool
  const results = await readAggregate3([
    {
      target: pool,
      callData: encodeFunctionData({
        abi: xmineAbi,
        functionName: 'pendingReward',
        args: [user],
      }),
    },
    {
      target: pool,
      callData: encodeFunctionData({
        abi: xmineAbi,
        functionName: 'pendingRewardValue',
        args: [user],
      }),
    },
    {
      target: pool,
      callData: encodeFunctionData({
        abi: xmineAbi,
        functionName: 'miningStakeAmountOf',
        args: [user],
      }),
    },
    {
      target: pool,
      callData: encodeFunctionData({
        abi: xmineAbi,
        functionName: 'stakes',
        args: [stakeRoot],
      }),
    },
  ])
  const pending = decodeAggregate3Result<bigint>(
    results,
    0,
    xmineAbi,
    'pendingReward',
    'XMINE_POSITION_MULTICALL_FAILED:pending',
  )
  const pendingValue = decodeAggregate3Result<bigint>(
    results,
    1,
    xmineAbi,
    'pendingRewardValue',
    'XMINE_POSITION_MULTICALL_FAILED:pendingValue',
  )
  const miningStake = decodeAggregate3Result<bigint>(
    results,
    2,
    xmineAbi,
    'miningStakeAmountOf',
    'XMINE_POSITION_MULTICALL_FAILED:miningStake',
  )
  const stake = decodeAggregate3Result<readonly [bigint, bigint, bigint, bigint, bigint]>(
    results,
    3,
    xmineAbi,
    'stakes',
    'XMINE_POSITION_MULTICALL_FAILED:stakes',
  )
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
 * @returns 可领取奖励金额（wei）
 * @see 手册 §9.3 Mixed 领奖前端流程
 */
export async function readMixedRewardAvailable(
  target:
    | { source: 'liquid' }
    | { source: 'locked'; pool: Address; stakeIndex: number; extra?: boolean }
    | { source: 'bond'; depository: Address; bondIndex: number },
  user: Address,
): Promise<bigint> {
  if (target.source === 'liquid') {
    const rewards = await bscReadClient.readContract({
      address: stakePoolAddress('liquid'),
      abi: liquidAbi,
      functionName: 'getStakeRewards',
      args: [user],
    })
    const [, activeReward] = rewards as readonly [bigint, bigint]
    return activeReward
  }

  if (target.source === 'locked') {
    const stake = await bscReadClient.readContract({
      address: target.pool,
      abi: lockedAbi,
      functionName: 'getStake',
      args: [user, BigInt(target.stakeIndex)],
    })
    const data = stake as { blockReward: bigint; extraInterest: bigint }
    return target.extra ? data.extraInterest : data.blockReward
  }

  const profit = await bscReadClient.readContract({
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
 * @returns 可赎回本金（wei）；无仓位返回 0n
 * @see 手册 §13 PrincipalReleaseVault 本金释放
 */
export async function readStakeRedeemableAmount(
  row: AssetsStakeRow,
  user: Address,
): Promise<bigint> {
  if (row.kind === 'liquid') {
    // 活期 `stakes` 裸 mapping：须迁移 root。
    const migratedFrom = await readMigratedFrom(user)
    const stakeRoot = migrationStakeRoot(user, migratedFrom) as Address
    const liquidStake = await bscReadClient.readContract({
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
  const released = await bscReadClient.readContract({
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
 * @returns 可赎回金额（wei）
 * @see 手册 §10 债券 Bond / BurnBond
 */
export async function readBondRedeemableAmount(row: AssetsBondRow, user: Address): Promise<bigint> {
  return (await bscReadClient.readContract({
    address: row.depository,
    abi: bondAbi,
    functionName: 'pendingPayoutFor',
    args: [user, BigInt(row.bondIndex)],
  })) as bigint
}
