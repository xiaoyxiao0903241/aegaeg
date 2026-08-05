import { formatTokenAmount } from '~/core/exchange/token-amount'
import { releaseProgressBps } from '~/core/release/release-block-reasons'
import { formatGroupedNumber, parseApiAmount } from '~/shared/api/format-display'

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
  if (sessionReady) {
    const n = parseApiAmount(apiRaw)
    if (n != null) return `${formatGroupedNumber(n, { digits: 4 })} ${unit}`
  }
  if (chainReady) return `${formatTokenAmount(chainValue, decimals, 4)} ${unit}`
  // 冷启动 / 未连接时不能留空；keepPreviousData 场景下 apiRaw 仍可用，走上方分支
  return `${formatGroupedNumber(0, { digits: 4 })} ${unit}`
}

/** 释放进度百分比文案：按基点换算，能整除时省略小数位 */
export function formatReleasePct(claimable: bigint, releasing: bigint): string {
  const bps = releaseProgressBps(claimable, releasing)
  const pct = (bps / 100).toFixed(bps % 100 === 0 ? 0 : 1)
  return `${pct}%`
}
