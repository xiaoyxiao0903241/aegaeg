import { formatGroupedNumber } from '~/shared/api/format-display'
import { formatTokenAmount } from '~/core/exchange/token-amount'

/** Prefer API decimal string when present; else chain amount; else dash. */
export function formatReleaseApiOrChainLabel(args: {
  sessionReady: boolean
  apiPending: boolean
  apiRaw: string | undefined
  chainReady: boolean
  chainValue: bigint
  dash: string
  decimals: number
  unit: string
}): string {
  const { sessionReady, apiPending, apiRaw, chainReady, chainValue, dash, decimals, unit } = args
  if (sessionReady && apiRaw != null && apiRaw.trim() !== '') {
    const n = Number(apiRaw)
    if (Number.isFinite(n)) return `${formatGroupedNumber(n, { digits: 4 })} ${unit}`
  }
  if (sessionReady && apiPending && apiRaw == null) return '…'
  if (chainReady) return `${formatTokenAmount(chainValue, decimals, 4)} ${unit}`
  return dash
}
