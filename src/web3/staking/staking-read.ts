import { encodeFunctionData, parseAbi } from 'viem'

import { BPS_DENOM } from '~/core/exchange/bps'
import { migrationStakeRoot } from '~/core/migration/migration-user'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  ACCOUNT_MIGRATION_METHODS,
  BOND_DEPOSITORY_MARKET_METHODS,
  BOND_HELPER_METHODS,
  ERC20_METHODS,
  LIQUID_STAKING_METHODS,
  LOCKED_STAKING_METHODS,
  REFERRAL_METHODS,
  X_STAKING_POOL_METHODS,
} from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { type Aggregate3Call, decodeAggregate3Result, readAggregate3 } from '~/web3/multicall3-read'

const liquidAbi = parseAbi([
  LIQUID_STAKING_METHODS.remainingStakeAmount,
  LIQUID_STAKING_METHODS.isWarmupExpired,
])
const lockedAbi = parseAbi([
  LOCKED_STAKING_METHODS.remainingStakeAmount,
  LOCKED_STAKING_METHODS.status,
  LOCKED_STAKING_METHODS.singleAddressLimit,
  LOCKED_STAKING_METHODS.userStakingAmounts,
  LOCKED_STAKING_METHODS.periodTime,
])
const bondHelperAbi = parseAbi([BOND_HELPER_METHODS.authContracts])
const bondMarketAbi = parseAbi([
  BOND_DEPOSITORY_MARKET_METHODS.discountRateBP,
  BOND_DEPOSITORY_MARKET_METHODS.terms,
])
const xStakingAbi = parseAbi([
  X_STAKING_POOL_METHODS.miningQuotaOf,
  X_STAKING_POOL_METHODS.miningStakeAmountOf,
])
const erc20Abi = parseAbi([ERC20_METHODS.balanceOf, ERC20_METHODS.allowance])
const referralAbi = parseAbi([REFERRAL_METHODS.isBindReferral])
const migrationAbi = parseAbi([ACCOUNT_MIGRATION_METHODS.migratedFrom])

export type StakeOpenPreflight = {
  isBound: boolean
  balance: bigint
  allowance: bigint
  remainingQuota: bigint
  poolOpen: boolean
  isWarmupExpired: boolean
}

export type BondMarketMeta = {
  discountRateBP: bigint
  feeBps: bigint
  maxDebt: bigint
  totalDeposit: bigint
}

/**
 * 质押开仓前的写前状态读取
 *
 * 并行读取推荐绑定、AGX 余额与对质押池的授权、池剩余额度，一次取齐
 * 写前所需数据；活期额外检查 warmup 是否过期，定期把个人额度与池额度
 * 取较小者，并按迁移根地址读取 `userStakingAmounts`（该映射非别名感知）。
 *
 * @param args.pool 质押池合约地址
 * @param args.isLiquid 是否为活期质押
 * @param args.user 钱包地址
 * @param args.client 链上读取客户端，默认公共 RPC
 * @returns 是否绑定 / 余额 / 授权 / 有效剩余额度 / 池是否开放 / warmup 状态
 * @see 手册 §8.2 活期 LiquidStaking
 * @see 手册 §8.3 定期 LockedStaking
 */
