import { getAddress } from 'thirdweb/utils'
import type { Wallet } from 'thirdweb/wallets'
import { parseAbi } from 'viem'

import { isAgxSellPath } from '~/core/exchange/agx-sell-tax'
import { exchangeDeadline } from '~/core/exchange/exchange-math'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { PANCAKE_ROUTER_V2_METHODS } from '~/web3/abis'
import { WALLET_BLOCKED } from '~/web3/errors/sentinels'
import { approveErc20IfNeeded } from '~/web3/exchange/approve-erc20-if-needed'
import { writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const exchangeRouterWriteAbi = parseAbi([
  PANCAKE_ROUTER_V2_METHODS.swapExactTokensForTokens,
  PANCAKE_ROUTER_V2_METHODS.swapExactTokensForTokensSupportingFeeOnTransferTokens,
])

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
  return approveErc20IfNeeded({
    wallet,
    token,
    spender: EXCHANGE_CONFIG.router,
    amountIn,
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
    throw WALLET_BLOCKED.NOT_CONNECTED
  }
  if (path.length < 2) {
    throw new Error(`EXCHANGE_PATH_TOO_SHORT:${path.length}`)
  }
  const tokenIn = path[0]
  if (tokenIn === undefined) {
    throw new Error('EXCHANGE_PATH_TOO_SHORT:0')
  }

  const deadline = BigInt(exchangeDeadline(EXCHANGE_CONFIG.deadlineSeconds))
  /** AGX pair sells take sell tax — use SupportingFee path (contracts/agx.md). */
  const functionName = isAgxSellPath(tokenIn, BSC_CONTRACTS.agx)
    ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
    : 'swapExactTokensForTokens'

  return writeContractViaWallet({
    wallet,
    address: EXCHANGE_CONFIG.router,
    abi: exchangeRouterWriteAbi,
    functionName,
    args: [amountIn, amountOutMin, [...path], getAddress(account.address), deadline],
  })
}
