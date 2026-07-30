import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS, type Address } from '~/shared/config/contracts'
import {
  BOND_DEPOSITORY_ASSETS_METHODS,
  LIQUID_STAKING_ASSETS_METHODS,
  LOCKED_STAKING_ASSETS_METHODS,
  X_STAKING_POOL_METHODS,
} from '~/web3/abis'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const liquidClaimMixedAbi = parseWriteAbi(LIQUID_STAKING_ASSETS_METHODS.claimRewardMixed)
const liquidClaimPrincipalAbi = parseWriteAbi(LIQUID_STAKING_ASSETS_METHODS.claimPrincipal)
const lockedClaimMixedAbi = parseWriteAbi(LOCKED_STAKING_ASSETS_METHODS.claimRewardMixed)
const lockedClaimExtraAbi = parseWriteAbi(LOCKED_STAKING_ASSETS_METHODS.claimExtraRewardMixed)
const lockedClaimPrincipalAbi = parseWriteAbi(LOCKED_STAKING_ASSETS_METHODS.claimPrincipal)
const bondClaimMixedAbi = parseWriteAbi(BOND_DEPOSITORY_ASSETS_METHODS.claimStakeProfitMixed)
const bondRedeemAbi = parseWriteAbi(BOND_DEPOSITORY_ASSETS_METHODS.redeem)
const xmineClaimAbi = parseWriteAbi(X_STAKING_POOL_METHODS.claimReward)
const xmineUnstakeAbi = parseWriteAbi(X_STAKING_POOL_METHODS.startUnstake)
const xmineActivateWarmupAbi = parseWriteAbi(X_STAKING_POOL_METHODS.activateWarmup)

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

export async function writeLiquidClaimPrincipal(args: { wallet: Wallet; amount: bigint }) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.liquidStaking,
    abi: liquidClaimPrincipalAbi,
    functionName: 'claimPrincipal',
    args: [args.amount],
  })
}

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

export async function writeXmineClaimReward(args: { wallet: Wallet }) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.xStakingPool,
    abi: xmineClaimAbi,
    functionName: 'claimReward',
    args: [],
  })
}

export async function writeXmineStartUnstake(args: { wallet: Wallet }) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.xStakingPool,
    abi: xmineUnstakeAbi,
    functionName: 'startUnstake',
    args: [],
  })
}

export async function writeXmineActivateWarmup(args: { wallet: Wallet }) {
  return writeContractViaWallet({
    wallet: args.wallet,
    address: BSC_CONTRACTS.xStakingPool,
    abi: xmineActivateWarmupAbi,
    functionName: 'activateWarmup',
    args: [],
  })
}
