import { appEnv } from '~/config/env'

export interface BscContracts {
  chainId: 56
  wbnb: `0x${string}`
  /** Legacy test USD1 — Flash Swap / PreSale until migrated */
  usd1: `0x${string}`
  /** Official USD1 — PancakeSwap V3 USDT/USD1 pool */
  usd1Official: `0x${string}`
  /** Legacy test USDT stand-in (xxToken) — Flash Swap until migrated */
  xxToken: `0x${string}`
  /** Official BSC USDT — Trade Swap (PancakeSwap V3) */
  usdt: `0x${string}`
  /** Legacy V2 pair (test tokens) */
  xxUsd1Pair: `0x${string}`
  /** PancakeSwap V2 router (unused by Trade Swap after V3 migration) */
  pancakeRouter: `0x${string}`
  /** PancakeSwap V3 Smart Router — required for PCS V3 pool swaps on BSC */
  pancakeV3SwapRouter: `0x${string}`
  pancakeV3Quoter: `0x${string}`
  usdtUsd1Pool: `0x${string}`
  preSale: `0x${string}`
  multicall3: `0x${string}`
  referral: `0x${string}`
  rewardClaimer: `0x${string}`
  /** Community development fund vault — claimReward signType=2 */
  communityFundVault: `0x${string}`
  defaultReferrer: `0x${string}`
  /** AegisUsd1Swap — USDT → USD1 flash swap (BSC mainnet) */
  usd1Swap: `0x${string}`
}

/** BSC contract addresses — override via VITE_BSC_* in `.env` at build time. */
export const BSC_CONTRACTS: BscContracts = {
  chainId: appEnv.contracts.chainId as 56,
  wbnb: appEnv.contracts.wbnb,
  usd1: appEnv.contracts.usd1,
  usd1Official: appEnv.contracts.usd1Official,
  xxToken: appEnv.contracts.xxToken,
  usdt: appEnv.contracts.usdt,
  xxUsd1Pair: appEnv.contracts.xxUsd1Pair,
  pancakeRouter: appEnv.contracts.pancakeRouter,
  pancakeV3SwapRouter: appEnv.contracts.pancakeV3SwapRouter,
  pancakeV3Quoter: appEnv.contracts.pancakeV3Quoter,
  usdtUsd1Pool: appEnv.contracts.usdtUsd1Pool,
  preSale: appEnv.contracts.preSale,
  multicall3: appEnv.contracts.multicall3,
  referral: appEnv.contracts.referral,
  rewardClaimer: appEnv.contracts.rewardClaimer,
  communityFundVault: appEnv.contracts.communityFundVault,
  defaultReferrer: appEnv.contracts.defaultReferrer,
  usd1Swap: appEnv.contracts.usd1Swap,
}
