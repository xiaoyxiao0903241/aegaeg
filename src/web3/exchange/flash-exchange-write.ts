import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { ERC20_METHODS, USD1_SWAP_METHODS, ERC20_ERRORS } from '~/web3/abis'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { readErc20Allowance } from '~/web3/exchange/exchange-read'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const FLASH_EXCHANGE_USDT = BSC_CONTRACTS.usdt
const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve, ERC20_ERRORS)
const usd1ExchangeWriteAbi = parseWriteAbi(USD1_SWAP_METHODS.swap)

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
    FLASH_EXCHANGE_USDT,
    account.address,
    BSC_CONTRACTS.usd1Swap,
    readClient,
  )
  if (allowance >= amountIn) return null

  return writeContractViaWallet({
    wallet,
    address: FLASH_EXCHANGE_USDT,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [BSC_CONTRACTS.usd1Swap, amountIn],
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
