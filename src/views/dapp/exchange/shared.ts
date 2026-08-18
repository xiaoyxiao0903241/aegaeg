/**
 * 兑换域共享类型与纯函数
 *
 * 覆盖报价提交流程接口、子视图挂载矩阵、行情标签与路由文案。
 */
import type { ExchangeDirection } from '~/core/exchange/exchange-direction'
import { FLASH_PAIR_DEFAULT, type FlashPairId, isFlashPairId } from '~/core/exchange/flash-pair'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { tradePath, type TradeTokenAddresses, type TradeTokenKey } from '~/core/exchange/trade-path'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { WriteSession } from '~/web3/wallet/require-write-session'

// —— quoted-submit-core ——

export type QuotedSubmitExecute = (helpers: {
  session: WriteSession
  assertStillSubmittable: (live?: {
    sellBalance: bigint
  }) => Promise<{ amountOutMin: bigint; quotedOut: bigint }>
}) => Promise<void>

/** 闪电兑换 / 市价交易 / 销毁共用的报价提交流程接口。 */
export type QuotedSubmitCore = {
  debouncedAmountIn: bigint
  runQuotedSubmit: (
    run: QuotedSubmitExecute,
  ) => Promise<{ ok: true } | { ok: false; error: unknown | null }>
}

// —— exchange-views-needing-provider ——

export type ExchangeSubview = 'hub' | 'flash' | 'trade' | 'burn' | 'turbine'

/** 纯挂载矩阵：离开子视图即卸载其会话提供者，丢弃本地报价与提交状态。 */
export function viewsNeedingProvider(
  view: ExchangeSubview,
  motion: boolean,
  outgoingView: ExchangeSubview | null,
  incomingView: ExchangeSubview | null,
): { flash: boolean; trade: boolean; burn: boolean; turbine: boolean } {
  const active = new Set<ExchangeSubview>()
  if (motion) {
    if (outgoingView) active.add(outgoingView)
    if (incomingView) active.add(incomingView)
  } else {
    active.add(view)
  }
  return {
    flash: active.has('flash'),
    trade: active.has('trade'),
    burn: active.has('burn'),
    turbine: active.has('turbine'),
  }
}

// —— exchange-format-rate ——

function normalizeRateOutPerUnit(amountIn: bigint, amountOut: bigint, decimalsIn: number): bigint {
  const oneUnitIn = 10n ** BigInt(decimalsIn)
  return (amountOut * oneUnitIn) / amountIn
}

function formatRateRatioFixed(
  normalizedOut: bigint,
  decimalsOut: number,
  fractionDigits = 4,
): string {
  return formatTokenAmount(normalizedOut, decimalsOut, {
    digits: fractionDigits,
    trimZeros: false,
  })
}

/** 去掉小数尾零：兑换率显示 `1 : 1` 而非 `1 : 1.0000`。 */
function trimTrailingZeros(value: string): string {
  if (!value.includes('.')) return value
  return value.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
}

/** 兑换率标签：`1 : 1` 冒号形式，最多 4 位小数。未知/零报价 → `1 : 0`。 */
export function formatExchangeRateColon({
  amountIn,
  amountOut,
  decimalsIn,
  decimalsOut,
}: {
  amountIn: bigint
  amountOut: bigint
  decimalsIn: number
  decimalsOut: number
}): string {
  if (amountIn === 0n || amountOut === 0n) {
    return '1 : 0'
  }

  const normalizedOut = normalizeRateOutPerUnit(amountIn, amountOut, decimalsIn)

  return `1 : ${trimTrailingZeros(formatRateRatioFixed(normalizedOut, decimalsOut))}`
}

/** 市价交易行情标签：`1 USD1 = 0.015385 AGX`；未知/零报价保留固定显示形态。 */
export function formatExchangeRateApprox({
  amountIn,
  amountOut,
  decimalsIn,
  decimalsOut,
  symbolIn,
  symbolOut,
  fractionDigits = 3,
}: {
  amountIn: bigint
  amountOut: bigint
  decimalsIn: number
  decimalsOut: number
  symbolIn: string
  symbolOut: string
  fractionDigits?: number
}): string {
  if (amountIn === 0n || amountOut === 0n) {
    return `1 ${symbolIn} = ${formatRateRatioFixed(0n, decimalsOut, fractionDigits)} ${symbolOut}`
  }

  const normalizedOut = normalizeRateOutPerUnit(amountIn, amountOut, decimalsIn)

  return `1 ${symbolIn} = ${formatRateRatioFixed(normalizedOut, decimalsOut, fractionDigits)} ${symbolOut}`
}

// —— exchange-pair ——

export type { FlashPairId } from '~/core/exchange/flash-pair'
export { FLASH_PAIR_DEFAULT, isFlashPairId }
export type { TradeTokenKey } from '~/core/exchange/trade-path'
export {
  canFlipTradePair,
  isSellOnlyTradeToken,
  isTradeTokenKey,
  pairAfterTokenSelect,
  TRADE_TOKEN_KEYS,
  tradePath,
} from '~/core/exchange/trade-path'

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

/** 市价交易币对：三种代币两两组合，路由路径由 tradePath 计算。 */
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
  return tradePath(sellKey, buyKey, TRADE_TOKEN_ADDRESSES)
}

export function formatTradeRouteLabel(sellKey: TradeTokenKey, buyKey: TradeTokenKey): string {
  const path = getTradeSwapPath(sellKey, buyKey)
  const byAddress = new Map(
    Object.values(TRADE_TOKENS).map((token) => [token.address.toLowerCase(), token.symbol]),
  )
  return path.map((address) => byAddress.get(address.toLowerCase()) ?? '?').join(' → ')
}

/** 闪电兑换双币对：gAGX→AGX、USDT→USD1 均为正向；token 映射仍保留 gAGX 反向包装。 */
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

/** 闪兑两对均为单向（gAGX→AGX、USDT→USD1），中间不提供翻转。 */
export function flashPairAllowsFlip(pairId: FlashPairId): boolean {
  switch (pairId) {
    case 'gagx':
    case 'usdt':
      return false
  }
}
