import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS, type Address } from '~/shared/config/contracts'
import {
  BOND_HELPER_ERRORS,
  BOND_HELPER_METHODS,
  LIQUID_STAKING_ERRORS,
  LIQUID_STAKING_METHODS,
  LOCKED_STAKING_ERRORS,
  LOCKED_STAKING_METHODS,
  X_STAKING_POOL_ERRORS,
  X_STAKING_POOL_METHODS,
} from '~/web3/abis'
import { approveErc20IfNeeded } from '~/web3/exchange/approve-erc20-if-needed'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const liquidStakeAbi = parseWriteAbi(LIQUID_STAKING_METHODS.liquidStake, LIQUID_STAKING_ERRORS)
const liquidClaimAbi = parseWriteAbi(LIQUID_STAKING_METHODS.claim, LIQUID_STAKING_ERRORS)
const lockedWriteAbi = parseWriteAbi(LOCKED_STAKING_METHODS.lockedStake, LOCKED_STAKING_ERRORS)
const bondLpZapAbi = parseWriteAbi(BOND_HELPER_METHODS.zapIntoLiquidityBond, BOND_HELPER_ERRORS)
const bondBurnZapAbi = parseWriteAbi(BOND_HELPER_METHODS.zapIntoBurnBond, BOND_HELPER_ERRORS)
const xStakeAbi = parseWriteAbi(X_STAKING_POOL_METHODS.stakeGagxForMining, X_STAKING_POOL_ERRORS)

export async function approveAgxForStakeIfNeeded({
  wallet,
  pool,
  amount,
}: {
  wallet: Wallet
  pool: Address
  amount: bigint
}) {
  return approveErc20IfNeeded({
    wallet,
    token: BSC_CONTRACTS.agx,
    spender: pool,
    amountIn: amount,
  })
}

export async function liquidStakeAgx({ wallet, amount }: { wallet: Wallet; amount: bigint }) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.liquidStaking,
    abi: liquidStakeAbi,
    functionName: 'liquidStake',
    args: [amount],
  })
}

export async function lockedStakeAgx({
  wallet,
  pool,
  amount,
}: {
  wallet: Wallet
  pool: Address
  amount: bigint
}) {
  return writeContractViaWallet({
    wallet,
    address: pool,
    abi: lockedWriteAbi,
    functionName: 'lockedStake',
    args: [amount],
  })
}

/** Warmup activation on LiquidStaking — not Mixed claim. */
export async function claimLiquidWarmup({ wallet }: { wallet: Wallet }) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.liquidStaking,
    abi: liquidClaimAbi,
    functionName: 'claim',
    args: [],
  })
}

export async function approveUsd1ForBondHelperIfNeeded({
  wallet,
  amount,
}: {
  wallet: Wallet
  amount: bigint
}) {
  return approveErc20IfNeeded({
    wallet,
    token: BSC_CONTRACTS.usd1,
    spender: BSC_CONTRACTS.bondHelper,
    amountIn: amount,
  })
}

export async function zapIntoLiquidityBond({
  wallet,
  depository,
  amount,
}: {
  wallet: Wallet
  depository: Address
  amount: bigint
}) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.bondHelper,
    abi: bondLpZapAbi,
    functionName: 'zapIntoLiquidityBond',
    args: [depository, BSC_CONTRACTS.usd1, amount],
  })
}

export async function zapIntoBurnBond({
  wallet,
  depository,
  amount,
}: {
  wallet: Wallet
  depository: Address
  amount: bigint
}) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.bondHelper,
    abi: bondBurnZapAbi,
    functionName: 'zapIntoBurnBond',
    args: [depository, BSC_CONTRACTS.usd1, amount],
  })
}

export async function approveGagxForXmineIfNeeded({
  wallet,
  amount,
}: {
  wallet: Wallet
  amount: bigint
}) {
  return approveErc20IfNeeded({
    wallet,
    token: BSC_CONTRACTS.gagx,
    spender: BSC_CONTRACTS.xStakingPool,
    amountIn: amount,
  })
}

export async function stakeGagxForMining({ wallet, amount }: { wallet: Wallet; amount: bigint }) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.xStakingPool,
    abi: xStakeAbi,
    functionName: 'stakeGagxForMining',
    args: [amount],
  })
}
