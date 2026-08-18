/**
 * Trade 卖/买代币 key：USD1 / AGX / X。
 *
 * @see 手册 §7.1 PancakeRouter；产品已开三币市价
 * @see 手册 xtoken：非白名单从 Pair 买入会 `BuyNotAllowed`，故 X 仅可卖
 */
export type TradeTokenKey = 'usd1' | 'agx' | 'x'

/** 市价可选代币。 */
export const TRADE_TOKEN_KEYS = ['usd1', 'agx', 'x'] as const satisfies readonly TradeTokenKey[]

export type TradeTokenAddresses = Record<TradeTokenKey, `0x${string}`>

/** 池邻接序：usd1—agx—x（仅相邻可成对；USD1↔X 无直连池）。 */
const RANK = { usd1: 0, agx: 1, x: 2 } as const

/**
 * X 仅可卖出（买入侧不可选）。
 *
 * @param key 市价代币 key
 * @returns 是否为仅卖代币
 * @see 手册 xtoken `BuyNotAllowed`
 */
export function isSellOnlyTradeToken(key: TradeTokenKey): boolean {
  return key === 'x'
}

/** 是否为合法无向市价对（相邻池）。 */
export function isValidTradePair(a: TradeTokenKey, b: TradeTokenKey): boolean {
  return a !== b && Math.abs(RANK[a] - RANK[b]) === 1
}

/**
 * 是否为合法有向市价对（相邻且买侧非仅卖代币）。
 *
 * @param sell 卖出代币
 * @param buy 买入代币
 */
export function isValidDirectedTradePair(sell: TradeTokenKey, buy: TradeTokenKey): boolean {
  return isValidTradePair(sell, buy) && !isSellOnlyTradeToken(buy)
}

/**
 * 当前有向对是否允许翻转（翻转后买侧仍合法）。
 *
 * @param sellKey 当前卖出
 * @param buyKey 当前买入
 */
export function canFlipTradePair(sellKey: TradeTokenKey, buyKey: TradeTokenKey): boolean {
  return isValidDirectedTradePair(buyKey, sellKey)
}

/**
 * 翻转卖/买；若翻转会使买侧落到仅卖代币则保持原对。
 *
 * @param sellKey 当前卖出
 * @param buyKey 当前买入
 */
export function pairAfterFlip(
  sellKey: TradeTokenKey,
  buyKey: TradeTokenKey,
): { sellKey: TradeTokenKey; buyKey: TradeTokenKey } {
  if (!canFlipTradePair(sellKey, buyKey)) {
    return { sellKey, buyKey }
  }
  return { sellKey: buyKey, buyKey: sellKey }
}

/**
 * Trade 的 Pancake V2 兑换路径。
 *
 * - USD1↔AGX / AGX→X 卖出：单跳直达（X 买入在此拒绝）
 * - X→USD1：经 AGX 中转
 *
 * @param sellKey 卖出代币
 * @param buyKey 买入代币
 * @param addresses 各代币合约地址
 * @returns 两段或三段地址路径；同币或买 X 时抛错
 * @see 手册 §7.1 PancakeRouter 买 AGX
 * @see 手册 xtoken `BuyNotAllowed`
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
  if (isSellOnlyTradeToken(buyKey)) {
    throw new Error(`TRADE_PATH_BUY_NOT_ALLOWED:${buyKey}`)
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
 * 市价交易「默认」滑点百分比。
 *
 * USD1 卖出用更紧的稳定币档；AGX / X 波动更大，用更宽档。
 * 自定义模式不走本函数；算出的百分比仍经 `amountOutMin` 进写链。
 *
 * @param sellKey 当前卖出代币
 * @returns 滑点百分比
 * @see 手册 §7.1 最小输出由前端滑点计算 amountOutMin
 */
export function autoTradeSlippagePercent(sellKey: TradeTokenKey): number {
  return sellKey === 'usd1' ? 0.3 : 2.5
}

/**
 * 选币后纠偏成合法有向对。
 *
 * - 买侧点到仅卖代币 → 保持原对
 * - 点到对侧同币 → 尝试翻转；翻转后买侧非法则保持原对
 * - 仍相邻 → 只改本侧
 * - 非邻接（USD1↔X）→ 对侧落到默认对手（AGX；选 AGX 时默认 USD1）
 */
export function pairAfterTokenSelect(
  side: 'sell' | 'buy',
  key: TradeTokenKey,
  sellKey: TradeTokenKey,
  buyKey: TradeTokenKey,
): { sellKey: TradeTokenKey; buyKey: TradeTokenKey } {
  const current = { sellKey, buyKey }

  if (side === 'buy' && isSellOnlyTradeToken(key)) {
    return current
  }

  let next: { sellKey: TradeTokenKey; buyKey: TradeTokenKey }
  if (key === (side === 'sell' ? buyKey : sellKey)) {
    next = { sellKey: buyKey, buyKey: sellKey }
  } else {
    const other = side === 'sell' ? buyKey : sellKey
    const fixed = isValidTradePair(key, other) ? other : key === 'agx' ? 'usd1' : 'agx'
    next = side === 'sell' ? { sellKey: key, buyKey: fixed } : { sellKey: fixed, buyKey: key }
  }

  if (isSellOnlyTradeToken(next.buyKey)) {
    return current
  }
  return next
}
