import { releaseProgressBps } from '~/core/release/release-block-reasons'

/** 释放进度百分比文案：按基点换算，能整除时省略小数位 */
export function formatReleasePct(claimable: bigint, releasing: bigint): string {
  const bps = releaseProgressBps(claimable, releasing)
  const pct = (bps / 100).toFixed(bps % 100 === 0 ? 0 : 1)
  return `${pct}%`
}
