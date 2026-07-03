import type { Wallet } from 'thirdweb/wallets'
import type { ThirdwebClient } from 'thirdweb'
import type { Chain } from 'thirdweb/chains'
import { BSC_CONTRACTS } from '~/config/contracts'
import { ERC20_METHODS, MAX_UINT256, USD1_SWAP_METHODS } from '~/web3/abis'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'
import { readErc20Allowance } from '~/web3/swap-read'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet-contract-write'

const FLASH_SWAP_USDT = BSC_CONTRACTS.usdt
const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve)
const usd1SwapWriteAbi = parseWriteAbi(USD1_SWAP_METHODS.swap)

export async function approveUsdtForFlashSwapIfNeeded({
  wallet,
  amountIn,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  wallet: Wallet
  amountIn: bigint
  client?: ThirdwebClient
  chain?: Chain
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw new Error('Wallet not connected')
  }

  const allowance = await readErc20Allowance(
    FLASH_SWAP_USDT,
    account.address,
    BSC_CONTRACTS.usd1Swap,
    client,
    chain,
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
