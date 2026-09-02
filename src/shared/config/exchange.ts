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
  /** Pancake V2 路由器——手册 §7.1 PancakeRouter 买 AGX */
  router: `0x${string}`
  /** Pancake V2 AGX/USD1 交易对 */
  pool: `0x${string}`
  defaultSlippageBps: number
  deadlineSeconds: number
  /** 输入数量已填写时，轮询链上兑换报价的间隔（毫秒）。 */
  quoteRefreshIntervalMs: number
  /**
   * 写按钮可点用的报价最大年龄（毫秒）。
   * 必须明显大于 `quoteRefreshIntervalMs`，避免轮询交界处周期性灰钮；
   * 真正成交仍走 submit 时 live refetch。
   */
  quoteUiMaxAgeMs: number
  /** 轮询交易对即时价、用于概览指标的间隔（毫秒）。 */
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
  quoteUiMaxAgeMs: 30_000,
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
