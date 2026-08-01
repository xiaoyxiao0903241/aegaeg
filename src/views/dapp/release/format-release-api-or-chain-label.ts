import { formatGroupedNumber } from '~/shared/api/format-display'
import { formatTokenAmount } from '~/core/exchange/token-amount'

/** 优先 API 小数字符串；否则链上额；否则格式化零。 */
export function formatReleaseApiOrChainLabel(args: {
  sessionReady: boolean
  apiRaw: string | undefined
  chainReady: boolean
  chainValue: bigint
  decimals: number
  unit: string
}): string {
  const { sessionReady, apiRaw, chainReady, chainValue, decimals, unit } = args
  if (sessionReady && apiRaw != null && apiRaw.trim() !== '') {
    const n = Number(apiRaw)
    if (Number.isFinite(n)) return `${formatGroupedNumber(n, { digits: 4 })} ${unit}`
  }
  if (chainReady) return `${formatTokenAmount(chainValue, decimals, 4)} ${unit}`
  // 冷启动 / 未连接：禁空白；keepPreviousData 时仍有 apiRaw 走上方分支。
  return `${formatGroupedNumber(0, { digits: 4 })} ${unit}`
}
