import { formatTokenAmount } from '~/core/exchange/token-amount'
import { releaseProgressBps } from '~/core/release/release-block-reasons'
import { formatDecimal, parseApiAmount } from '~/shared/presenters/format'

/** 有链快照时优先链上数值，否则 API 小数字符串；皆无 → `--` */
export function formatReleaseApiOrChainLabel(args: {
  sessionReady: boolean
  apiRaw: string | undefined
  chainReady: boolean
  chainValue: bigint
  decimals: number
  unit: string
}): string {
  const { sessionReady, apiRaw, chainReady, chainValue, decimals, unit } = args
  const unitSuffix = ` ${unit}`
  // 有链快照时优先链（与进度条同源）；避免 API「累计已释放」与链「当前可领」同标签互换
  if (chainReady) {
    return formatTokenAmount(chainValue, decimals, {
      digits: 4,
      trimZeros: false,
      suffix: unitSuffix,
    })
  }
  return formatDecimal(sessionReady ? parseApiAmount(apiRaw) : null, {
    digits: 4,
    suffix: unitSuffix,
  })
}

/** 释放进度百分比文案：按基点换算，能整除时省略小数位 */
export function formatReleasePct(claimable: bigint, releasing: bigint): string {
  const bps = releaseProgressBps(claimable, releasing)
  return formatDecimal(bps / 100, {
    digits: bps % 100 === 0 ? 0 : 1,
    fraction: 'natural',
    suffix: '%',
  })
}
