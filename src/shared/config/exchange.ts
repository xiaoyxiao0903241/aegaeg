import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { appEnv } from '~/shared/config/env'

export interface ExchangeTokenConfig {
  symbol: string
  address: `0x${string}`
  decimals: number
  enabled: boolean
  icon: string
}

export interface ExchangeConfig {
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
  tradePair: {
    enabled: true
    symbols: ['USD1', 'USDT']
    tokenA: ExchangeTokenConfig
    tokenB: ExchangeTokenConfig
  }
  tokens: Record<'usd1' | 'usdt' | 'agx' | 'gagx' | 'x', ExchangeTokenConfig>
}

export const EXCHANGE_CONFIG: ExchangeConfig = {
  chainId: BSC_CONTRACTS.chainId,
  router: BSC_CONTRACTS.pancakeV3SwapRouter,
  quoter: BSC_CONTRACTS.pancakeV3Quoter,
  pool: BSC_CONTRACTS.usdtUsd1Pool,
  feeTier: 100,
  wbnb: BSC_CONTRACTS.wbnb,
  defaultSlippageBps: appEnv.exchangeDefaultSlippageBps,
  deadlineSeconds: appEnv.exchangeDeadlineSeconds,
  quoteRefreshIntervalMs: 10_000,
  spotRateRefreshIntervalMs: 10_000,
  tradePair: {
    enabled: true,
    symbols: ['USD1', 'USDT'],
    tokenA: {
      symbol: 'USD1',
      address: BSC_CONTRACTS.usd1,
      decimals: 18,
      enabled: true,
      icon: '/assets/figma/dapp/token-usd1.svg',
    },
    tokenB: {
      symbol: 'USDT',
      address: BSC_CONTRACTS.usdt,
      decimals: 18,
      enabled: true,
      icon: '/assets/figma/dapp/token-usdt.svg',
    },
  },
  tokens: {
    usd1: {
      symbol: 'USD1',
      address: BSC_CONTRACTS.usd1,
      decimals: 18,
      enabled: true,
      icon: '/assets/figma/dapp/token-usd1.svg',
    },
    usdt: {
      symbol: 'USDT',
      address: BSC_CONTRACTS.usdt,
      decimals: 18,
      enabled: true,
      icon: '/assets/figma/dapp/token-usdt.svg',
    },
    agx: {
      symbol: 'AGX',
      address: BSC_CONTRACTS.agx,
      decimals: 9,
      enabled: false,
      icon: '',
    },
    gagx: {
      symbol: 'gAGX',
      address: BSC_CONTRACTS.gagx,
      decimals: 18,
      enabled: false,
      icon: '',
    },
    x: {
      symbol: 'X',
      address: BSC_CONTRACTS.xToken,
      decimals: 18,
      enabled: false,
      icon: '',
    },
  },
}
