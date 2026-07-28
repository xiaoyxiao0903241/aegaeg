import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'

export type { ExchangeDirection } from '~/core/exchange/exchange-direction'

export interface ExchangePairToken {
  key: 'usd1' | 'usdt'
  symbol: string
  address: `0x${string}`
  decimals: number
  icon: string
}

export interface ExchangePairTokens {
  sell: ExchangePairToken
  buy: ExchangePairToken
}

const USD1_TOKEN: ExchangePairToken = {
  key: 'usd1',
  symbol: EXCHANGE_CONFIG.tradePair.tokenA.symbol,
  address: EXCHANGE_CONFIG.tradePair.tokenA.address,
  decimals: EXCHANGE_CONFIG.tradePair.tokenA.decimals,
  icon: EXCHANGE_CONFIG.tradePair.tokenA.icon,
}

const USDT_TOKEN: ExchangePairToken = {
  key: 'usdt',
  symbol: EXCHANGE_CONFIG.tradePair.tokenB.symbol,
  address: EXCHANGE_CONFIG.tradePair.tokenB.address,
  decimals: EXCHANGE_CONFIG.tradePair.tokenB.decimals,
  icon: EXCHANGE_CONFIG.tradePair.tokenB.icon,
}

export function getExchangePairTokens(direction: ExchangeDirection): ExchangePairTokens {
  return direction === 'forward'
    ? { sell: USD1_TOKEN, buy: USDT_TOKEN }
    : { sell: USDT_TOKEN, buy: USD1_TOKEN }
}
