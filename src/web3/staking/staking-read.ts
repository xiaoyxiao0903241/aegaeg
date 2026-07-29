import { parseAbi } from 'viem'
import { BSC_CONTRACTS, type Address } from '~/shared/config/contracts'
import {
  BOND_HELPER_METHODS,
  LIQUID_STAKING_METHODS,
  LOCKED_STAKING_METHODS,
  X_STAKING_POOL_METHODS,
} from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { readErc20Allowance, readErc20Balance } from '~/web3/exchange/exchange-read'
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
const xStakingAbi = parseAbi([X_STAKING_POOL_METHODS.miningQuotaOf])

export type StakeOpenPreflight = {
  isBound: boolean
  balance: bigint
  allowance: bigint
  remainingQuota: bigint
  poolOpen: boolean
  isWarmupExpired: boolean
}

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
      args: [args.user as `0x${string}`],
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

export async function readXminePreflight(args: {
  user: string
  client?: ChainReadClient
}): Promise<{
  balance: bigint
  allowance: bigint
  miningQuota: bigint
}> {
  const client = args.client ?? bscReadClient
  const [balance, allowance, miningQuota] = await Promise.all([
    readErc20Balance(BSC_CONTRACTS.gagx, args.user, client),
    readErc20Allowance(BSC_CONTRACTS.gagx, args.user, BSC_CONTRACTS.xStakingPool, client),
    client.readContract({
      address: BSC_CONTRACTS.xStakingPool,
      abi: xStakingAbi,
      functionName: 'miningQuotaOf',
      args: [args.user as `0x${string}`],
    }),
  ])
  return { balance, allowance, miningQuota }
}
