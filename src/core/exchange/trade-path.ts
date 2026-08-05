/**
 * Trade 卖/买代币 key：USDT(USD1) / AGX / X。
 *
 * 仅手册 §7.1 的 USD1↔AGX 交易对当前可用。
 *
 * @see 手册 §7.1 PancakeRouter 买 AGX
 */
export type TradeTokenKey = 'usd1' | 'agx' | 'x'

export const TRADE_TOKEN_KEYS = ['usd1', 'agx', 'x'] as const satisfies readonly TradeTokenKey[]

/**
 * 当前可选择的交易对（手册 §7.1）：X 在 DEFER 放开前显示为禁用。
 *
 * @see 手册 §7.1 PancakeRouter 买 AGX
 */
export const TRADE_LIVE_TOKEN_KEYS = ['usd1', 'agx'] as const satisfies readonly TradeTokenKey[]

export type TradeTokenAddresses = Record<TradeTokenKey, `0x${string}`>

/** 判断交易对是否当前可用。 */
export function isTradeTokenLive(key: TradeTokenKey): boolean {
  return (TRADE_LIVE_TOKEN_KEYS as readonly TradeTokenKey[]).includes(key)
}

/**
 * Trade 的 Pancake V2 兑换路径。
 *
 * - USD1↔AGX / AGX↔X：单跳直达
 * - USD1↔X：经 AGX 中转（原型：`X → AGX → USD1`）
 * 当前界面只选 USD1↔AGX；X 路径保留给 DEFER 放开后启用。
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
 * 卖出变化后确定买入代币。
 *
 * 原买入仍合法且可用则保留；否则取另一可用代币。
 *
 * @param sellKey 新的卖出代币
 * @param previousBuyKey 原买入代币
 * @returns 应选用的买入代币
 */
export function buyKeyAfterSellChange(
  sellKey: TradeTokenKey,
  previousBuyKey: TradeTokenKey,
): TradeTokenKey {
  if (previousBuyKey !== sellKey && isTradeTokenLive(previousBuyKey)) return previousBuyKey
  if (!isTradeTokenLive(sellKey)) return 'agx'
  return sellKey === 'usd1' ? 'agx' : 'usd1'
}

/**
 * 可选的买入代币（排除当前卖出代币）。
 *
 * @param sellKey 卖出代币
 * @returns 可选买入代币列表
 */
export function tradeBuyOptions(sellKey: TradeTokenKey): TradeTokenKey[] {
  return TRADE_TOKEN_KEYS.filter((key) => key !== sellKey)
}
