import { formatGroupedNumber } from '~/shared/api/format-display'
import { formatTokenAmount } from '~/core/exchange/token-amount'

/** Prefer API decimal string when present; else chain amount; else formatted zero. */
export function formatReleaseApiOrChainLabel(args: {
  sessionReady: boolean
  apiPending: boolean
  apiRaw: string | undefined
  chainReady: boolean
  chainValue: bigint
  decimals: number
  unit: string
}): string {
  const { sessionReady, apiPending, apiRaw, chainReady, chainValue, decimals, unit } = args
  if (sessionReady && apiRaw != null && apiRaw.trim() !== '') {
    const n = Number(apiRaw)
    if (Number.isFinite(n)) return `${formatGroupedNumber(n, { digits: 4 })} ${unit}`
  }
  if (chainReady) return `${formatTokenAmount(chainValue, decimals, 4)} ${unit}`
  // Cold start / disconnected — never blank; pending with keepPreviousData keeps apiRaw above.
  void apiPending
  return `${formatGroupedNumber(0, { digits: 4 })} ${unit}`
}
