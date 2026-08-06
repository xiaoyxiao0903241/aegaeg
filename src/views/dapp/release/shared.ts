import { formatTokenAmount } from '~/core/exchange/token-amount'
import { releaseProgressBps } from '~/core/release/release-block-reasons'
import { formatNumber, parseApiAmount } from '~/shared/presenters/format'

/** 有链快照时优先链上数值，否则 API 小数字符串，最后回退到格式化后的零 */
export function formatReleaseApiOrChainLabel(args: {
  sessionReady: boolean
  apiRaw: string | undefined
  chainReady: boolean
  chainValue: bigint
  decimals: number
  unit: string
}): string {
  const { sessionReady, apiRaw, chainReady, chainValue, decimals, unit } = args
  // 有链快照时优先链（与进度条同源）；避免 API「累计已释放」与链「当前可领」同标签互换
  if (chainReady) return `${formatTokenAmount(chainValue, decimals, 4)} ${unit}`
  if (sessionReady) {
    const n = parseApiAmount(apiRaw)
    if (n != null) return `${formatNumber(n, { digits: 4 })} ${unit}`
  }
  return `${formatNumber(0, { digits: 4 })} ${unit}`
}

/** 释放进度百分比文案：按基点换算，能整除时省略小数位 */
export function formatReleasePct(claimable: bigint, releasing: bigint): string {
  const bps = releaseProgressBps(claimable, releasing)
  const pct = (bps / 100).toFixed(bps % 100 === 0 ? 0 : 1)
  return `${pct}%`
}
