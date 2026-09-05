import { formatTokenAmount } from '~/core/exchange/token-amount'

/** 指标无法计算或估算失败时的诚实空。 */
export const TRADE_METRIC_UNAVAILABLE = '—'

const NATIVE_BNB_DECIMALS = 18

/**
 * 价格影响基点 → 两位小数百分比（含已结算的 `0.00%`）。
 *
 * @param bps 价格影响基点
 * @returns 如 `'1.23%'`
 */
export function formatPriceImpactPercent(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`
}

/**
 * 预估网络费用（wei）→ BNB 文案。已结算零值显式 `~0 BNB`，不用空串。
 *
 * @param wei 预估花费的 BNB wei
 * @returns 如 `'~0.00021 BNB'`
 */
export function formatEstimatedGasBnb(wei: bigint): string {
  return formatTokenAmount(wei, NATIVE_BNB_DECIMALS, {
    digits: 6,
    trimZeros: true,
    dust: false,
    prefix: '~',
    suffix: ' BNB',
  })
}

/**
 * 交易信息行文案。
 *
 * 未就绪 / 未取到 / 失败一律 `—`，禁止空串（CountValue 会把空串画成 `0`）。
 * 刷新时由报价查询 keepPreviousData 继续传入上次数字。
 * 已结算零值须显式 `'0.00%'` / `'~0 BNB'`。
 *
 * @param ready 已登录且卖出数量非空
 * @param settled 已结算文案；`undefined` 仍在加载，`null` 失败或不可算
 */
export function marketTradeInfoMetricLabel(
  ready: boolean,
  settled: string | null | undefined,
): string {
  if (!ready || settled == null) return TRADE_METRIC_UNAVAILABLE
  return settled
}
