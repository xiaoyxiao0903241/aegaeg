import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  ERC20_METHODS,
  USD1_SWAP_METHODS,
  USD1_SWAP_ERRORS,
  ERC20_ERRORS,
  REDEEMABLE_GAGX_METHODS,
} from '~/web3/abis'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { readErc20Allowance } from '~/web3/exchange/exchange-read'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve, ERC20_ERRORS)
const usd1ExchangeWriteAbi = parseWriteAbi(USD1_SWAP_METHODS.swap, USD1_SWAP_ERRORS)
const redeemableGagxRedeemAbi = parseWriteAbi(REDEEMABLE_GAGX_METHODS.redeem)
const redeemableGagxWrapAbi = parseWriteAbi(REDEEMABLE_GAGX_METHODS.wrap)

export async function approveUsdtForFlashExchangeIfNeeded({
  wallet,
  amountIn,
}: {
  wallet: Wallet
  amountIn: bigint
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw new Error('Wallet not connected')
  }

  const readClient = createWalletReadClient(wallet)
  const allowance = await readErc20Allowance(
    BSC_CONTRACTS.usdt,
    account.address,
    BSC_CONTRACTS.usd1Swap,
    readClient,
  )
  if (allowance >= amountIn) return null

  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.usdt,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [BSC_CONTRACTS.usd1Swap, amountIn],
  })
}

export async function approveAgxForWrapIfNeeded({
  wallet,
  amountIn,
}: {
  wallet: Wallet
  amountIn: bigint
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw new Error('Wallet not connected')
  }

  const readClient = createWalletReadClient(wallet)
  const allowance = await readErc20Allowance(
    BSC_CONTRACTS.agx,
    account.address,
    BSC_CONTRACTS.gagx,
    readClient,
  )
  if (allowance >= amountIn) return null

  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.agx,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [BSC_CONTRACTS.gagx, amountIn],
  })
}

export async function flashExchange({
  wallet,
  usdtAmount,
  minUsd1Out,
}: {
  wallet: Wallet
  usdtAmount: bigint
  minUsd1Out: bigint
}) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.usd1Swap,
    abi: usd1ExchangeWriteAbi,
    functionName: 'swap',
    args: [usdtAmount, minUsd1Out],
  })
}

/** gAGX → AGX via RewardGAGX.redeem — burns caller balance; no ERC20 approve. */
export async function redeemGagxFlashExchange({
  wallet,
  gagxAmount,
}: {
  wallet: Wallet
  gagxAmount: bigint
}) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.gagx,
    abi: redeemableGagxRedeemAbi,
    functionName: 'redeem',
    args: [gagxAmount],
  })
}

/** AGX → gAGX via RewardGAGX.wrap — requires AGX approve first (manual §15). */
export async function wrapAgxFlashExchange({
  wallet,
  agxAmount,
}: {
  wallet: Wallet
  agxAmount: bigint
}) {
  return writeContractViaWallet({
    wallet,
    address: BSC_CONTRACTS.gagx,
    abi: redeemableGagxWrapAbi,
    functionName: 'wrap',
    args: [agxAmount],
  })
}
