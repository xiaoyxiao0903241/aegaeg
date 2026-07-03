import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/config/contracts'
import { ERC20_METHODS, MAX_UINT256, USD1_SWAP_METHODS, ERC20_ERRORS } from '~/web3/abis'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { readErc20Allowance } from '~/web3/swap-read'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet-contract-write'

const FLASH_SWAP_USDT = BSC_CONTRACTS.usdt
const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve, ERC20_ERRORS)
const usd1SwapWriteAbi = parseWriteAbi(USD1_SWAP_METHODS.swap)

export async function approveUsdtForFlashSwapIfNeeded({
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
    FLASH_SWAP_USDT,
    account.address,
    BSC_CONTRACTS.usd1Swap,
    readClient,
  )
  if (allowance >= amountIn) return null

  return writeContractViaWallet({
    wallet,
    address: FLASH_SWAP_USDT,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [BSC_CONTRACTS.usd1Swap, MAX_UINT256],
  })
}

export async function executeFlashSwap({
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
    abi: usd1SwapWriteAbi,
    functionName: 'swap',
    args: [usdtAmount, minUsd1Out],
  })
}
