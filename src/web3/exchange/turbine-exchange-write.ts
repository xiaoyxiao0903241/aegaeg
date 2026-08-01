import type { Wallet } from 'thirdweb/wallets'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { TURBINE_ERRORS, TURBINE_METHODS } from '~/web3/abis'
import { approveErc20IfNeeded } from '~/web3/exchange/approve-erc20-if-needed'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const buyAbi = parseWriteAbi(TURBINE_METHODS.buyAgxAndStartCooldown, TURBINE_ERRORS)
const claimAbi = parseWriteAbi(TURBINE_METHODS.claimCooledGagx, TURBINE_ERRORS)

export async function approveUsd1ForTurbineIfNeeded({
  wallet,
  amountIn,
}: {
  wallet: Wallet
  amountIn: bigint
}) {
  return approveErc20IfNeeded({
    wallet,
    token: BSC_CONTRACTS.usd1,
    spender: BSC_CONTRACTS.turbine,
    amountIn,
  })
}

export async function buyAgxAndStartCooldown({
  wallet,
  usdAmount,
}: {
  wallet: Wallet
  usdAmount: bigint
}) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.turbine,
    abi: buyAbi,
    functionName: 'buyAgxAndStartCooldown',
    args: [usdAmount],
  })
}

export async function claimCooledGagx({ wallet, index }: { wallet: Wallet; index: number }) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.turbine,
    abi: claimAbi,
    functionName: 'claimCooledGagx',
    args: [BigInt(index)],
  })
}
