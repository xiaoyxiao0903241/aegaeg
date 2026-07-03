import type { Wallet } from 'thirdweb/wallets'
import { getAddress } from 'thirdweb/utils'
import { SWAP_CONFIG } from '~/config/swap'
import { buildSwapDeadline } from '~/lib/swap/build-swap-deadline'
import { ERC20_METHODS, MAX_UINT256, SWAP_ROUTER_V3_METHODS } from '~/web3/abis'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { fetchSwapQuote, readErc20Allowance } from '~/web3/swap-read'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet-contract-write'

const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve)
const swapRouterWriteAbi = parseWriteAbi(SWAP_ROUTER_V3_METHODS.exactInputSingle)

export async function approveTokenIfNeeded({
  wallet,
  token,
  amountIn,
}: {
  wallet: Wallet
  token: `0x${string}`
  amountIn: bigint
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw new Error('Wallet not connected')
  }

  const readClient = createWalletReadClient(wallet)
  const allowance = await readErc20Allowance(
    token,
    account.address,
    SWAP_CONFIG.router,
    readClient,
  )
  if (allowance >= amountIn) return null

  return writeContractViaWallet({
    wallet,
    address: token,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [SWAP_CONFIG.router, MAX_UINT256],
  })
}

export async function executeTokenSwap({
  wallet,
  amountIn,
  tokenIn,
  tokenOut,
  amountOutMin,
}: {
  wallet: Wallet
  amountIn: bigint
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  /** Caller-computed floor — must match what the UI displayed to the user. */
  amountOutMin: bigint
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw new Error('Wallet not connected')
  }

  const readClient = createWalletReadClient(wallet)
  // Re-quote only for route params (fee tier); the output floor stays the
  // user-approved amountOutMin so the executed bound matches the UI.
  const quote = await fetchSwapQuote({ amountIn, tokenIn, tokenOut, client: readClient })
  const deadline = BigInt(buildSwapDeadline(SWAP_CONFIG.deadlineSeconds))

  return writeContractViaWallet({
    wallet,
    address: SWAP_CONFIG.router,
    abi: swapRouterWriteAbi,
    functionName: 'exactInputSingle',
    args: [
      {
        tokenIn: quote.tokenIn,
        tokenOut: quote.tokenOut,
        fee: quote.fee,
        recipient: getAddress(account.address),
        deadline,
        amountIn,
        amountOutMinimum: amountOutMin,
        sqrtPriceLimitX96: 0n,
      },
    ],
  })
}
