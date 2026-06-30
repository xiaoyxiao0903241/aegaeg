import { BSC_CONTRACTS } from '~/config/contracts'

export interface SwapTokenConfig {
  symbol: string
  address: `0x${string}`
  decimals: number
  enabled: boolean
}

export interface SwapConfig {
  chainId: 56
  router: `0x${string}`
  quoter: `0x${string}`
  pool: `0x${string}`
  feeTier: number
  wbnb: `0x${string}`
  defaultSlippageBps: number
  deadlineSeconds: number
  /** Poll on-chain swap quote while amount is set (ms). */
  quoteRefreshIntervalMs: number
  /** Poll pair spot rate for overview metric (ms). */
  spotRateRefreshIntervalMs: number
  testPair: {
    enabled: true
    /** Trade Swap pair — official USD1 / USDT on PancakeSwap V3 */
    symbols: ['USD1', 'USDT']
    tokenA: SwapTokenConfig
    tokenB: SwapTokenConfig
  }
  tokens: Record<'usd1' | 'xx' | 'usdt' | 'agx' | 'gagx' | 'x', SwapTokenConfig>
}

export const SWAP_CONFIG: SwapConfig = {
  chainId: BSC_CONTRACTS.chainId,
  router: BSC_CONTRACTS.pancakeV3SwapRouter,
  quoter: BSC_CONTRACTS.pancakeV3Quoter,
  pool: BSC_CONTRACTS.usdtUsd1Pool,
  feeTier: 100,
  wbnb: BSC_CONTRACTS.wbnb,
  defaultSlippageBps: 50,
  deadlineSeconds: 20 * 60,
  quoteRefreshIntervalMs: 10_000,
  spotRateRefreshIntervalMs: 10_000,
  testPair: {
    enabled: true,
    symbols: ['USD1', 'USDT'],
    tokenA: {
      symbol: 'USD1',
      address: BSC_CONTRACTS.usd1Official,
      decimals: 18,
      enabled: true,
    },
    tokenB: {
      symbol: 'USDT',
      address: BSC_CONTRACTS.usdt,
      decimals: 18,
      enabled: true,
    },
  },
  tokens: {
    usd1: {
      symbol: 'USD1',
      address: BSC_CONTRACTS.usd1Official,
      decimals: 18,
      enabled: true,
    },
    xx: {
      symbol: 'USDT',
      address: BSC_CONTRACTS.usdt,
      decimals: 18,
      enabled: true,
    },
    usdt: {
      symbol: 'USDT',
      address: BSC_CONTRACTS.usdt,
      decimals: 18,
      enabled: true,
    },
    agx: {
      symbol: 'AGX',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      enabled: false,
    },
    gagx: {
      symbol: 'gAGX',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      enabled: false,
    },
    x: {
      symbol: 'X',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      enabled: false,
    },
  },
}
