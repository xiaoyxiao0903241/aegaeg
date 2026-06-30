import {
  getContract,
  prepareContractCall,
  sendAndConfirmTransaction,
  type ThirdwebClient,
} from 'thirdweb'
import type { Account } from 'thirdweb/wallets'
import type { Chain } from 'thirdweb/chains'
import { SWAP_CONFIG } from '~/config/swap'
import { calcAmountOutMin } from '~/lib/swap/calc-amount-out-min'
import { ERC20_METHODS, MAX_UINT256, SWAP_ROUTER_V3_METHODS } from '~/web3/abis'
import { defaultChain, thirdwebClient } from '~/web3/thirdweb'
import { fetchSwapQuote, readErc20Allowance } from '~/web3/swap-read'

export async function approveTokenIfNeeded({
  account,
  token,
  amountIn,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  account: Account
  token: `0x${string}`
  amountIn: bigint
  client?: ThirdwebClient
  chain?: Chain
}) {
  const allowance = await readErc20Allowance(token, account.address, SWAP_CONFIG.router, client, chain)
  if (allowance >= amountIn) return null

  const contract = getContract({ client, chain, address: token })
  const transaction = prepareContractCall({
    contract,
    method: ERC20_METHODS.approve,
    params: [SWAP_CONFIG.router, MAX_UINT256],
  })

  return sendAndConfirmTransaction({ account, transaction })
}

export async function executeTokenSwap({
  account,
  amountIn,
  tokenIn,
  tokenOut,
  slippageBps,
  client = thirdwebClient,
  chain = defaultChain,
}: {
  account: Account
  amountIn: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  slippageBps: number
  client?: ThirdwebClient
  chain?: Chain
}) {
  const quote = await fetchSwapQuote({ amountIn, tokenIn, tokenOut })
  const amountOutMin = calcAmountOutMin(quote.quotedOut, slippageBps)
  const router = getContract({ client, chain, address: SWAP_CONFIG.router })
  const transaction = prepareContractCall({
    contract: router,
    method: SWAP_ROUTER_V3_METHODS.exactInputSingle,
    params: [
      {
        tokenIn: quote.tokenIn,
        tokenOut: quote.tokenOut,
        fee: SWAP_CONFIG.feeTier,
        recipient: account.address,
        amountIn,
        amountOutMinimum: amountOutMin,
        sqrtPriceLimitX96: 0n,
      },
    ],
  })

  return sendAndConfirmTransaction({ account, transaction })
}
