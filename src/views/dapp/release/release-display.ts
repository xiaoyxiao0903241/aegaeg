import { releaseProgressBps } from '~/core/release/release-gates'

export function formatReleasePct(claimable: bigint, releasing: bigint): string {
  const bps = releaseProgressBps(claimable, releasing)
  const pct = (bps / 100).toFixed(bps % 100 === 0 ? 0 : 1)
  return `${pct}%`
}