export async function readStakeOpenPreflight(args: {
  pool: Address
  isLiquid: boolean
  user: string
  client?: ChainReadClient
}): Promise<StakeOpenPreflight> {
  const client = args.client ?? bscReadClient
  const user = args.user as `0x${string}`
  const remainingAbi = args.isLiquid ? liquidAbi : lockedAbi

  const round1: Aggregate3Call[] = [
    {
      target: BSC_CONTRACTS.referral,
      callData: encodeFunctionData({
        abi: referralAbi,
        functionName: 'isBindReferral',
        args: [user],
      }),
    },
    {
      target: BSC_CONTRACTS.agx,
      callData: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [user],
      }),
    },
    {
      target: BSC_CONTRACTS.agx,
      callData: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'allowance',
        args: [user, args.pool],
      }),
    },
    {
      target: args.pool,
      callData: encodeFunctionData({
        abi: remainingAbi,
        functionName: 'remainingStakeAmount',
      }),
    },
  ]

  if (args.isLiquid) {
    round1.push({
      target: args.pool,
      callData: encodeFunctionData({
        abi: liquidAbi,
        functionName: 'isWarmupExpired',
        args: [user],
      }),
    })
    const results = await readAggregate3(client, round1)
    return {
      isBound: decodeAggregate3Result<boolean>(
        results,
        0,
        referralAbi,
        'isBindReferral',
        'STAKE_PREFLIGHT_MULTICALL_FAILED:isBound',
      ),
      balance: decodeAggregate3Result<bigint>(
        results,
        1,
        erc20Abi,
        'balanceOf',
        'STAKE_PREFLIGHT_MULTICALL_FAILED:balance',
      ),
      allowance: decodeAggregate3Result<bigint>(
        results,
        2,
        erc20Abi,
        'allowance',
        'STAKE_PREFLIGHT_MULTICALL_FAILED:allowance',
      ),
      remainingQuota: decodeAggregate3Result<bigint>(
        results,
        3,
        liquidAbi,
        'remainingStakeAmount',
        'STAKE_PREFLIGHT_MULTICALL_FAILED:remaining',
      ),
      poolOpen: true,
      isWarmupExpired: decodeAggregate3Result<boolean>(
        results,
        4,
        liquidAbi,
        'isWarmupExpired',
        'STAKE_PREFLIGHT_MULTICALL_FAILED:warmup',
      ),
    }
  }

  round1.push({
    target: BSC_CONTRACTS.accountMigrationManager,
    callData: encodeFunctionData({
      abi: migrationAbi,
      functionName: 'migratedFrom',
      args: [user],
    }),
  })
  const round1Results = await readAggregate3(client, round1)
  const isBound = decodeAggregate3Result<boolean>(
    round1Results,
    0,
    referralAbi,
    'isBindReferral',
    'STAKE_PREFLIGHT_MULTICALL_FAILED:isBound',
  )
  const balance = decodeAggregate3Result<bigint>(
    round1Results,
    1,
    erc20Abi,
    'balanceOf',
    'STAKE_PREFLIGHT_MULTICALL_FAILED:balance',
  )
  const allowance = decodeAggregate3Result<bigint>(
    round1Results,
    2,
    erc20Abi,
    'allowance',
    'STAKE_PREFLIGHT_MULTICALL_FAILED:allowance',
  )
  const remainingQuota = decodeAggregate3Result<bigint>(
    round1Results,
    3,
    lockedAbi,
    'remainingStakeAmount',
    'STAKE_PREFLIGHT_MULTICALL_FAILED:remaining',
  )
  const migratedFrom = decodeAggregate3Result<Address>(
    round1Results,
    4,
    migrationAbi,
    'migratedFrom',
    'STAKE_PREFLIGHT_MULTICALL_FAILED:migratedFrom',
  )

  // `userStakingAmounts` 按首次 root 累计，非别名感知。
  const stakeRoot = migrationStakeRoot(args.user, migratedFrom) as `0x${string}`
  const round2 = await readAggregate3(client, [
    {
      target: args.pool,
      callData: encodeFunctionData({
        abi: lockedAbi,
        functionName: 'status',
      }),
    },
    {
      target: args.pool,
      callData: encodeFunctionData({
        abi: lockedAbi,
        functionName: 'singleAddressLimit',
      }),
    },
    {
      target: args.pool,
      callData: encodeFunctionData({
        abi: lockedAbi,
        functionName: 'userStakingAmounts',
        args: [stakeRoot],
      }),
    },
  ])

  const poolOpen = decodeAggregate3Result<boolean>(
    round2,
    0,
    lockedAbi,
    'status',
    'STAKE_PREFLIGHT_MULTICALL_FAILED:status',
  )
  const singleLimit = decodeAggregate3Result<bigint>(
    round2,
    1,
    lockedAbi,
    'singleAddressLimit',
    'STAKE_PREFLIGHT_MULTICALL_FAILED:singleLimit',
  )
  const userStaked = decodeAggregate3Result<bigint>(
    round2,
    2,
    lockedAbi,
    'userStakingAmounts',
    'STAKE_PREFLIGHT_MULTICALL_FAILED:userStaked',
  )

  const rootRemaining =
    singleLimit === 0n ? remainingQuota : singleLimit > userStaked ? singleLimit - userStaked : 0n
  const effectiveQuota = remainingQuota < rootRemaining ? remainingQuota : rootRemaining

  return {
    isBound,
    balance,
    allowance,
    remainingQuota: effectiveQuota,
    poolOpen,
    isWarmupExpired: false,
  }
}

