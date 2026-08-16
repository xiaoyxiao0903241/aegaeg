import type { Wallet } from 'thirdweb/wallets'

import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  BOND_DEPOSITORY_ASSETS_METHODS,
  BOND_DEPOSITORY_ERRORS,
  LIQUID_STAKING_ASSETS_METHODS,
  LIQUID_STAKING_ERRORS,
  LOCKED_STAKING_ASSETS_METHODS,
  LOCKED_STAKING_ERRORS,
  X_STAKING_POOL_ERRORS,
  X_STAKING_POOL_METHODS,
} from '~/web3/abis'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const liquidClaimMixedAbi = parseWriteAbi(
  LIQUID_STAKING_ASSETS_METHODS.claimRewardMixed,
  LIQUID_STAKING_ERRORS,
)
const liquidClaimPrincipalAbi = parseWriteAbi(
  LIQUID_STAKING_ASSETS_METHODS.claimPrincipal,
  LIQUID_STAKING_ERRORS,
)
const lockedClaimMixedAbi = parseWriteAbi(
  LOCKED_STAKING_ASSETS_METHODS.claimRewardMixed,
  LOCKED_STAKING_ERRORS,
)
const lockedClaimExtraAbi = parseWriteAbi(
  LOCKED_STAKING_ASSETS_METHODS.claimExtraRewardMixed,
  LOCKED_STAKING_ERRORS,
)
const lockedClaimPrincipalAbi = parseWriteAbi(
  LOCKED_STAKING_ASSETS_METHODS.claimPrincipal,
  LOCKED_STAKING_ERRORS,
)
const bondClaimMixedAbi = parseWriteAbi(
  BOND_DEPOSITORY_ASSETS_METHODS.claimStakeProfitMixed,
  BOND_DEPOSITORY_ERRORS,
)
const bondRedeemAbi = parseWriteAbi(BOND_DEPOSITORY_ASSETS_METHODS.redeem, BOND_DEPOSITORY_ERRORS)
const xmineClaimAbi = parseWriteAbi(X_STAKING_POOL_METHODS.claimReward, X_STAKING_POOL_ERRORS)
const xmineUnstakeAbi = parseWriteAbi(X_STAKING_POOL_METHODS.startUnstake, X_STAKING_POOL_ERRORS)
const xmineActivateWarmupAbi = parseWriteAbi(
  X_STAKING_POOL_METHODS.activateWarmup,
  X_STAKING_POOL_ERRORS,
)

/**
 * 活期奖励 Mixed 领取（LiquidStaking.claimRewardMixed）。
 *
 * @param args.wallet 钱包
 * @param args.releasePlanIndex 释放计划 index
 * @param args.amount 领取金额（wei）
 * @param args.restakePlanIndex 复投计划 index
 * @param args.restakeBps 复投比例（0–10000）
 * @see 手册 §8.2 活期 LiquidStaking
 */
export async function writeLiquidClaimMixed(args: {
  wallet: Wallet
  releasePlanIndex: number
  amount: bigint
  restakePlanIndex: number
  restakeBps: number
}) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.liquidStaking,
    abi: liquidClaimMixedAbi,
    functionName: 'claimRewardMixed',
    args: [
      args.releasePlanIndex,
      args.amount,
      BigInt(args.restakePlanIndex),
      BigInt(args.restakeBps),
    ],
  })
}

/**
 * 活期本金领取（LiquidStaking.claimPrincipal），须已过 warmup。
 *
 * @param args.wallet 钱包
 * @param args.amount 领取金额（wei）
 * @see 手册 §8.2 活期 LiquidStaking
 */
export async function writeLiquidClaimPrincipal(args: { wallet: Wallet; amount: bigint }) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.liquidStaking,
    abi: liquidClaimPrincipalAbi,
    functionName: 'claimPrincipal',
    args: [args.amount],
  })
}

/**
 * 定期奖励 Mixed 领取（LockedStaking.claimRewardMixed / claimExtraRewardMixed）。
 *
 * extra 为 true 时领额外利息（extraInterest），否则领普通奖励（blockReward）。
 *
 * @param args.wallet 钱包
 * @param args.pool 定期质押池地址（180/360/540）
 * @param args.stakeIndex 仓位 index
 * @param args.amount 领取金额（wei）
 * @param args.releasePlanIndex 释放计划 index
 * @param args.restakePlanIndex 复投计划 index
 * @param args.restakeBps 复投比例（0–10000）
 * @param args.extra 是否领取额外利息
 * @see 手册 §8.3 定期 LockedStaking
 */
