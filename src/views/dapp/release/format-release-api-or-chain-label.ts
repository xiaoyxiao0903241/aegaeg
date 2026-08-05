import { formatTokenAmount } from '~/core/exchange/token-amount'
import { formatGroupedNumber } from '~/shared/api/format-display'

/** 依次取 API 小数字符串、链上数值，最后回退到格式化后的零 */
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
  // 冷启动 / 未连接时不能留空；keepPreviousData 场景下 apiRaw 仍可用，走上方分支
  return `${formatGroupedNumber(0, { digits: 4 })} ${unit}`
}
