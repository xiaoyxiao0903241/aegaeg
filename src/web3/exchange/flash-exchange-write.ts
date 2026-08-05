import type { Wallet } from 'thirdweb/wallets'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import {
  REDEEMABLE_GAGX_ERRORS,
  REDEEMABLE_GAGX_METHODS,
  USD1_SWAP_ERRORS,
  USD1_SWAP_METHODS,
} from '~/web3/abis'
import { approveErc20IfNeeded } from '~/web3/exchange/approve-erc20-if-needed'
import { parseWriteAbi, writeContractViaWallet } from '~/web3/wallet/wallet-contract-write'

const usd1ExchangeWriteAbi = parseWriteAbi(USD1_SWAP_METHODS.swap, USD1_SWAP_ERRORS)
const redeemableGagxRedeemAbi = parseWriteAbi(
  REDEEMABLE_GAGX_METHODS.redeem,
  REDEEMABLE_GAGX_ERRORS,
)
const redeemableGagxWrapAbi = parseWriteAbi(REDEEMABLE_GAGX_METHODS.wrap, REDEEMABLE_GAGX_ERRORS)

/** USDT → Usd1Swap 授权：USDT 兑换 USD1 前按需补 approve。 */
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

/** AGX → gAGX 授权：换包前按需补 approve。 */
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

/** 闪电兑换：调用 Usd1Swap.swap，用 USDT 按最低输出换 USD1。 */
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

/**
 * gAGX 赎回为 AGX
 *
 * 调用 RewardGAGX.redeem，直接销毁调用方余额换回 AGX；
 * 由于是赎回自身资产，无需 ERC20 approve。
 *
 * @param wallet 当前钱包
 * @param gagxAmount 拟赎回的 gAGX 数量
 * @see docs/onchain-manual/contracts/redeemablegagx.md
 */
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

/**
 * AGX 换包为 gAGX
 *
 * 调用 RewardGAGX.wrap；需要先对 gAGX 合约授权 AGX，否则被阻断。
 *
 * @param wallet 当前钱包
 * @param agxAmount 拟换包的 AGX 数量
 * @see docs/onchain-manual/contracts/redeemablegagx.md
 */
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
