/**
 * Trade 卖/买代币 key：USD1 / AGX / X。
 *
 * @see 手册 §7.1 PancakeRouter；产品已开三币市价
 */
export type TradeTokenKey = 'usd1' | 'agx' | 'x'

/** 市价可选代币。 */
export const TRADE_TOKEN_KEYS = ['usd1', 'agx', 'x'] as const satisfies readonly TradeTokenKey[]

export type TradeTokenAddresses = Record<TradeTokenKey, `0x${string}`>

/** 池邻接序：usd1—agx—x（仅相邻可成对；USD1↔X 无直连池）。 */
const RANK = { usd1: 0, agx: 1, x: 2 } as const

/** 是否为合法市价对（相邻池）。 */
export function isValidTradePair(a: TradeTokenKey, b: TradeTokenKey): boolean {
  return a !== b && Math.abs(RANK[a] - RANK[b]) === 1
}

/**
 * Trade 的 Pancake V2 兑换路径。
 *
 * - USD1↔AGX / AGX↔X：单跳直达
 * - USD1↔X：经 AGX 中转（选币 UI 不产出此对；路径仍 fail-closed 可算）
 *
 * @param sellKey 卖出代币
 * @param buyKey 买入代币
 * @param addresses 各代币合约地址
 * @returns 两段或三段地址路径；买卖同一代币时抛错
 * @see 手册 §7.1 PancakeRouter 买 AGX
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

/** 判断字符串是否为合法交易对 key。 */
export function isTradeTokenKey(value: string): value is TradeTokenKey {
  return (TRADE_TOKEN_KEYS as readonly string[]).includes(value)
}

/**
 * 选币后纠偏成合法对。
 *
 * - 点到对侧同币 → 翻转
 * - 仍相邻 → 只改本侧
 * - 非邻接（USD1↔X）→ 对侧落到默认对手（AGX；选 AGX 时默认 USD1）
 */
export function pairAfterTokenSelect(
  side: 'sell' | 'buy',
  key: TradeTokenKey,
  sellKey: TradeTokenKey,
  buyKey: TradeTokenKey,
): { sellKey: TradeTokenKey; buyKey: TradeTokenKey } {
  if (key === (side === 'sell' ? buyKey : sellKey)) {
    return { sellKey: buyKey, buyKey: sellKey }
  }
  const other = side === 'sell' ? buyKey : sellKey
  const fixed = isValidTradePair(key, other) ? other : key === 'agx' ? 'usd1' : 'agx'
  return side === 'sell' ? { sellKey: key, buyKey: fixed } : { sellKey: fixed, buyKey: key }
}