export async function writeLockedClaimMixed(args: {
  wallet: Wallet
  pool: Address
  stakeIndex: number
  amount: bigint
  releasePlanIndex: number
  restakePlanIndex: number
  restakeBps: number
  extra?: boolean
}) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: args.pool,
    abi: args.extra ? lockedClaimExtraAbi : lockedClaimMixedAbi,
    functionName: args.extra ? 'claimExtraRewardMixed' : 'claimRewardMixed',
    args: [
      BigInt(args.stakeIndex),
      args.amount,
      args.releasePlanIndex,
      BigInt(args.restakePlanIndex),
      BigInt(args.restakeBps),
    ],
  })
}

/**
 * 定期本金领取（LockedStaking.claimPrincipal），须到期或已释放。
 *
 * @param args.wallet 钱包
 * @param args.pool 定期质押池地址（180/360/540）
 * @param args.stakeIndex 仓位 index
 * @see 手册 §8.3 定期 LockedStaking
 */
export async function writeLockedClaimPrincipal(args: {
  wallet: Wallet
  pool: Address
  stakeIndex: number
}) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: args.pool,
    abi: lockedClaimPrincipalAbi,
    functionName: 'claimPrincipal',
    args: [BigInt(args.stakeIndex)],
  })
}

/**
 * 债券利润 Mixed 领取（BondDepository.claimStakeProfitMixed）。
 *
 * @param args.wallet 钱包
 * @param args.depository 债券金库地址
 * @param args.recipient 收益接收地址
 * @param args.amount 领取金额（wei）
 * @param args.releasePlanIndex 释放计划 index
 * @param args.bondIndex 债券仓位 index
 * @param args.restakePlanIndex 复投计划 index
 * @param args.restakeBps 复投比例（0–10000）
 * @see 手册 §10 债券 Bond / BurnBond
 */
export async function writeBondClaimMixed(args: {
  wallet: Wallet
  depository: Address
  recipient: Address
  amount: bigint
  releasePlanIndex: number
  bondIndex: number
  restakePlanIndex: number
  restakeBps: number
}) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: args.depository,
    abi: bondClaimMixedAbi,
    functionName: 'claimStakeProfitMixed',
    args: [
      args.recipient,
      args.amount,
      args.releasePlanIndex,
      BigInt(args.bondIndex),
      BigInt(args.restakePlanIndex),
      BigInt(args.restakeBps),
    ],
  })
}

/**
 * 债券赎回（BondDepository.redeem），固定不复投。
 *
 * @param args.wallet 钱包
 * @param args.depository 债券金库地址
 * @param args.recipient 赎回接收地址
 * @param args.bondIndex 债券仓位 index
 * @see 手册 §10 债券 Bond / BurnBond
 */
export async function writeBondRedeem(args: {
  wallet: Wallet
  depository: Address
  recipient: Address
  bondIndex: number
}) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: args.depository,
    abi: bondRedeemAbi,
    functionName: 'redeem',
    args: [args.recipient, BigInt(args.bondIndex), false],
  })
}

/**
 * X 挖矿奖励领取（XStakingPool.claimReward）。
 *
 * @param args.wallet 钱包
 * @see 手册 §15 XStakingPool X 挖矿
 */
export async function writeXmineClaimReward(args: { wallet: Wallet }) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.xStakingPool,
    abi: xmineClaimAbi,
    functionName: 'claimReward',
    args: [],
  })
}

/**
 * X 挖矿发起解押（XStakingPool.startUnstake）。
 *
 * @param args.wallet 钱包
 * @see 手册 §15 XStakingPool X 挖矿
 */
export async function writeXmineStartUnstake(args: { wallet: Wallet }) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.xStakingPool,
    abi: xmineUnstakeAbi,
    functionName: 'startUnstake',
    args: [],
  })
}

/**
 * X 挖矿激活 warmup（XStakingPool.activateWarmup），质押后需先激活才计息。
 *
 * @param args.wallet 钱包
 * @see 手册 §15 XStakingPool X 挖矿
 */
export async function writeXmineActivateWarmup(args: { wallet: Wallet }) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.xStakingPool,
    abi: xmineActivateWarmupAbi,
    functionName: 'activateWarmup',
    args: [],
  })
}