/**
 * 债券 zap 前的写前状态读取
 *
 * 并行读取推荐绑定、USD1 余额与对 BondHelper 的授权，
 * 以及目标 depository 是否在 BondHelper 的授权白名单内。
 *
 * @param args.depository 债券市场合约地址
 * @param args.user 钱包地址
 * @param args.client 链上读取客户端，默认公共 RPC
 * @returns 是否绑定 / 余额 / 授权 / depository 是否被授权
 * @see 手册 §10.4 用户写方法
 * @see docs/onchain-manual/contracts/bondhelper.md
 */
export async function readBondZapPreflight(args: {
  depository: Address
  user: string
  client?: ChainReadClient
}): Promise<{
  isBound: boolean
  balance: bigint
  allowance: bigint
  depositoryAuthorized: boolean
}> {
  const client = args.client ?? bscReadClient
  const user = args.user as `0x${string}`
  const results = await readAggregate3(client, [
    {
      target: BSC_CONTRACTS.referral,
      callData: encodeFunctionData({
        abi: referralAbi,
        functionName: 'isBindReferral',
        args: [user],
      }),
    },
    {
      target: BSC_CONTRACTS.usd1,
      callData: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [user],
      }),
    },
    {
      target: BSC_CONTRACTS.usd1,
      callData: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'allowance',
        args: [user, BSC_CONTRACTS.bondHelper],
      }),
    },
    {
      target: BSC_CONTRACTS.bondHelper,
      callData: encodeFunctionData({
        abi: bondHelperAbi,
        functionName: 'authContracts',
        args: [args.depository],
      }),
    },
  ])

  return {
    isBound: decodeAggregate3Result<boolean>(
      results,
      0,
      referralAbi,
      'isBindReferral',
      'BOND_PREFLIGHT_MULTICALL_FAILED:isBound',
    ),
    balance: decodeAggregate3Result<bigint>(
      results,
      1,
      erc20Abi,
      'balanceOf',
      'BOND_PREFLIGHT_MULTICALL_FAILED:balance',
    ),
    allowance: decodeAggregate3Result<bigint>(
      results,
      2,
      erc20Abi,
      'allowance',
      'BOND_PREFLIGHT_MULTICALL_FAILED:allowance',
    ),
    depositoryAuthorized: decodeAggregate3Result<boolean>(
      results,
      3,
      bondHelperAbi,
      'authContracts',
      'BOND_PREFLIGHT_MULTICALL_FAILED:auth',
    ),
  }
}

/**
 * 读取债券市场公开元数据
 *
 * 返回折扣率、手续费、最大债务与已收总存款，
 * 供债券页展示与 zap 预期回报计算使用。
 *
 * @param depository 债券市场合约地址
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 折扣基点 / 手续费基点 / 最大债务 / 总存款
 * @see 手册 §10.3 展示字段
 * @see docs/onchain-manual/contracts/bonddepository.md
 */
