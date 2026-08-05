import { parseAbi } from 'viem'

import { BPS_DENOM } from '~/core/exchange/bps'
import { migrationStakeRoot } from '~/core/migration/migration-user'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  BOND_DEPOSITORY_MARKET_METHODS,
  BOND_HELPER_METHODS,
  LIQUID_STAKING_METHODS,
  LOCKED_STAKING_METHODS,
  X_STAKING_POOL_METHODS,
} from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { readErc20Allowance, readErc20Balance } from '~/web3/exchange/exchange-read'
import { readMigratedFrom } from '~/web3/migration/migration-read'
import { readIsBindReferral } from '~/web3/referral/referral-read'

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

export type StakeOpenPreflight = {
  isBound: boolean
  balance: bigint
  allowance: bigint
  remainingQuota: bigint
  poolOpen: boolean
  isWarmupExpired: boolean
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
  const [isBound, balance, allowance, remainingQuota] = await Promise.all([
    readIsBindReferral(args.user, client),
    readErc20Balance(BSC_CONTRACTS.agx, args.user, client),
    readErc20Allowance(BSC_CONTRACTS.agx, args.user, args.pool, client),
    client.readContract({
      address: args.pool,
      abi: liquidAbi,
      functionName: 'remainingStakeAmount',
    }),
  ])

  if (args.isLiquid) {
    const isWarmupExpired = await client.readContract({
      address: args.pool,
      abi: liquidAbi,
      functionName: 'isWarmupExpired',
      args: [args.user as `0x${string}`],
    })
    return {
      isBound,
      balance,
      allowance,
      remainingQuota,
      poolOpen: true,
      isWarmupExpired,
    }
  }

  // `userStakingAmounts` 按首次 root 累计，非别名感知。
  const migratedFrom = await readMigratedFrom(args.user, client)
  const stakeRoot = migrationStakeRoot(args.user, migratedFrom) as `0x${string}`
  const [poolOpen, singleLimit, userStaked] = await Promise.all([
    client.readContract({
      address: args.pool,
      abi: lockedAbi,
      functionName: 'status',
    }),
    client.readContract({
      address: args.pool,
      abi: lockedAbi,
      functionName: 'singleAddressLimit',
    }),
    client.readContract({
      address: args.pool,
      abi: lockedAbi,
      functionName: 'userStakingAmounts',
      args: [stakeRoot],
    }),
  ])

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
  const [isBound, balance, allowance, depositoryAuthorized] = await Promise.all([
    readIsBindReferral(args.user, client),
    readErc20Balance(BSC_CONTRACTS.usd1, args.user, client),
    readErc20Allowance(BSC_CONTRACTS.usd1, args.user, BSC_CONTRACTS.bondHelper, client),
    client.readContract({
      address: BSC_CONTRACTS.bondHelper,
      abi: bondHelperAbi,
      functionName: 'authContracts',
      args: [args.depository],
    }),
  ])
  return { isBound, balance, allowance, depositoryAuthorized }
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
): Promise<{
  discountRateBP: bigint
  feeBps: bigint
  maxDebt: bigint
  totalDeposit: bigint
}> {
  const [discountRateBP, terms] = await Promise.all([
    client.readContract({
      address: depository,
      abi: bondMarketAbi,
      functionName: 'discountRateBP',
    }),
    client.readContract({
      address: depository,
      abi: bondMarketAbi,
      functionName: 'terms',
    }),
  ])
  const [, , feeBps, maxDebt, totalDeposit] = terms as readonly [
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
  ]
  return {
    discountRateBP: discountRateBP as bigint,
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
  /** active + warmup；Max / 门闸用 quota − staked。 */
  miningStaked: bigint
}> {
  const client = args.client ?? bscReadClient
  const user = args.user as `0x${string}`
  const [balance, allowance, miningQuota, miningStaked] = await Promise.all([
    readErc20Balance(BSC_CONTRACTS.gagx, args.user, client),
    readErc20Allowance(BSC_CONTRACTS.gagx, args.user, BSC_CONTRACTS.xStakingPool, client),
    client.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: xStakingAbi,
      functionName: 'miningQuotaOf',
      args: [user],
    }),
    client.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: xStakingAbi,
      functionName: 'miningStakeAmountOf',
      args: [user],
    }),
  ])
  return { balance, allowance, miningQuota, miningStaked }
}
