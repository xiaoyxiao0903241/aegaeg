import { formatTokenAmount } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { releaseProgressBps } from '~/core/release/release-gates'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export function formatReleaseAmount(amount: bigint, digits = 4): string {
  return formatTokenAmount(amount, AGX_DECIMALS, digits)
}

export function formatReleasePct(claimable: bigint, releasing: bigint): string {
  const bps = releaseProgressBps(claimable, releasing)
  const pct = (bps / 100).toFixed(bps % 100 === 0 ? 0 : 1)
  return `${pct}%`
}
