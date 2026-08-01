import type { Wallet } from 'thirdweb/wallets'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  USD1_SWAP_METHODS,
  USD1_SWAP_ERRORS,
  REDEEMABLE_GAGX_METHODS,
  REDEEMABLE_GAGX_ERRORS,
} from '~/web3/abis'
import { approveErc20IfNeeded } from '~/web3/exchange/approve-erc20-if-needed'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const usd1ExchangeWriteAbi = parseWriteAbi(USD1_SWAP_METHODS.swap, USD1_SWAP_ERRORS)
const redeemableGagxRedeemAbi = parseWriteAbi(
  REDEEMABLE_GAGX_METHODS.redeem,
  REDEEMABLE_GAGX_ERRORS,
)
const redeemableGagxWrapAbi = parseWriteAbi(REDEEMABLE_GAGX_METHODS.wrap, REDEEMABLE_GAGX_ERRORS)

export async function approveUsdtForFlashExchangeIfNeeded({
  wallet,
  amountIn,
}: {
  wallet: Wallet
  amountIn: bigint
}) {
  return approveErc20IfNeeded({
    wallet,
    token: BSC_CONTRACTS.usdt,
    spender: BSC_CONTRACTS.usd1Swap,
    amountIn,
  })
}

export async function approveAgxForWrapIfNeeded({
  wallet,
  amountIn,
}: {
  wallet: Wallet
  amountIn: bigint
}) {
  return approveErc20IfNeeded({
    wallet,
    token: BSC_CONTRACTS.agx,
    spender: BSC_CONTRACTS.gagx,
    amountIn,
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
