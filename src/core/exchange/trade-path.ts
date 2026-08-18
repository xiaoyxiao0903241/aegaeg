import { parseSlippagePercentInput } from '~/core/exchange/token-amount'

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

/**
 * 卖出侧对应的买入选项。
 *
 * USD1 只能买 AGX；AGX 只能买 USD1；X 可买 AGX 或经 AGX 中转到 USD1。
 * 买入侧不可选 X（手册 `BuyNotAllowed`）。
 *
 * @param sell 卖出代币
 * @returns 合法买入 key，顺序即下拉默认
 */
export function buyKeysForSell(sell: TradeTokenKey): readonly TradeTokenKey[] {
  switch (sell) {
    case 'usd1':
      return ['agx']
    case 'agx':
      return ['usd1']
    case 'x':
      return ['usd1', 'agx']
  }
}

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

/**
 * 是否为合法有向市价对。
 *
 * @param sell 卖出代币
 * @param buy 买入代币
 */
export function isValidDirectedTradePair(sell: TradeTokenKey, buy: TradeTokenKey): boolean {
  return buyKeysForSell(sell).includes(buy)
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
 * - USD1↔AGX / X→AGX：单跳直达（X 买入在此拒绝）
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
 * USD1→AGX 1%；AGX→USD1 3%；卖 X 26%（覆盖链上 25% 卖出税 + 1% 池缓冲）。
 * 自定义未填时也走本函数；算出的百分比仍经 `amountOutMin` 进写链。
 *
 * @param sellKey 当前卖出代币
 * @returns 滑点百分比
 * @see 手册 §7.1 最小输出由前端滑点计算 amountOutMin
 * @see 手册 xtoken `SELL_TAX_BP = 2500`
 */
export function autoTradeSlippagePercent(sellKey: TradeTokenKey): number {
  switch (sellKey) {
    case 'usd1':
      return 1
    case 'agx':
      return 3
    case 'x':
      return 26
  }
}

/**
 * 市价实际滑点：默认档跟卖出币；自定义未填则仍用该档，不回落到统一 0.5%。
 *
 * @param mode 默认 / 自定义
 * @param customText 自定义输入；空串视为未设置
 * @param sellKey 当前卖出代币
 * @returns 写入报价的滑点百分比
 */
export function resolveTradeSlippagePercent(
  mode: 'auto' | 'custom',
  customText: string,
  sellKey: TradeTokenKey,
): number {
  if (mode === 'custom' && customText !== '') {
    return parseSlippagePercentInput(customText)
  }
  return autoTradeSlippagePercent(sellKey)
}

/**
 * 选币后纠偏成合法有向对。
 *
 * 卖出侧始终可点 USD1 / AGX / X；一点卖出，买入就落到该卖出的默认对手
 *（USD1→AGX，AGX→USD1，X→USD1），不因与当前买入相同而拒绝。
 * 买侧点到非法币（含 X）保持原对。
 *
 * @param side 改的是卖出还是买入
 * @param key 新选中的代币
 * @param sellKey 当前卖出
 * @param buyKey 当前买入
 */
export function pairAfterTokenSelect(
  side: 'sell' | 'buy',
  key: TradeTokenKey,
  sellKey: TradeTokenKey,
  buyKey: TradeTokenKey,
): { sellKey: TradeTokenKey; buyKey: TradeTokenKey } {
  if (side === 'buy') {
    if (!isValidDirectedTradePair(sellKey, key)) return { sellKey, buyKey }
    return { sellKey, buyKey: key }
  }

  const [nextBuy] = buyKeysForSell(key)
  if (!nextBuy) return { sellKey, buyKey }
  return { sellKey: key, buyKey: nextBuy }
}
