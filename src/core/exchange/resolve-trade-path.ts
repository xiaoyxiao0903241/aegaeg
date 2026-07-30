/** Trade sell/buy keys — proto picker USD1 / AGX / X (product extension beyond handbook §7.1). */
export type TradeTokenKey = 'usd1' | 'agx' | 'x'

export const TRADE_TOKEN_KEYS = ['usd1', 'agx', 'x'] as const satisfies readonly TradeTokenKey[]

export type TradeTokenAddresses = Record<TradeTokenKey, `0x${string}`>

/**
 * Pancake V2 path for Trade.
 * - USD1↔AGX / AGX↔X: direct hop
 * - USD1↔X: via AGX (proto: `X → AGX → USD1`)
 */
export function resolveTradePath(
  sellKey: TradeTokenKey,
  buyKey: TradeTokenKey,
  addresses: TradeTokenAddresses,
):
  readonly [`0x${string}`, `0x${string}`] | readonly [`0x${string}`, `0x${string}`, `0x${string}`] {
  if (sellKey === buyKey) {
    throw new Error(`TRADE_PATH_SAME_TOKEN:${sellKey}`)
  }

  const sell = addresses[sellKey]
  const buy = addresses[buyKey]
  const keys = new Set<TradeTokenKey>([sellKey, buyKey])

  if (keys.has('usd1') && keys.has('x')) {
    return [sell, addresses.agx, buy]
  }

  return [sell, buy]
}

export function isTradeTokenKey(value: string): value is TradeTokenKey {
  return (TRADE_TOKEN_KEYS as readonly string[]).includes(value)
}

/** When sell changes, keep buy if still valid; else default (X → AGX, else first other). */
export function resolveBuyKeyAfterSellChange(
  sellKey: TradeTokenKey,
  previousBuyKey: TradeTokenKey,
): TradeTokenKey {
  if (previousBuyKey !== sellKey) return previousBuyKey
  if (sellKey === 'x') return 'agx'
  return sellKey === 'usd1' ? 'agx' : 'usd1'
}

export function tradeBuyOptions(sellKey: TradeTokenKey): TradeTokenKey[] {
  return TRADE_TOKEN_KEYS.filter((key) => key !== sellKey)
}