export async function readBondMarketMeta(
  depository: Address,
  client: ChainReadClient = bscReadClient,
): Promise<BondMarketMeta> {
  const results = await readAggregate3(client, [
    {
      target: depository,
      callData: encodeFunctionData({
        abi: bondMarketAbi,
        functionName: 'discountRateBP',
      }),
    },
    {
      target: depository,
      callData: encodeFunctionData({
        abi: bondMarketAbi,
        functionName: 'terms',
      }),
    },
  ])

  const discountRateBP = decodeAggregate3Result<bigint>(
    results,
    0,
    bondMarketAbi,
    'discountRateBP',
    'BOND_MARKET_MULTICALL_FAILED:discount',
  )
  const terms = decodeAggregate3Result<readonly [bigint, bigint, bigint, bigint, bigint]>(
    results,
    1,
    bondMarketAbi,
    'terms',
    'BOND_MARKET_MULTICALL_FAILED:terms',
  )
  const [, , feeBps, maxDebt, totalDeposit] = terms
  return {
    discountRateBP,
    feeBps,
    maxDebt,
    totalDeposit,
  }
}

/**
 * 债券折扣率 → 百分比文案
 *
 * 链上 `discountRateBP` 以 10000 为平价：9200 表示 92%、即约 8% 折扣；
 * 0 或超出平价视为无折扣。仅保留两位以内小数。
 *
 * @param discountRateBP 债券折扣率（基点）
 * @returns 百分比字符串，如「92%」「5.5%」
 * @see 手册 §10.3 展示字段
 */
export function formatBondDiscountLabel(discountRateBP: bigint): string {
  if (discountRateBP === 0n || discountRateBP > BPS_DENOM) return '0%'
  const whole = discountRateBP / 100n
  const frac = discountRateBP % 100n
  if (frac === 0n) return `${whole}%`
  return `${whole}.${frac.toString().padStart(2, '0').replace(/0+$/, '')}%`
}

/**
 * X 挖矿质押前的写前状态读取
 *
 * 并行读取 gAGX 余额、对 XStakingPool 的授权、个人挖矿配额与已质押量；
 * 「Max / 可用」用 quota − staked 计算。
 *
 * @param args.user 钱包地址
 * @param args.client 链上读取客户端，默认公共 RPC
 * @returns 余额 / 授权 / 挖矿配额 / 已质押量
 * @see 手册 §15 XStakingPool X 挖矿
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export async function readXminePreflight(args: {
  user: string
  client?: ChainReadClient
}): Promise<{
  balance: bigint
  allowance: bigint
  miningQuota: bigint
  /** active + warmup；可用额度用 quota − staked 计算。 */
  miningStaked: bigint
}> {
  const client = args.client ?? bscReadClient
  const user = args.user as `0x${string}`
  const results = await readAggregate3(client, [
    {
      target: BSC_CONTRACTS.gagx,
      callData: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [user],
      }),
    },
    {
      target: BSC_CONTRACTS.gagx,
      callData: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'allowance',
        args: [user, BSC_CONTRACTS.xStakingPool],
      }),
    },
    {
      target: BSC_CONTRACTS.xStakingPool,
      callData: encodeFunctionData({
        abi: xStakingAbi,
        functionName: 'miningQuotaOf',
        args: [user],
      }),
    },
    {
      target: BSC_CONTRACTS.xStakingPool,
      callData: encodeFunctionData({
        abi: xStakingAbi,
        functionName: 'miningStakeAmountOf',
        args: [user],
      }),
    },
  ])

  return {
    balance: decodeAggregate3Result<bigint>(
      results,
      0,
      erc20Abi,
      'balanceOf',
      'XMINE_PREFLIGHT_MULTICALL_FAILED:balance',
    ),
    allowance: decodeAggregate3Result<bigint>(
      results,
      1,
      erc20Abi,
      'allowance',
      'XMINE_PREFLIGHT_MULTICALL_FAILED:allowance',
    ),
    miningQuota: decodeAggregate3Result<bigint>(
      results,
      2,
      xStakingAbi,
      'miningQuotaOf',
      'XMINE_PREFLIGHT_MULTICALL_FAILED:quota',
    ),
    miningStaked: decodeAggregate3Result<bigint>(
      results,
      3,
      xStakingAbi,
      'miningStakeAmountOf',
      'XMINE_PREFLIGHT_MULTICALL_FAILED:staked',
    ),
  }
}
