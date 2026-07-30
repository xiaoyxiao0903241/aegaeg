import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import {
  resolveTradePath,
  type TradeTokenAddresses,
  type TradeTokenKey,
} from '~/core/exchange/resolve-trade-path'
import { FLASH_PAIR_DEFAULT, isFlashPairId, type FlashPairId } from '~/core/exchange/flash-pair'

export type { FlashPairId } from '~/core/exchange/flash-pair'
export { FLASH_PAIR_DEFAULT, isFlashPairId }
export type { TradeTokenKey } from '~/core/exchange/resolve-trade-path'
export {
  TRADE_TOKEN_KEYS,
  TRADE_LIVE_TOKEN_KEYS,
  tradeBuyOptions,
  isTradeTokenKey,
  isTradeTokenLive,
  resolveBuyKeyAfterSellChange,
  resolveTradePath,
} from '~/core/exchange/resolve-trade-path'

export interface ExchangePairToken {
  key: 'usd1' | 'usdt' | 'agx' | 'gagx' | 'x'
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

const AGX_TRADE_TOKEN: ExchangePairToken = {
  key: 'agx',
  symbol: EXCHANGE_CONFIG.tradePair.tokenB.symbol,
  address: EXCHANGE_CONFIG.tradePair.tokenB.address,
  decimals: EXCHANGE_CONFIG.tradePair.tokenB.decimals,
  icon: EXCHANGE_CONFIG.tradePair.tokenB.icon,
}

const X_TRADE_TOKEN: ExchangePairToken = {
  key: 'x',
  symbol: EXCHANGE_CONFIG.tokens.x.symbol,
  address: EXCHANGE_CONFIG.tokens.x.address,
  decimals: EXCHANGE_CONFIG.tokens.x.decimals,
  icon: EXCHANGE_CONFIG.tokens.x.icon,
}

const USDT_TOKEN: ExchangePairToken = {
  key: 'usdt',
  symbol: EXCHANGE_CONFIG.tokens.usdt.symbol,
  address: EXCHANGE_CONFIG.tokens.usdt.address,
  decimals: EXCHANGE_CONFIG.tokens.usdt.decimals,
  icon: EXCHANGE_CONFIG.tokens.usdt.icon,
}

const GAGX_TOKEN: ExchangePairToken = {
  key: 'gagx',
  symbol: EXCHANGE_CONFIG.tokens.gagx.symbol,
  address: EXCHANGE_CONFIG.tokens.gagx.address,
  decimals: EXCHANGE_CONFIG.tokens.gagx.decimals,
  icon: EXCHANGE_CONFIG.tokens.gagx.icon,
}

const AGX_TOKEN: ExchangePairToken = {
  key: 'agx',
  symbol: EXCHANGE_CONFIG.tokens.agx.symbol,
  address: EXCHANGE_CONFIG.tokens.agx.address,
  decimals: EXCHANGE_CONFIG.tokens.agx.decimals,
  icon: EXCHANGE_CONFIG.tokens.agx.icon,
}

const TRADE_TOKENS: Record<TradeTokenKey, ExchangePairToken> = {
  usd1: USD1_TOKEN,
  agx: AGX_TRADE_TOKEN,
  x: X_TRADE_TOKEN,
}

export const TRADE_TOKEN_ADDRESSES: TradeTokenAddresses = {
  usd1: USD1_TOKEN.address,
  agx: AGX_TRADE_TOKEN.address,
  x: X_TRADE_TOKEN.address,
}

export function getTradeToken(key: TradeTokenKey): ExchangePairToken {
  return TRADE_TOKENS[key]
}

/** Trade — proto three-token picker; path via `resolveTradePath`. */
export function getTradePairTokens(
  sellKey: TradeTokenKey,
  buyKey: TradeTokenKey,
): ExchangePairTokens {
  return { sell: getTradeToken(sellKey), buy: getTradeToken(buyKey) }
}

export function getTradeSwapPath(
  sellKey: TradeTokenKey,
  buyKey: TradeTokenKey,
): readonly `0x${string}`[] {
  return resolveTradePath(sellKey, buyKey, TRADE_TOKEN_ADDRESSES)
}

export function formatTradeRouteLabel(sellKey: TradeTokenKey, buyKey: TradeTokenKey): string {
  const path = getTradeSwapPath(sellKey, buyKey)
  const byAddress = new Map(
    Object.values(TRADE_TOKENS).map((token) => [token.address.toLowerCase(), token.symbol]),
  )
  return path.map((address) => byAddress.get(address.toLowerCase()) ?? '?').join(' → ')
}

/** @deprecated Prefer getTradePairTokens — kept for spot helpers that still use direction. */
export function getExchangePairTokens(direction: ExchangeDirection): ExchangePairTokens {
  return direction === 'forward'
    ? { sell: USD1_TOKEN, buy: AGX_TRADE_TOKEN }
    : { sell: AGX_TRADE_TOKEN, buy: USD1_TOKEN }
}

/** Flash dual pairs — direction flips gAGX wrap↔redeem; USDT is forward-only (Usd1Swap). */
export function getFlashExchangePairTokens(
  pairId: FlashPairId,
  direction: ExchangeDirection = 'forward',
): ExchangePairTokens {
  if (pairId === 'usdt') {
    return { sell: USDT_TOKEN, buy: USD1_TOKEN }
  }
  return direction === 'forward'
    ? { sell: GAGX_TOKEN, buy: AGX_TOKEN }
    : { sell: AGX_TOKEN, buy: GAGX_TOKEN }
}

export function flashPairAllowsFlip(pairId: FlashPairId): boolean {
  return pairId === 'gagx'
}
