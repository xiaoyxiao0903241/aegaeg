import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { ERC20_ERRORS, ERC20_METHODS, TURBINE_ERRORS, TURBINE_METHODS } from '~/web3/abis'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { readErc20Allowance } from '~/web3/exchange/exchange-read'
import { WALLET_BLOCKED } from '~/web3/errors/sentinels'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve, ERC20_ERRORS)
const buyAbi = parseWriteAbi(TURBINE_METHODS.buyAgxAndStartCooldown, TURBINE_ERRORS)
const claimAbi = parseWriteAbi(TURBINE_METHODS.claimCooledGagx, TURBINE_ERRORS)

export async function approveUsd1ForTurbineIfNeeded({
  wallet,
  amountIn,
}: {
  wallet: Wallet
  amountIn: bigint
}) {
  const account = wallet.getAccount()
  if (!account) throw WALLET_BLOCKED.NOT_CONNECTED

  const readClient = createWalletReadClient(wallet)
  const allowance = await readErc20Allowance(
    BSC_CONTRACTS.usd1,
    account.address,
    BSC_CONTRACTS.turbine,
    readClient,
  )
  if (allowance >= amountIn) return null

  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.usd1,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [BSC_CONTRACTS.turbine, amountIn],
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
