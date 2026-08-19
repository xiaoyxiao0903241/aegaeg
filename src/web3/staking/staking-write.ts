import type { Wallet } from 'thirdweb/wallets'

import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
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
import { approveErc20 } from '~/web3/exchange/approve-erc20-if-needed'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const liquidStakeAbi = parseWriteAbi(LIQUID_STAKING_METHODS.liquidStake, LIQUID_STAKING_ERRORS)
const liquidClaimAbi = parseWriteAbi(LIQUID_STAKING_METHODS.claim, LIQUID_STAKING_ERRORS)
const lockedWriteAbi = parseWriteAbi(LOCKED_STAKING_METHODS.lockedStake, LOCKED_STAKING_ERRORS)
const bondLpZapAbi = parseWriteAbi(BOND_HELPER_METHODS.zapIntoLiquidityBond, BOND_HELPER_ERRORS)
const bondBurnZapAbi = parseWriteAbi(BOND_HELPER_METHODS.zapIntoBurnBond, BOND_HELPER_ERRORS)
const xStakeAbi = parseWriteAbi(X_STAKING_POOL_METHODS.stakeGagxForMining, X_STAKING_POOL_ERRORS)

/** AGX → 质押池授权：预检已判定不足后发出 approve，不再读额度。 */
export async function approveAgxForStakeIfNeeded({
  wallet,
  pool,
  amount,
}: {
  wallet: Wallet
  pool: Address
  amount: bigint
}) {
  return approveErc20({
    wallet,
    token: BSC_CONTRACTS.agx,
    spender: pool,
    amountIn: amount,
  })
}

/** 活期质押：调用 LiquidStaking.liquidStake 写入 AGX。 */
export async function liquidStakeAgx({ wallet, amount }: { wallet: Wallet; amount: bigint }) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.liquidStaking,
    abi: liquidStakeAbi,
    functionName: 'liquidStake',
    args: [amount],
  })
}

/** 定期质押：调用 LockedStaking.lockedStake 写入 AGX。 */
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

/**
 * 激活活期质押 warmup
 *
 * 调用 LiquidStaking.claim 使已过 warmup 的质押生效；
 * 是活期路径的激活操作，与 Mixed 领奖不是同一语义。
 *
 * @param wallet 当前钱包
 * @see 手册 §8.2 活期 LiquidStaking
 */
export async function claimLiquidWarmup({ wallet }: { wallet: Wallet }) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.liquidStaking,
    abi: liquidClaimAbi,
    functionName: 'claim',
    args: [],
  })
}

/** USD1 → BondHelper 授权：预检已判定不足后发出 approve，不再读额度。 */
export async function approveUsd1ForBondHelperIfNeeded({
  wallet,
  amount,
}: {
  wallet: Wallet
  amount: bigint
}) {
  return approveErc20({
    wallet,
    token: BSC_CONTRACTS.usd1,
    spender: BSC_CONTRACTS.bondHelper,
    amountIn: amount,
  })
}

/** LP 债券 zap：BondHelper.zapIntoLiquidityBond 用 USD1 铸 LP 债券。 */
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

/** 销毁债券 zap：BondHelper.zapIntoBurnBond 用 USD1 购买销毁债券。 */
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

/** gAGX → XStakingPool 授权：预检已判定不足后发出 approve，不再读额度。 */
export async function approveGagxForXmineIfNeeded({
  wallet,
  amount,
}: {
  wallet: Wallet
  amount: bigint
}) {
  return approveErc20({
    wallet,
    token: BSC_CONTRACTS.gagx,
    spender: BSC_CONTRACTS.xStakingPool,
    amountIn: amount,
  })
}

/** X 挖矿质押：XStakingPool.stakeGagxForMining 写入 gAGX。 */
export async function stakeGagxForMining({ wallet, amount }: { wallet: Wallet; amount: bigint }) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.xStakingPool,
    abi: xStakeAbi,
    functionName: 'stakeGagxForMining',
    args: [amount],
  })
}
