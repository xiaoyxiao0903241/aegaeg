import type { Wallet } from 'thirdweb/wallets'
import { getAddress } from 'thirdweb/utils'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { buildExchangeDeadline } from '~/core/exchange/build-exchange-deadline'
import { ERC20_METHODS, SWAP_ROUTER_V3_METHODS, ERC20_ERRORS } from '~/web3/abis'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { fetchExchangeQuote, readErc20Allowance } from '~/web3/exchange/exchange-read'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve, ERC20_ERRORS)
const exchangeRouterWriteAbi = parseWriteAbi(SWAP_ROUTER_V3_METHODS.exactInputSingle)

/** True when router allowance is below the intended spend — approve before swap. */
export function needsTokenApproval(allowance: bigint, amountIn: bigint): boolean {
  return allowance < amountIn
}

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
    EXCHANGE_CONFIG.router,
    readClient,
  )
  if (!needsTokenApproval(allowance, amountIn)) return null

  return writeContractViaWallet({
    wallet,
    address: token,
    abi: erc20WriteAbi,
    functionName: 'approve',
    args: [EXCHANGE_CONFIG.router, amountIn],
  })
}

export async function exchangeTokens({
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
  /** Live post-approve floor from assertStillSubmittable — not recomputed here. */
  amountOutMin: bigint
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw new Error('Wallet not connected')
  }

  const readClient = createWalletReadClient(wallet)
  // Re-quote only for route params (fee tier). amountOutMinimum stays the
  // caller-supplied live floor from the post-approve submit gate.
  const quote = await fetchExchangeQuote({ amountIn, tokenIn, tokenOut, client: readClient })
  const deadline = BigInt(buildExchangeDeadline(EXCHANGE_CONFIG.deadlineSeconds))

  return writeContractViaWallet({
    wallet,
    address: EXCHANGE_CONFIG.router,
    abi: exchangeRouterWriteAbi,
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
