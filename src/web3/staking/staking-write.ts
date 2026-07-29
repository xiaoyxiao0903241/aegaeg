import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS, type Address } from '~/shared/config/contracts'
import {
  BOND_HELPER_METHODS,
  ERC20_ERRORS,
  ERC20_METHODS,
  LIQUID_STAKING_METHODS,
  LOCKED_STAKING_METHODS,
  X_STAKING_POOL_METHODS,
} from '~/web3/abis'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { readErc20Allowance } from '~/web3/exchange/exchange-read'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve, ERC20_ERRORS)
const liquidStakeAbi = parseWriteAbi(LIQUID_STAKING_METHODS.liquidStake)
const liquidClaimAbi = parseWriteAbi(LIQUID_STAKING_METHODS.claim)
const lockedWriteAbi = parseWriteAbi(LOCKED_STAKING_METHODS.lockedStake)
const bondLpZapAbi = parseWriteAbi(BOND_HELPER_METHODS.zapIntoLiquidityBond)
const bondBurnZapAbi = parseWriteAbi(BOND_HELPER_METHODS.zapIntoBurnBond)
const xStakeAbi = parseWriteAbi(X_STAKING_POOL_METHODS.stakeGagxForMining)

export async function approveAgxForStakeIfNeeded({
  wallet,
  pool,
  amount,
}: {
  wallet: Wallet
  pool: Address
  amount: bigint
}) {
  const account = wallet.getAccount()
  if (!account) throw new Error('Wallet not connected')

  const readClient = createWalletReadClient(wallet)
  const allowance = await readErc20Allowance(BSC_CONTRACTS.agx, account.address, pool, readClient)
  if (allowance >= amount) return null

  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.agx,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [pool, amount],
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
  const account = wallet.getAccount()
  if (!account) throw new Error('Wallet not connected')

  const readClient = createWalletReadClient(wallet)
  const allowance = await readErc20Allowance(
    BSC_CONTRACTS.usd1,
    account.address,
    BSC_CONTRACTS.bondHelper,
    readClient,
  )
  if (allowance >= amount) return null

  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.usd1,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [BSC_CONTRACTS.bondHelper, amount],
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
  const account = wallet.getAccount()
  if (!account) throw new Error('Wallet not connected')

  const readClient = createWalletReadClient(wallet)
  const allowance = await readErc20Allowance(
    BSC_CONTRACTS.gagx,
    account.address,
    BSC_CONTRACTS.xStakingPool,
    readClient,
  )
  if (allowance >= amount) return null

  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.gagx,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [BSC_CONTRACTS.xStakingPool, amount],
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
