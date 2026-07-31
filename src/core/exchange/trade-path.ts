/** Trade sell/buy keys — proto picker lists USD1 / AGX / X; only handbook §7.1 pair is live. */
export type TradeTokenKey = 'usd1' | 'agx' | 'x'

export const TRADE_TOKEN_KEYS = ['usd1', 'agx', 'x'] as const satisfies readonly TradeTokenKey[]

/** Handbook §7.1 Pancake Trade — live selectable keys (X shown disabled until DEFER lifts). */
export const TRADE_LIVE_TOKEN_KEYS = ['usd1', 'agx'] as const satisfies readonly TradeTokenKey[]

export type TradeTokenAddresses = Record<TradeTokenKey, `0x${string}`>

export function isTradeTokenLive(key: TradeTokenKey): boolean {
  return (TRADE_LIVE_TOKEN_KEYS as readonly TradeTokenKey[]).includes(key)
}

/**
 * Pancake V2 path for Trade.
 * - USD1↔AGX / AGX↔X: direct hop
 * - USD1↔X: via AGX (proto: `X → AGX → USD1`)
 * Live UI only selects USD1↔AGX; X paths retained for DEFER re-enable.
 */
export function tradePath(
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

/** When sell changes, keep buy if still valid + live; else default to other live token. */
export function buyKeyAfterSellChange(
  sellKey: TradeTokenKey,
  previousBuyKey: TradeTokenKey,
): TradeTokenKey {
  if (previousBuyKey !== sellKey && isTradeTokenLive(previousBuyKey)) return previousBuyKey
  if (!isTradeTokenLive(sellKey)) return 'agx'
  return sellKey === 'usd1' ? 'agx' : 'usd1'
}

export function tradeBuyOptions(sellKey: TradeTokenKey): TradeTokenKey[] {
  return TRADE_TOKEN_KEYS.filter((key) => key !== sellKey)
}
