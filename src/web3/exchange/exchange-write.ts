import type { Wallet } from 'thirdweb/wallets'
import { getAddress } from 'thirdweb/utils'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { buildExchangeDeadline } from '~/core/exchange/build-exchange-deadline'
import { ERC20_METHODS, PANCAKE_ROUTER_V2_METHODS, ERC20_ERRORS } from '~/web3/abis'
import { createWalletReadClient } from '~/web3/chain-read-client'
import { readErc20Allowance } from '~/web3/exchange/exchange-read'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const erc20WriteAbi = parseWriteAbi(ERC20_METHODS.approve, ERC20_ERRORS)
const exchangeRouterWriteAbi = parseWriteAbi(PANCAKE_ROUTER_V2_METHODS.swapExactTokensForTokens)

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
  path,
  amountOutMin,
}: {
  wallet: Wallet
  amountIn: bigint
  /** Direct (2) or via-mid (3) hop — must match live quote path. */
  path: readonly `0x${string}`[]
  /** Live post-approve floor from assertStillSubmittable — not recomputed here. */
  amountOutMin: bigint
}) {
  const account = wallet.getAccount()
  if (!account) {
    throw new Error('Wallet not connected')
  }
  if (path.length < 2) {
    throw new Error(`EXCHANGE_PATH_TOO_SHORT:${path.length}`)
  }

  const deadline = BigInt(buildExchangeDeadline(EXCHANGE_CONFIG.deadlineSeconds))

  return writeContractViaWallet({
    wallet,
    address: EXCHANGE_CONFIG.router,
    abi: exchangeRouterWriteAbi,
    functionName: 'swapExactTokensForTokens',
    args: [amountIn, amountOutMin, [...path], getAddress(account.address), deadline],
  })
}
