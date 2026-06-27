import {
  getContract,
  prepareContractCall,
  sendAndConfirmTransaction,
  type ThirdwebClient,
} from 'thirdweb'
import type { Account } from 'thirdweb/wallets'
import type { Chain } from 'thirdweb/chains'
import { BSC_CONTRACTS } from '~/config/contracts'
import { ERC20_METHODS, MAX_UINT256, USD1_SWAP_METHODS } from '~/web3/abis'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'
import { readErc20Allowance } from '~/web3/swap-read'
import { getUsd1SwapContract } from '~/web3/flash-swap-read'

export async function approveUsdtForFlashSwapIfNeeded({
  account,
  amountIn,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  account: Account
  amountIn: bigint
  client?: ThirdwebClient
  chain?: Chain
}) {
  const allowance = await readErc20Allowance(
    BSC_CONTRACTS.xxToken,
    account.address,
    BSC_CONTRACTS.usd1Swap,
    client,
    chain,
  )
  if (allowance >= amountIn) return null

  const contract = getContract({ client, chain, address: BSC_CONTRACTS.xxToken })
  const transaction = prepareContractCall({
    contract,
    method: ERC20_METHODS.approve,
    params: [BSC_CONTRACTS.usd1Swap, MAX_UINT256],
  })

  return sendAndConfirmTransaction({ account, transaction })
}

export async function executeFlashSwap({
  account,
  usdtAmount,
  minUsd1Out,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  account: Account
  usdtAmount: bigint
  minUsd1Out: bigint
  client?: ThirdwebClient
  chain?: Chain
}) {
  const contract = getUsd1SwapContract(client, chain)
  const transaction = prepareContractCall({
    contract,
    method: USD1_SWAP_METHODS.swap,
    params: [usdtAmount, minUsd1Out],
  })

  return sendAndConfirmTransaction({ account, transaction })
}
