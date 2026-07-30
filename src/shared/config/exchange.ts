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
  /** Pancake V2 Router — handbook §7.1 */
  router: `0x${string}`
  /** Pancake V2 AGX/USD1 pair */
  pool: `0x${string}`
  defaultSlippageBps: number
  deadlineSeconds: number
  /** Poll on-chain swap quote while amount is set (ms). */
  quoteRefreshIntervalMs: number
  /** Poll pair spot rate for overview metric (ms). */
  spotRateRefreshIntervalMs: number
  tradePair: {
    enabled: true
    symbols: ['USD1', 'AGX']
    tokenA: ExchangeTokenConfig
    tokenB: ExchangeTokenConfig
  }
  tokens: Record<'usd1' | 'usdt' | 'agx' | 'gagx' | 'x', ExchangeTokenConfig>
}

export const EXCHANGE_CONFIG: ExchangeConfig = {
  chainId: BSC_CONTRACTS.chainId,
  router: BSC_CONTRACTS.pancakeRouter,
  pool: BSC_CONTRACTS.pancakePair,
  defaultSlippageBps: appEnv.exchangeDefaultSlippageBps,
  deadlineSeconds: appEnv.exchangeDeadlineSeconds,
  quoteRefreshIntervalMs: 10_000,
  spotRateRefreshIntervalMs: 10_000,
  tradePair: {
    enabled: true,
    symbols: ['USD1', 'AGX'],
    tokenA: {
      symbol: 'USD1',
      address: BSC_CONTRACTS.usd1,
      decimals: 18,
      enabled: true,
      icon: '/assets/figma/dapp/token-usd1.svg',
    },
    tokenB: {
      symbol: 'AGX',
      address: BSC_CONTRACTS.agx,
      decimals: 9,
      enabled: true,
      icon: '/assets/figma/dapp/carousel/token-agx.png',
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
      enabled: true,
      icon: '/assets/figma/dapp/carousel/token-agx.png',
    },
    gagx: {
      symbol: 'gAGX',
      address: BSC_CONTRACTS.gagx,
      decimals: 9,
      enabled: true,
      icon: '/assets/figma/dapp/carousel/token-gagx.png',
    },
    x: {
      symbol: 'X',
      address: BSC_CONTRACTS.xToken,
      decimals: 18,
      enabled: true,
      icon: '/assets/figma/dapp/carousel/token-x.png',
    },
  },
}
