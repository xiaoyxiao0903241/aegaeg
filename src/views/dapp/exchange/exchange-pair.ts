import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import { FLASH_PAIR_DEFAULT, isFlashPairId, type FlashPairId } from '~/core/exchange/flash-pair'

export type { ExchangeDirection } from '~/core/exchange/exchange-direction'
export type { FlashPairId } from '~/core/exchange/flash-pair'
export { FLASH_PAIR_DEFAULT, isFlashPairId }

export interface ExchangePairToken {
  key: 'usd1' | 'usdt' | 'agx' | 'gagx'
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

/** Trade pair — handbook §7.1 / Figma `4433:220`: USD1 ↔ AGX. */
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
